import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { filterOptionsSchema, searchResponseSchema } from "@shared/schema";

const TED_API_URL = "https://api.ted.europa.eu/v3/notices/search";

// Helper to build TED EUROPA query string
function buildTEDQuery(filters: z.infer<typeof filterOptionsSchema>): string {
  const parts: string[] = [];

  // Date range - default from Oct 2025 to today
  const dateFrom = filters.dateFrom || "20251001";
  const dateTo = filters.dateTo || "today()";
  parts.push(`(publication-date>=${dateFrom.replace(/-/g, '')}<=${dateTo.replace(/-/g, '') || 'today()'})`);

  // Category-based full-text search
  if (filters.category === "document-management") {
    parts.push('(FT~"Document Management")');
  } else if (filters.category === "record-management") {
    parts.push('(FT~"Record Management")');
  } else {
    // Default: both categories
    parts.push('((FT~"Document Management") OR (FT~"Record Management"))');
  }

  // Additional search term
  if (filters.searchTerm && filters.searchTerm.trim()) {
    const searchTerm = filters.searchTerm.trim();
    parts.push(`(FT~"${searchTerm}")`);
  }

  // Language filter - always English
  parts.push("(submission-language=ENG)");

  // Note: SME participation filtering is done post-fetch since TED API
  // may not support direct SME filtering in the query string

  // Combine all parts with AND
  return parts.join(" AND ");
}

// Helper to transform TED API response to our schema
function transformTEDResponse(tedResponse: any): any {
  try {
    console.log("Raw TED Response structure:", Object.keys(tedResponse));
    
    // TED API returns notices in the "notices" array
    const noticesArray = tedResponse.notices || tedResponse.results || [];
    
    const notices = Array.isArray(noticesArray) 
      ? noticesArray
          .map((item: any, index: number) => {
            console.log(`Notice ${index} keys:`, Object.keys(item));
            
            // Extract SME participation from the "sme-part" field
            const smePart = item["sme-part"];
            const smeParticipation = 
              smePart === true ||
              smePart === "YES" ||
              smePart === "yes" ||
              smePart === "Y";
            
            // Extract document links from the "links" object
            const links = item.links || {};
            const documentLinks: any[] = [];
            
            // Add PDF links if available
            if (links.pdf) {
              Object.entries(links.pdf).forEach(([lang, url]: [string, any]) => {
                documentLinks.push({
                  url: url,
                  title: `PDF (${lang})`,
                  type: "PDF",
                });
              });
            }
            
            // Add XML links if available
            if (links.xml) {
              Object.entries(links.xml).forEach(([lang, url]: [string, any]) => {
                documentLinks.push({
                  url: url,
                  title: `XML (${lang})`,
                  type: "XML",
                });
              });
            }

            return {
              id: item["publication-number"] || item.id || `notice-${index}`,
              title: item["notice-name"] || item.title || item["publication-number"] || "RFP Notice",
              referenceNumber: item["publication-number"] || undefined,
              publicationDate: item["publication-date"] || item["dispatch-date"] || new Date().toISOString(),
              deadline: item["deadline"] || item["submission-deadline"] || undefined,
              description: item["short-description"] || item.description || undefined,
              contractingAuthority: item["contracting-authority-name"] || item["buyer-name"] || undefined,
              categories: item["main-cpv-code"] ? [item["main-cpv-code"]] : [],
              smeParticipation,
              documentLinks,
              cpvCodes: item["cpv-codes"] || [],
              country: item["country-code"] || undefined,
              value: item["estimated-value"] || undefined,
              language: "EN",
            };
          })
      : [];

    console.log(`Transformed ${notices.length} notices`);

    return {
      notices,
      total: tedResponse.total || notices.length,
      page: tedResponse.page || 1,
      pageSize: tedResponse.pageSize || notices.length,
    };
  } catch (error) {
    console.error("Error transforming TED response:", error);
    // Return empty result on transformation error
    return {
      notices: [],
      total: 0,
      page: 1,
      pageSize: 0,
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // RFP Search endpoint - proxy to TED EUROPA API
  app.post("/api/rfp/search", async (req, res) => {
    try {
      // Use default query as provided by user
      const query = "(publication-date>=20251001<=today()) AND ((FT~\"Document Management\") OR (FT~\"Record Management\") OR (FT~\"Case Management\") OR (FT~\"Call Centre\")) AND (submission-language=ENG)";

      console.log("TED EUROPA Query:", query);

      // Make request to TED EUROPA API
      // Note: TED API requires 'fields' parameter with specific supported field names
      // Using minimal set of supported fields to get the data we need
      const response = await fetch(TED_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          query,
          fields: ["sme-part"],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("TED API Error:", response.status, errorText);
        
        return res.status(response.status).json({
          error: "Failed to fetch data from TED EUROPA",
          details: errorText,
          notices: [],
          total: 0,
        });
      }

      const tedData = await response.json();
      console.log("TED API Response:", JSON.stringify(tedData, null, 2).substring(0, 500));

      // Transform response to our schema
      const transformedData = transformTEDResponse(tedData);

      // Validate response
      const validatedData = searchResponseSchema.parse(transformedData);

      res.json(validatedData);
    } catch (error) {
      console.error("Error in /api/rfp/search:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid request data",
          details: error.errors,
          notices: [],
          total: 0,
        });
      }

      res.status(500).json({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        notices: [],
        total: 0,
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

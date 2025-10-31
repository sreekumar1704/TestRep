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
    // TED API returns a complex structure - we need to extract and transform the data
    const notices = Array.isArray(tedResponse.results) 
      ? tedResponse.results
          .map((item: any, index: number) => {
            // Extract fields from the TED response structure
            // Note: The actual structure may vary - this is a best-effort transformation
            const notice = item.notice || item;
            
            // Extract SME participation from various possible field locations
            // TED API returns this in the "sme-part" field which may be at item or notice level
            // The value can be boolean, string "YES"/"NO", or other variants
            const smePart = item["sme-part"] || notice["sme-part"] || notice.smeParticipation || notice.suitableForSME || notice.sme;
            const smeParticipation = 
              smePart === true ||
              (typeof smePart === "string" && ["YES", "yes", "true", "TRUE", "Y", "1"].includes(smePart.trim()));
            
            // Extract document links with fallbacks
            const documents = notice.documents || notice.attachments || notice.links || [];
            const documentLinks = Array.isArray(documents)
              ? documents
                  .map((doc: any) => ({
                    url: doc.url || doc.link || doc.href || "",
                    title: doc.title || doc.name || doc.description || "Document",
                    type: doc.type || doc.format || doc.mimeType || undefined,
                  }))
                  .filter((doc: any) => doc.url && doc.url.trim().length > 0)
              : [];

            // Log if documents are missing for debugging
            if (documentLinks.length === 0) {
              console.warn(`Notice ${notice.id || index} has no valid document links`);
            }

            return {
              id: notice.id || notice.noticeId || `notice-${index}`,
              title: notice.title || notice.titleText || "Untitled Notice",
              referenceNumber: notice.referenceNumber || notice.noticeNumber || undefined,
              publicationDate: notice.publicationDate || notice.dispatchDate || new Date().toISOString(),
              deadline: notice.deadline || notice.tenderDeadline || notice.submissionDeadline || undefined,
              description: notice.description || notice.shortDescription || undefined,
              contractingAuthority: notice.contractingAuthority?.name || notice.buyer?.name || undefined,
              categories: notice.categories || notice.cpvCodes?.slice(0, 3) || [],
              smeParticipation,
              documentLinks,
              cpvCodes: notice.cpvCodes || [],
              country: notice.country || notice.countryCode || undefined,
              value: notice.value || notice.estimatedValue || undefined,
              language: notice.language || "EN",
            };
          })
      : [];

    return {
      notices,
      total: tedResponse.total || tedResponse.totalResults || notices.length,
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
      const query = "(publication-date>=20251001<=today()) AND ((FT~\"Document Management\") OR (FT~\"Record Management\")) AND (submission-language=ENG)";

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

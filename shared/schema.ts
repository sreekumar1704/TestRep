import { z } from "zod";

// TED EUROPA RFP Notice Schema
export const rfpNoticeSchema = z.object({
  id: z.string(),
  title: z.string(),
  referenceNumber: z.string().optional(),
  publicationDate: z.string(),
  deadline: z.string().optional(),
  description: z.string().optional(),
  contractingAuthority: z.string().optional(),
  categories: z.array(z.string()).optional(),
  smeParticipation: z.boolean().optional(),
  documentLinks: z.array(z.object({
    url: z.string(),
    title: z.string(),
    type: z.string().optional(),
  })).optional(),
  cpvCodes: z.array(z.string()).optional(),
  country: z.string().optional(),
  value: z.string().optional(),
  language: z.string().optional(),
});

export type RFPNotice = z.infer<typeof rfpNoticeSchema>;

// Search request schema
export const searchRequestSchema = z.object({
  query: z.string(),
  fields: z.array(z.string()).optional(),
  pageSize: z.number().optional(),
  page: z.number().optional(),
});

export type SearchRequest = z.infer<typeof searchRequestSchema>;

// Search response schema
export const searchResponseSchema = z.object({
  notices: z.array(rfpNoticeSchema),
  total: z.number(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
});

export type SearchResponse = z.infer<typeof searchResponseSchema>;

// Filter options schema
export const filterOptionsSchema = z.object({
  searchTerm: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  category: z.enum(["all", "document-management", "record-management"]).optional(),
  smeOnly: z.boolean().optional(),
});

export type FilterOptions = z.infer<typeof filterOptionsSchema>;

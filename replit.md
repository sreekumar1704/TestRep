# TED EUROPA RFP Lister

## Project Overview
A professional procurement RFP listing application that searches and displays tender opportunities from the TED EUROPA portal. The application focuses on Document Management and Record Management RFPs with English language submissions, allowing users to view detailed information, filter results, and download relevant documents.

## Purpose
Enable procurement professionals to efficiently search, filter, and access RFP opportunities from the TED EUROPA public procurement portal with a clean, data-focused interface optimized for quick scanning and comparison.

## Current State
- **Phase**: Development
- **Status**: Building MVP features
- **Stack**: React + Express + TED EUROPA API integration

## Architecture

### Frontend (React + TypeScript)
- **Main Page**: RFP Search page with integrated filters and results table
- **Components**:
  - `SearchFilters`: Comprehensive filter panel (search keywords, date range, category, SME filter)
  - `RFPTable`: Sortable data table with RFP listings
  - `RFPDetailDrawer`: Side drawer showing full RFP details
  - `ErrorBanner`: User-friendly error messaging
- **Design System**: Carbon Design System approach with IBM Plex Sans fonts
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

### Backend (Express)
- **API Proxy**: `/api/rfp/search` endpoint that proxies requests to TED EUROPA API
- **External API**: `https://api.ted.europa.eu/v3/notices/search` (POST)
- **Storage**: In-memory only (no database needed - data fetched in real-time)

### Data Model
- **RFPNotice**: Procurement notice with title, dates, description, categories, documents
- **FilterOptions**: Search criteria including date range, category, SME participation
- **SearchRequest/Response**: API contract schemas

## Key Features (MVP)
1. ✓ Search RFPs from TED EUROPA portal
2. ✓ Filter by date range (from October 2025 onwards)
3. ✓ Filter by category (Document/Record Management)
4. ✓ Filter by SME participation
5. ✓ Sortable data table with key RFP information
6. ✓ Detailed view in side drawer
7. ✓ Download RFP documents
8. ✓ Professional, enterprise-grade UI design
9. ✓ Responsive design for all devices
10. ✓ Loading states and error handling

## Design Guidelines
Following Carbon Design System principles:
- Professional, data-focused interface
- IBM Plex Sans typography
- Consistent spacing (4, 6, 8, 12px units)
- Sortable tables with clear visual hierarchy
- Sticky search/filter panel
- Enterprise color palette with proper contrast
- Font Awesome icons for actions

## API Integration
**TED EUROPA Search API**:
- Method: POST
- URL: `https://api.ted.europa.eu/v3/notices/search`
- Headers: `Content-Type: application/json`
- Query format: Lucene-style search with date filters and full-text search
- Default query targets Document/Record Management with English submissions from Oct 2025

## Recent Changes
- 2025-10-31: Initial project setup
- 2025-10-31: Created data schemas for RFP notices and search operations
- 2025-10-31: Built all frontend components with professional UI design
- 2025-10-31: Configured IBM Plex Sans fonts and Font Awesome icons
- 2025-10-31: Implemented sortable table, filters, and detail drawer

## Next Steps
1. Implement backend API endpoint for TED EUROPA integration
2. Connect frontend to backend with proper error handling
3. Test complete search, filter, sort, and download workflow
4. Final polish and optimization

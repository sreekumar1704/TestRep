# Design Guidelines: TED EUROPA RFP Lister

## Design Approach

**Selected Approach**: Design System - Carbon Design System (IBM)
**Justification**: This is a data-intensive, enterprise-focused application for procurement professionals. Carbon Design excels at information-dense interfaces with robust data visualization and filtering patterns. The system provides clarity, efficiency, and professional polish needed for business-critical procurement workflows.

**Core Design Principles**:
- **Efficiency First**: Minimize clicks between search and actionable results
- **Data Clarity**: Information hierarchy supports quick scanning and comparison
- **Professional Trust**: Convey reliability and authority appropriate for government procurement
- **Focused Workflow**: Remove visual noise; every element serves the user's procurement task

## Typography

**Font Family**: IBM Plex Sans (via Google Fonts CDN)
- Primary: IBM Plex Sans (400, 500, 600)
- Monospace: IBM Plex Mono (for reference numbers, dates)

**Type Scale**:
- Page Title: 2.5rem (40px), font-semibold - "TED EUROPA RFP Search"
- Section Headers: 1.5rem (24px), font-semibold
- Table Headers: 0.875rem (14px), font-medium, uppercase tracking-wide
- Body/Table Content: 0.875rem (14px), font-normal
- Labels: 0.75rem (12px), font-medium, uppercase tracking-wide
- Metadata/Secondary: 0.75rem (12px), font-normal

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, and 12
- Component padding: p-4, p-6
- Section spacing: mb-6, mb-8
- Card/panel padding: p-6
- Form elements: gap-4, space-y-4
- Table cells: px-4 py-3

**Grid Structure**:
- Container: max-w-7xl mx-auto px-4
- Search/Filter Bar: Single column, full-width sticky element
- Results Table: Full-width responsive table with horizontal scroll on mobile
- No multi-column layouts (data table is primary content)

## Component Library

### Navigation/Header
- Minimal top bar with application title and user context
- Height: h-16
- Fixed position with subtle border-bottom
- Contains: Logo/Title (left), Total results count (right)

### Search & Filter Panel
- Sticky below header (sticky top-16)
- Horizontal layout on desktop, stacked on mobile
- Components:
  - Search input with magnifying glass icon (Font Awesome)
  - Date range picker (From/To inputs)
  - Category dropdown (Document/Record Management)
  - Language filter
  - "Search" primary button and "Reset" secondary button
- All inputs same height (h-10), consistent border treatment
- Use gap-4 between filter elements

### Data Table
- Striped rows for readability (alternate row treatment)
- Columns: Title (40%), Publication Date (12%), Deadline (12%), Category (15%), SME Participation (10%), Actions (11%)
- Sortable headers with arrow icons (Font Awesome: fa-sort, fa-sort-up, fa-sort-down)
- Row height: min-h-16 for comfortable scanning
- Hover state on rows for interaction feedback
- Mobile: Card-based layout stacking table data

### RFP Row Content
- **Title**: Font-medium, truncate with tooltip on hover
- **Dates**: Monospace font, format: DD MMM YYYY
- **Category tags**: Small badges with subtle treatment
- **SME indicator**: Yes/No with icon (fa-check/fa-times)
- **Action button**: "View Details" text button + "Download" icon button (fa-download)

### Details Modal/Drawer
- Slides from right (lg:w-2/5 viewport width)
- Header: RFP title + close button
- Body sections with clear labels:
  - Reference Number (monospace)
  - Full Description
  - Key Dates (Publication, Deadline, Opening)
  - Contracting Authority
  - Category/Keywords
  - Document Links (downloadable)
- Footer: Primary "Download PDF" button

### Empty State
- Icon (Font Awesome: fa-search) centered
- Message: "No RFPs found matching your criteria"
- Secondary text: "Try adjusting your filters or date range"
- "Clear Filters" button

### Loading State
- Skeleton loaders for table rows (6-8 rows)
- Pulsing animation on skeleton elements
- Maintains table structure during load

### Status/Notification Banner
- Appears below search panel when API errors occur
- Alert variants: info, warning, error
- Icon + message + dismissible close button
- Uses gap-3 for internal spacing

## Images

**No hero image required** - This is a utility application focused on data access. Users arrive to search, not to be sold.

**Icon Library**: Font Awesome (CDN) for consistent iconography
- Search, filter, calendar, download, sort indicators, status icons
- Size: Base 1rem, large 1.25rem for key actions

## Accessibility

- All interactive elements meet 44x44px minimum touch target
- Form inputs have visible labels and placeholder text
- Table headers properly associated with data cells
- Keyboard navigation for all filters and table interactions
- Focus indicators visible on all interactive elements
- ARIA labels for icon-only buttons
- Color contrast meets WCAG AA standards minimum

## Responsive Behavior

**Desktop (1024px+)**: 
- Full table view with all columns
- Horizontal filter bar
- Modal drawer for details

**Tablet (768-1023px)**:
- Condensed table with fewer columns initially visible
- Horizontal scroll enabled
- Filters may wrap to two rows

**Mobile (<768px)**:
- Card-based layout replacing table
- Each RFP as a card with key info
- Filters stack vertically
- Full-screen modal for details

## Interaction Patterns

- **Row click**: Opens detail modal/drawer
- **Download button**: Direct PDF download (no modal)
- **Sort headers**: Toggle ascending/descending
- **Filter changes**: Auto-trigger search (debounced 300ms for text input)
- **Pagination**: Load more pattern or traditional pagination if dataset is large
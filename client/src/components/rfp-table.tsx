import { useState } from "react";
import { RFPNotice } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Eye, ArrowUpDown, ArrowUp, ArrowDown, FileText, Search } from "lucide-react";
import { format } from "date-fns";

interface RFPTableProps {
  data: RFPNotice[];
  isLoading: boolean;
  onViewDetails: (rfp: RFPNotice) => void;
  hasSearched: boolean;
}

type SortField = "title" | "publicationDate" | "deadline" | "category";
type SortDirection = "asc" | "desc" | null;

export function RFPTable({
  data,
  isLoading,
  onViewDetails,
  hasSearched,
}: RFPTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3" />
    ) : (
      <ArrowDown className="w-3 h-3" />
    );
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    let aVal: string = "";
    let bVal: string = "";

    if (sortField === "category") {
      aVal = a.categories?.[0] || "";
      bVal = b.categories?.[0] || "";
    } else if (sortField === "title") {
      aVal = a.title;
      bVal = b.title;
    } else if (sortField === "publicationDate") {
      aVal = a.publicationDate;
      bVal = b.publicationDate;
    } else if (sortField === "deadline") {
      aVal = a.deadline || "";
      bVal = b.deadline || "";
    }

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return 0;
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), "dd MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  const handleDownload = (rfp: RFPNotice, e: React.MouseEvent) => {
    e.stopPropagation();
    if (rfp.documentLinks && rfp.documentLinks.length > 0) {
      window.open(rfp.documentLinks[0].url, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-card border border-card-border rounded-md animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Search TED EUROPA RFPs
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Use the filters above to search for procurement opportunities in Document
          Management and Record Management. Click "Search" to begin.
        </p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No RFPs Found
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mb-4">
          No procurement opportunities match your search criteria. Try adjusting your
          filters or date range.
        </p>
        <Button variant="outline" data-testid="button-clear-filters-empty">
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-md overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[40%]">
                <button
                  onClick={() => handleSort("title")}
                  className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide hover-elevate active-elevate-2 px-2 py-1 -mx-2 -my-1 rounded-sm"
                  data-testid="sort-title"
                >
                  Title {getSortIcon("title")}
                </button>
              </TableHead>
              <TableHead className="w-[12%]">
                <button
                  onClick={() => handleSort("publicationDate")}
                  className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide hover-elevate active-elevate-2 px-2 py-1 -mx-2 -my-1 rounded-sm"
                  data-testid="sort-publication-date"
                >
                  Published {getSortIcon("publicationDate")}
                </button>
              </TableHead>
              <TableHead className="w-[12%]">
                <button
                  onClick={() => handleSort("deadline")}
                  className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide hover-elevate active-elevate-2 px-2 py-1 -mx-2 -my-1 rounded-sm"
                  data-testid="sort-deadline"
                >
                  Deadline {getSortIcon("deadline")}
                </button>
              </TableHead>
              <TableHead className="w-[15%]">
                <button
                  onClick={() => handleSort("category")}
                  className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide hover-elevate active-elevate-2 px-2 py-1 -mx-2 -my-1 rounded-sm"
                  data-testid="sort-category"
                >
                  Category {getSortIcon("category")}
                </button>
              </TableHead>
              <TableHead className="w-[10%] text-center">
                <span className="text-xs font-medium uppercase tracking-wide">SME</span>
              </TableHead>
              <TableHead className="w-[11%] text-right">
                <span className="text-xs font-medium uppercase tracking-wide">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((rfp, index) => (
              <TableRow
                key={rfp.id}
                className="hover-elevate cursor-pointer"
                onClick={() => onViewDetails(rfp)}
                data-testid={`row-rfp-${index}`}
              >
                <TableCell className="font-medium">
                  <div className="line-clamp-2" title={rfp.title}>
                    {rfp.title}
                  </div>
                  {rfp.referenceNumber && (
                    <div className="text-xs text-muted-foreground font-mono mt-1">
                      {rfp.referenceNumber}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {formatDate(rfp.publicationDate)}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {formatDate(rfp.deadline)}
                </TableCell>
                <TableCell>
                  {rfp.categories && rfp.categories.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {rfp.categories.slice(0, 2).map((cat, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {rfp.smeParticipation ? (
                    <i className="fas fa-check text-primary" data-testid={`icon-sme-yes-${index}`} />
                  ) : (
                    <i className="fas fa-times text-muted-foreground" data-testid={`icon-sme-no-${index}`} />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(rfp);
                      }}
                      data-testid={`button-view-${index}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => handleDownload(rfp, e)}
                      disabled={!rfp.documentLinks || rfp.documentLinks.length === 0}
                      data-testid={`button-download-${index}`}
                      title={
                        !rfp.documentLinks || rfp.documentLinks.length === 0
                          ? "No documents available"
                          : "Download document"
                      }
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

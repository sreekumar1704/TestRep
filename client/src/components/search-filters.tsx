import { FilterOptions } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, RotateCcw } from "lucide-react";

interface SearchFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export function SearchFilters({
  filters,
  onFiltersChange,
  onSearch,
  isLoading,
}: SearchFiltersProps) {
  const handleReset = () => {
    onFiltersChange({
      searchTerm: "",
      dateFrom: "",
      dateTo: "",
      category: "all",
      smeOnly: false,
    });
  };

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-card border border-card-border rounded-md p-6 space-y-4">
      {/* First Row: Search and Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Term */}
        <div className="space-y-2">
          <Label htmlFor="search-term" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Search Keywords
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="search-term"
              data-testid="input-search-term"
              placeholder="Search in RFP titles and descriptions..."
              value={filters.searchTerm || ""}
              onChange={(e) => updateFilter("searchTerm", e.target.value)}
              className="pl-9 h-10"
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
          </div>
        </div>

        {/* Date From */}
        <div className="space-y-2">
          <Label htmlFor="date-from" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Publication Date From
          </Label>
          <Input
            id="date-from"
            data-testid="input-date-from"
            type="date"
            value={filters.dateFrom || ""}
            onChange={(e) => updateFilter("dateFrom", e.target.value)}
            className="h-10 font-mono"
          />
        </div>

        {/* Date To */}
        <div className="space-y-2">
          <Label htmlFor="date-to" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Publication Date To
          </Label>
          <Input
            id="date-to"
            data-testid="input-date-to"
            type="date"
            value={filters.dateTo || ""}
            onChange={(e) => updateFilter("dateTo", e.target.value)}
            className="h-10 font-mono"
          />
        </div>
      </div>

      {/* Second Row: Category, SME Filter, and Actions */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Category */}
        <div className="space-y-2 flex-1 min-w-[200px]">
          <Label htmlFor="category" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Category
          </Label>
          <Select
            value={filters.category || "all"}
            onValueChange={(value) => updateFilter("category", value)}
          >
            <SelectTrigger id="category" data-testid="select-category" className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="document-management">Document Management</SelectItem>
              <SelectItem value="record-management">Record Management</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* SME Only */}
        <div className="flex items-center space-x-2 h-10">
          <Checkbox
            id="sme-only"
            data-testid="checkbox-sme-only"
            checked={filters.smeOnly || false}
            onCheckedChange={(checked) => updateFilter("smeOnly", checked)}
          />
          <Label
            htmlFor="sme-only"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            SME Participation Only
          </Label>
        </div>

        {/* Actions */}
        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
            data-testid="button-reset-filters"
            className="h-10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={onSearch}
            disabled={isLoading}
            data-testid="button-search"
            className="h-10"
          >
            <Search className="w-4 h-4 mr-2" />
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>
    </div>
  );
}

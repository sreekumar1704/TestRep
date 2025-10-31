import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RFPNotice } from "@shared/schema";
import { RFPTable } from "@/components/rfp-table";
import { RFPDetailDrawer } from "@/components/rfp-detail-drawer";
import { ErrorBanner } from "@/components/error-banner";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { FileText, Search } from "lucide-react";

export default function RFPSearchPage() {
  const [selectedRFP, setSelectedRFP] = useState<RFPNotice | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [errorDismissed, setErrorDismissed] = useState(false);

  const { data, isLoading, error, refetch } = useQuery<{
    notices: RFPNotice[];
    total: number;
  }>({
    queryKey: ["/api/rfp/search"],
    queryFn: async () => {
      setErrorDismissed(false);
      const res = await apiRequest("POST", "/api/rfp/search", {});
      return await res.json();
    },
    enabled: false,
  });

  const handleSearch = () => {
    setErrorDismissed(false);
    refetch();
  };

  const handleViewDetails = (rfp: RFPNotice) => {
    setSelectedRFP(rfp);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border bg-card flex items-center px-6 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">
            TED EUROPA RFP Search
          </h1>
        </div>
        {data && (
          <div className="ml-auto text-sm text-muted-foreground">
            <span className="font-mono font-medium text-foreground">
              {data.total.toLocaleString()}
            </span>{" "}
            results found
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Simple Search Button */}
        <div className="sticky top-16 z-10 bg-background pb-4">
          <div className="bg-card border border-card-border rounded-md p-6">
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              data-testid="button-search"
              className="h-10"
            >
              <Search className="w-4 h-4 mr-2" />
              {isLoading ? "Searching..." : "Search RFPs"}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Search for Document Management, Record Management, Case Management, and Call Centre RFPs from October 2025 onwards
            </p>
          </div>
        </div>

        {/* Error Banner */}
        {error && !errorDismissed && (
          <div className="mb-6">
            <ErrorBanner
              message={`Failed to fetch RFPs: ${error instanceof Error ? error.message : 'Please try again.'}`}
              onDismiss={() => setErrorDismissed(true)}
            />
          </div>
        )}

        {/* Results Table */}
        <RFPTable
          data={data?.notices || []}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
          hasSearched={data !== undefined || isLoading}
        />
      </main>

      {/* Detail Drawer */}
      <RFPDetailDrawer
        rfp={selectedRFP}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}

import { RFPNotice } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Download, ExternalLink, X } from "lucide-react";
import { format } from "date-fns";

interface RFPDetailDrawerProps {
  rfp: RFPNotice | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RFPDetailDrawer({ rfp, isOpen, onClose }: RFPDetailDrawerProps) {
  if (!rfp) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), "dd MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  const handleDownload = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-xl font-semibold leading-tight pr-8">
                {rfp.title}
              </SheetTitle>
              {rfp.referenceNumber && (
                <SheetDescription className="font-mono text-sm mt-2">
                  Ref: {rfp.referenceNumber}
                </SheetDescription>
              )}
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="px-6 py-6 space-y-6">
            {/* Key Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                  Publication Date
                </div>
                <div className="font-mono text-sm">
                  {formatDate(rfp.publicationDate)}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                  Deadline
                </div>
                <div className="font-mono text-sm">
                  {formatDate(rfp.deadline)}
                </div>
              </div>
              {rfp.country && (
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                    Country
                  </div>
                  <div className="text-sm">{rfp.country}</div>
                </div>
              )}
              {rfp.value && (
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                    Contract Value
                  </div>
                  <div className="text-sm">{rfp.value}</div>
                </div>
              )}
            </div>

            {/* Categories */}
            {rfp.categories && rfp.categories.length > 0 && (
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                  Categories
                </div>
                <div className="flex flex-wrap gap-2">
                  {rfp.categories.map((cat, i) => (
                    <Badge key={i} variant="secondary">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* SME Participation */}
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                SME Participation
              </div>
              <div className="flex items-center gap-2">
                {rfp.smeParticipation ? (
                  <>
                    <i className="fas fa-check text-primary" />
                    <span className="text-sm">Yes, suitable for SMEs</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-times text-muted-foreground" />
                    <span className="text-sm">Not specified</span>
                  </>
                )}
              </div>
            </div>

            {/* Contracting Authority */}
            {rfp.contractingAuthority && (
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                  Contracting Authority
                </div>
                <div className="text-sm">{rfp.contractingAuthority}</div>
              </div>
            )}

            {/* Description */}
            {rfp.description && (
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                  Description
                </div>
                <div className="text-sm leading-relaxed text-foreground/90">
                  {rfp.description}
                </div>
              </div>
            )}

            {/* CPV Codes */}
            {rfp.cpvCodes && rfp.cpvCodes.length > 0 && (
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                  CPV Codes
                </div>
                <div className="flex flex-wrap gap-2">
                  {rfp.cpvCodes.map((code, i) => (
                    <Badge key={i} variant="outline" className="font-mono">
                      {code}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Document Links */}
            {rfp.documentLinks && rfp.documentLinks.length > 0 && (
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
                  Available Documents
                </div>
                <div className="space-y-2">
                  {rfp.documentLinks.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 border border-border rounded-md hover-elevate"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <i className="fas fa-file-pdf text-destructive" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {doc.title}
                          </div>
                          {doc.type && (
                            <div className="text-xs text-muted-foreground">
                              {doc.type}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownload(doc.url)}
                        data-testid={`button-download-doc-${i}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <Button
            onClick={() => rfp.documentLinks && rfp.documentLinks.length > 0 && handleDownload(rfp.documentLinks[0].url)}
            disabled={!rfp.documentLinks || rfp.documentLinks.length === 0}
            data-testid="button-download-primary"
          >
            <Download className="w-4 h-4 mr-2" />
            {rfp.documentLinks && rfp.documentLinks.length > 0 ? "Download PDF" : "No Documents Available"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <Alert variant="destructive" className="relative pr-12">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8"
        onClick={onDismiss}
        data-testid="button-dismiss-error"
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}

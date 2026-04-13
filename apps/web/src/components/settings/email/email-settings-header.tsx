import { Mail } from "lucide-react";
import { RefreshButton } from "@/components/shared/refresh-button";

interface EmailSettingsHeaderProps {
  onRefresh: () => void;
  loading: boolean;
}

export function EmailSettingsHeader({
  onRefresh,
  loading,
}: EmailSettingsHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div>
        <h2 className="text-3xl flex items-center gap-2 font-bold tracking-tight">
          <Mail className="h-8 w-8 text-primary" />
          Email Integration
        </h2>
        <p className="text-muted-foreground mt-2">
          Connect your email accounts to automatically convert inbound emails
          into support tickets.
        </p>
      </div>
      <RefreshButton onClick={onRefresh} disabled={loading} />
    </div>
  );
}

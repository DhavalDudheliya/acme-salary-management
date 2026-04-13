import { Loader2 } from "lucide-react";
import { EmailConnectionCard } from "@/components/settings/email-connection-card";
import type { EmailConnectionStatus } from "@/lib/services/email.service";

interface EmailConnectionsListProps {
  status: EmailConnectionStatus | null;
  loading: boolean;
  onStatusChange: () => void;
}

export function EmailConnectionsList({
  status,
  loading,
  onStatusChange,
}: EmailConnectionsListProps) {
  if (loading && !status) {
    return (
      <div className="flex justify-center p-12 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading email connections...
      </div>
    );
  }

  const connectedCount = [status?.gmail, status?.outlook].filter(
    Boolean,
  ).length;

  return (
    <>
      <p className="text-sm text-muted-foreground">
        {connectedCount === 0
          ? "No email accounts connected yet."
          : `${connectedCount} email account${connectedCount > 1 ? "s" : ""} connected.`}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EmailConnectionCard
          provider="GMAIL"
          status={status?.gmail ?? null}
          onStatusChange={onStatusChange}
        />
        <EmailConnectionCard
          provider="OUTLOOK"
          status={status?.outlook ?? null}
          onStatusChange={onStatusChange}
        />
      </div>
    </>
  );
}

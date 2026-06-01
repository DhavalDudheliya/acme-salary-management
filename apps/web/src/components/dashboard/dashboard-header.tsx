import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@supporthub/ui/components/button";

import { RefreshButton } from "@/components/shared/refresh-button";

interface DashboardHeaderProps {
  workspaceName: string;
  loading: boolean;
  onRefresh: () => void;
}

export function DashboardHeader({
  workspaceName,
  loading,
  onRefresh,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">{workspaceName}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <RefreshButton onClick={onRefresh} disabled={loading} />
        <Button nativeButton={false} render={<Link href="/tickets" />}>
          View tickets
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

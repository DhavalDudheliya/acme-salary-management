"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@supporthub/ui/components/button";
import { Badge } from "@supporthub/ui/components/badge";
import { Separator } from "@supporthub/ui/components/separator";
import { cn } from "@supporthub/ui/lib/utils";

const statusColors: Record<string, string> = {
  OPEN: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  PENDING:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  SOLVED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  CLOSED: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

interface TicketDetailHeaderProps {
  subject: string;
  ticketNumber: number;
  status: string;
}

export function TicketDetailHeader({
  subject,
  ticketNumber,
  status,
}: TicketDetailHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex items-center gap-4 border-b border-border px-6 py-3">
      <Button variant="ghost" size="sm" onClick={() => router.push("/tickets")}>
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <h1 className="flex-1 text-lg font-semibold truncate">{subject}</h1>
      <Badge variant="outline" className="font-mono text-xs">
        #SH-{ticketNumber}
      </Badge>
      <Badge className={cn("text-xs", statusColors[status])}>{status}</Badge>
    </header>
  );
}

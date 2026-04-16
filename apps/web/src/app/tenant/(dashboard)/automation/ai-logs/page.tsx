import { AILogsPage } from "@/components/automation/ai-logs-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Decision Logs | SupportHub",
  description: "Audit trail of every AI classification decision.",
};

export default function Page() {
  return <AILogsPage />;
}

import { Metadata } from "next";
import { TicketDetailPage } from "@/components/tickets/detail/ticket-detail-page";

export const metadata: Metadata = {
  title: "Ticket Details | SupportHub",
  description: "View and manage ticket details",
};

export default function Page() {
  return <TicketDetailPage />;
}

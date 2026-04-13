import { Metadata } from "next";
import { TicketsPage } from "@/components/tickets/tickets-page";

export const metadata: Metadata = {
  title: "Tickets | SupportHub",
  description: "Manage your SupportHub tickets",
};

export default function Page() {
  return <TicketsPage />;
}

import { AssignmentRulesPage } from "@/components/automation/assignment-rules-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automation Rules | SupportHub",
  description: "Manage your ticket assignment rules.",
};

export default function Page() {
  return <AssignmentRulesPage />;
}

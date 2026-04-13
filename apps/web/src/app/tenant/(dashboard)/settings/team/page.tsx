import { TeamSettingsPage } from "@/components/settings/team/team-settings-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Settings | SupportHub",
  description: "Manage your incoming agents and sent invitations.",
};

export default function Page() {
  return <TeamSettingsPage />;
}

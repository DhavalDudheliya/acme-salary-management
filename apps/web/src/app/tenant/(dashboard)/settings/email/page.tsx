import { EmailSettingsPage } from "@/components/settings/email/email-settings-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Settings | SupportHub",
  description: "Connect your email accounts to SupportHub.",
};

export default function Page() {
  return <EmailSettingsPage />;
}

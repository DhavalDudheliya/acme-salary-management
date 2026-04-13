import { BrandingSettingsPage } from "@/components/settings/branding/branding-settings-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Branding Settings | SupportHub",
  description: "Customize the look and feel of your workspace.",
};

export default function Page() {
  return <BrandingSettingsPage />;
}

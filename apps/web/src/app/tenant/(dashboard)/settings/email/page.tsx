import { Suspense } from "react";
import { EmailSettingsPage } from "@/components/settings/email/email-settings-page";
import { Metadata } from "next";
import { Loading } from "@supporthub/ui/components/loading";

export const metadata: Metadata = {
  title: "Email Settings | SupportHub",
  description: "Connect your email accounts to SupportHub.",
};

export default function Page() {
  return (
    <Suspense fallback={<Loading fullScreen />}>
      <EmailSettingsPage />
    </Suspense>
  );
}

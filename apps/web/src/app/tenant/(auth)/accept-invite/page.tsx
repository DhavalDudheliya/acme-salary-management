import { Metadata } from "next";
import { AcceptInvitePage } from "@/components/auth/accept-invite-page";

export const metadata: Metadata = {
  title: "Accept Invitation | SupportHub",
  description: "Join your team's SupportHub workspace",
};

import { Suspense } from "react";
import { Loading } from "@supporthub/ui/components/loading";

export default function Page() {
  return (
    <Suspense fallback={<Loading fullScreen />}>
      <AcceptInvitePage />
    </Suspense>
  );
}

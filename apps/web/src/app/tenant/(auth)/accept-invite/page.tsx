import { Metadata } from "next";
import { AcceptInvitePage } from "@/components/auth/accept-invite-page";

export const metadata: Metadata = {
  title: "Accept Invitation | SupportHub",
  description: "Join your team's SupportHub workspace",
};

export default function Page() {
  return <AcceptInvitePage />;
}

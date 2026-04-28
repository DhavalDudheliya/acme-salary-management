import { Metadata } from "next";
import { Suspense } from "react";

import { Loading } from "@supporthub/ui/components/loading";

import ResetPasswordForm from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password | SupportHub",
  description: "Set a new password for your SupportHub workspace account",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loading fullScreen />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

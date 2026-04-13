import { Suspense } from "react";
import { Metadata } from "next";

import LoginForm from "@/components/auth/login-form";
import { Loading } from "@supporthub/ui/components/loading";

export const metadata: Metadata = {
  title: "Sign In | SupportHub",
  description: "Sign in to your SupportHub workspace",
};

export default function TenantLoginPage() {
  return (
    <Suspense fallback={<Loading fullScreen />}>
      <LoginForm />
    </Suspense>
  );
}

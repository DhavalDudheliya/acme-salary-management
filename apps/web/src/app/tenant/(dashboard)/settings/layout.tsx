"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { NavTabs } from "@/components/core/nav-tabs";
import { useAuth } from "@/lib/auth-context";

const settingsNav = [
  { label: "Team & Agents", href: "/settings/team" },
  { label: "Email Integration", href: "/settings/email" },
  { label: "Branding", href: "/settings/branding" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && user.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="flex flex-col min-h-full">
      <NavTabs
        items={settingsNav}
        ariaLabel="Settings Navigation"
        baseHref="/settings/team"
      />

      {/* Settings Page Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}

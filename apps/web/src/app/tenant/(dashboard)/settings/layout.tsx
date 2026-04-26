import { NavTabs } from "@/components/core/nav-tabs";

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

import { NavTabs } from "@/components/core/nav-tabs";

const automationNav = [
  { label: "Assignment Rules", href: "/automation" },
  { label: "AI Decisions", href: "/automation/ai-logs" },
];

export default function AutomationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-full">
      <NavTabs
        items={automationNav}
        ariaLabel="Automation Navigation"
        baseHref="/automation"
      />

      {/* Page Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}

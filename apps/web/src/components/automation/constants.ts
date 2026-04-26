export const TAG_CATEGORIES: Record<string, string[]> = {
  ISSUE_TYPE: [
    "Bug",
    "Feature request",
    "Question",
    "Complaint",
    "Billing issue",
    "Refund request",
    "Account access",
    "Onboarding",
  ],
  DEPARTMENT: [
    "Billing",
    "Technical support",
    "Sales",
    "Legal",
    "Compliance",
    "Enterprise",
  ],
  PRODUCT_AREA: [
    "Mobile app",
    "Web app",
    "API",
    "Integrations",
    "Dashboard",
    "Payments",
  ],
  SENTIMENT: ["Angry", "Frustrated", "Neutral", "Satisfied", "Urgent tone"],
  SLA: ["SLA breach risk", "VIP customer", "First response due"],
};

export const CATEGORY_LABELS: Record<string, string> = {
  ISSUE_TYPE: "Issue Type",
  DEPARTMENT: "Department",
  PRODUCT_AREA: "Product Area",
  SENTIMENT: "Sentiment",
  SLA: "SLA / Urgency",
};

export const CATEGORY_COLORS: Record<string, string> = {
  ISSUE_TYPE:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  DEPARTMENT:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  PRODUCT_AREA:
    "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  SENTIMENT:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  SLA: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
};

export interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

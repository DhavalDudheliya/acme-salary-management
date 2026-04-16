/**
 * Automation Service — API client for assignment rules and AI logs.
 */

import { api } from "../api";

// --- Types ---

export interface RuleCondition {
  category: string;
  tagName: string;
}

export interface RuleConditions {
  operator: "AND" | "OR";
  conditions: RuleCondition[];
}

export interface AssignmentRule {
  id: string;
  name: string;
  priority: number;
  isEnabled: boolean;
  conditions: RuleConditions;
  assigneeId: string | null;
  assignee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  strategy: "SPECIFIC" | "ROUND_ROBIN";
  setPriority: string | null;
  flagUrgent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AIDecisionLog {
  id: string;
  ticketId: string;
  ticket: {
    id: string;
    ticketNumber: number;
    subject: string;
  };
  rawResponse: unknown;
  tagsApplied: Array<{ name: string; category: string; confidence: number }>;
  tagsSuggested: Array<{ name: string; category: string; confidence: number }>;
  prioritySet: string | null;
  ruleId: string | null;
  ruleName: string | null;
  assigneeId: string | null;
  processingMs: number;
  modelVersion: string;
  createdAt: string;
}

export interface TagSuggestion {
  id: string;
  tagId: string;
  tag: { id: string; name: string; category: string };
  ticketId: string;
  confidence: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  reviewedBy: string | null;
  createdAt: string;
}

// --- Rules API ---

export const rulesService = {
  async list(): Promise<AssignmentRule[]> {
    const res = await api.get("/rules");
    return res.data;
  },

  async create(
    data: Omit<
      AssignmentRule,
      "id" | "priority" | "createdAt" | "updatedAt" | "assignee"
    >,
  ): Promise<AssignmentRule> {
    const res = await api.post("/rules", data);
    return res.data;
  },

  async update(
    id: string,
    data: Partial<AssignmentRule>,
  ): Promise<AssignmentRule> {
    const res = await api.put(`/rules/${id}`, data);
    return res.data;
  },

  async reorder(
    rules: Array<{ id: string; priority: number }>,
  ): Promise<AssignmentRule[]> {
    const res = await api.patch("/rules/reorder", { rules });
    return res.data;
  },

  async toggle(id: string, isEnabled: boolean): Promise<AssignmentRule> {
    const res = await api.patch(`/rules/${id}/toggle`, { isEnabled });
    return res.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/rules/${id}`);
  },
};

// --- AI Logs API ---

export const aiLogsService = {
  async list(params?: {
    page?: number;
    limit?: number;
    ruleId?: string;
  }): Promise<{
    logs: AIDecisionLog[];
    total: number;
    page: number;
    limit: number;
  }> {
    const res = await api.get("/ai-logs", { params });
    return res.data;
  },

  async get(id: string): Promise<AIDecisionLog> {
    const res = await api.get(`/ai-logs/${id}`);
    return res.data;
  },
};

// --- Tag Suggestions API ---

export const tagSuggestionsService = {
  async list(ticketId: string): Promise<TagSuggestion[]> {
    const res = await api.get(`/tickets/${ticketId}/suggestions`);
    return res.data;
  },

  async review(
    ticketId: string,
    suggestionId: string,
    action: "accept" | "reject",
  ): Promise<TagSuggestion> {
    const res = await api.patch(
      `/tickets/${ticketId}/suggestions/${suggestionId}`,
      { action },
    );
    return res.data;
  },
};

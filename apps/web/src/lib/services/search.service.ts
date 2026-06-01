import { api } from "../api";

export interface SearchTicketCustomer {
  name: string;
  email: string;
}

export interface SearchTicketAssignee {
  firstName: string;
  lastName: string;
}

export interface SearchTicketResult {
  id: string;
  ticketNumber: number;
  subject: string;
  descriptionSnippet: string;
  status: "OPEN" | "PENDING" | "SOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  updatedAt: string;
  customer: SearchTicketCustomer;
  assignee: SearchTicketAssignee | null;
}

export interface SearchResponse {
  tickets: SearchTicketResult[];
}

export const searchService = {
  async searchTickets(q: string, limit = 8): Promise<SearchResponse> {
    const res = await api.get<SearchResponse>("/search", {
      params: { q, limit },
    });
    return res.data;
  },
};

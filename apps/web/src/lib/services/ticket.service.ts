import { api } from "../api";

export interface TicketCustomer {
  id: string;
  name: string;
  email: string;
}

export interface TicketAssignee {
  id: string;
  firstName: string;
  lastName: string;
}

export interface TicketTag {
  id: string;
  name: string;
}

export interface TicketComment {
  id: string;
  body: string;
  isInternal: boolean;
  ticketId: string;
  authorId: string;
  author: { id: string; firstName: string; lastName: string };
  createdAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: number;
  subject: string;
  description: string;
  status: "OPEN" | "PENDING" | "SOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  customerId: string;
  customer: TicketCustomer;
  assigneeId: string | null;
  assignee: TicketAssignee | null;
  workspaceId: string;
  tags: TicketTag[];
  comments?: TicketComment[];
  _count?: { comments: number };
  createdAt: string;
  updatedAt: string;
}

export interface TicketListResponse {
  tickets: Ticket[];
  total: number;
  page: number;
  limit: number;
}

export interface ListTicketsParams {
  view?: "unsolved" | "unassigned" | "all" | "recent";
  status?: string;
  priority?: string;
  assigneeId?: string;
  page?: number;
  limit?: number;
}

export const ticketService = {
  async create(data: {
    subject: string;
    description: string;
    customerId: string;
    priority?: string;
    assigneeId?: string;
    tags?: string[];
  }): Promise<Ticket> {
    const res = await api.post("/tickets", data);
    return res.data;
  },

  async list(params: ListTicketsParams = {}): Promise<TicketListResponse> {
    const res = await api.get("/tickets", { params });
    return res.data;
  },

  async get(id: string): Promise<Ticket> {
    const res = await api.get(`/tickets/${id}`);
    return res.data;
  },

  async update(
    id: string,
    data: Partial<{
      subject: string;
      description: string;
      status: string;
      priority: string;
      assigneeId: string | null;
      tags: string[];
    }>,
  ): Promise<Ticket> {
    const res = await api.patch(`/tickets/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const res = await api.delete(`/tickets/${id}`);
    return res.data;
  },

  async addComment(
    ticketId: string,
    data: { body: string; isInternal?: boolean },
  ): Promise<TicketComment> {
    const res = await api.post(`/tickets/${ticketId}/comments`, data);
    return res.data;
  },
};

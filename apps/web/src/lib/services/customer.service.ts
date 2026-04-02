import { api } from "../api";

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerListResponse {
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
}

export const customerService = {
  async create(data: {
    email: string;
    name: string;
    phone?: string;
  }): Promise<Customer> {
    const res = await api.post("/customers", data);
    return res.data;
  },

  async list(page = 1, limit = 25): Promise<CustomerListResponse> {
    const res = await api.get("/customers", { params: { page, limit } });
    return res.data;
  },

  async get(id: string): Promise<Customer> {
    const res = await api.get(`/customers/${id}`);
    return res.data;
  },

  async update(
    id: string,
    data: Partial<{ email: string; name: string; phone: string }>,
  ): Promise<Customer> {
    const res = await api.patch(`/customers/${id}`, data);
    return res.data;
  },
};

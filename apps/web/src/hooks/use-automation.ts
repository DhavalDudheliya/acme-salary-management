import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  rulesService,
  aiLogsService,
  tagSuggestionsService,
  type AssignmentRule,
} from "@/lib/services/automation.service";
import { api } from "@/lib/api";

// --- Rules Hooks ---

export function useRules() {
  return useQuery({
    queryKey: ["automation-rules"],
    queryFn: () => rulesService.list(),
  });
}

export function useCreateRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rulesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automation-rules"] });
    },
  });
}

export function useUpdateRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssignmentRule> }) =>
      rulesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automation-rules"] });
    },
  });
}

export function useToggleRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isEnabled }: { id: string; isEnabled: boolean }) =>
      rulesService.toggle(id, isEnabled),
    onMutate: async ({ id, isEnabled }) => {
      await queryClient.cancelQueries({ queryKey: ["automation-rules"] });
      const previousRules = queryClient.getQueryData<AssignmentRule[]>([
        "automation-rules",
      ]);

      if (previousRules) {
        queryClient.setQueryData<AssignmentRule[]>(
          ["automation-rules"],
          (old) =>
            old?.map((rule) =>
              rule.id === id ? { ...rule, isEnabled } : rule,
            ),
        );
      }
      return { previousRules };
    },
    onError: (err, variables, context) => {
      if (context?.previousRules) {
        queryClient.setQueryData(["automation-rules"], context.previousRules);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["automation-rules"] });
    },
  });
}

export function useDeleteRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rulesService.remove,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["automation-rules"] });
      const previousRules = queryClient.getQueryData<AssignmentRule[]>([
        "automation-rules",
      ]);

      if (previousRules) {
        queryClient.setQueryData<AssignmentRule[]>(
          ["automation-rules"],
          (old) => old?.filter((rule) => rule.id !== id),
        );
      }
      return { previousRules };
    },
    onError: (err, id, context) => {
      if (context?.previousRules) {
        queryClient.setQueryData(["automation-rules"], context.previousRules);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["automation-rules"] });
    },
  });
}

export function useReorderRules() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rulesService.reorder,
    onMutate: async (rulesIds) => {
      await queryClient.cancelQueries({ queryKey: ["automation-rules"] });
      const previousRules = queryClient.getQueryData<AssignmentRule[]>([
        "automation-rules",
      ]);

      // Update locally to match new order (optimistic UI relies on the caller reordering,
      // but if we want to do it here, we expect the caller to pass the full new list of `{id, priority}`)
      return { previousRules };
    },
    onError: (err, variables, context) => {
      if (context?.previousRules) {
        queryClient.setQueryData(["automation-rules"], context.previousRules);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["automation-rules"] });
    },
  });
}

// --- AI Logs Hooks ---

export function useAILogs(params: { page: number; limit: number }) {
  return useQuery({
    queryKey: ["ai-logs", params.page, params.limit],
    queryFn: () => aiLogsService.list(params),
  });
}

// --- Invitations/Team hook for Agents (used in Rules Form) ---

export function useAgents() {
  return useQuery({
    queryKey: ["team-agents"],
    queryFn: async () => {
      const res = await api.get("/invitations/team");
      return (res.data?.users || res.data || []).map(
        (u: Record<string, string>) => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
        }),
      );
    },
  });
}

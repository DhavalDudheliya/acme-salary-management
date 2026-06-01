import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { searchService } from "@/lib/services/search.service";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

const MIN_QUERY_LENGTH = 2;
const DEFAULT_DEBOUNCE_MS = 300;

export function useTicketSearch(
  query: string,
  debounceMs = DEFAULT_DEBOUNCE_MS,
) {
  const debouncedQuery = useDebouncedValue(query, debounceMs);
  const trimmed = debouncedQuery.trim();

  const result = useQuery({
    queryKey: queryKeys.search.tickets(trimmed),
    queryFn: () => searchService.searchTickets(trimmed),
    enabled: trimmed.length >= MIN_QUERY_LENGTH,
    staleTime: 30_000,
  });

  return { ...result, debouncedQuery };
}

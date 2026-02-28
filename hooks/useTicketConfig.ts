import { useCallback, useEffect, useRef, useState } from "react";
import type { TicketService } from "@/services/ticket";
import type { TicketConfigValue } from "@/lib/types/ticket";
import { isApiSuccess } from "@/lib/types/api";

interface UseTicketConfigReturn {
  types: TicketConfigValue[];
  categories: TicketConfigValue[];
  priorities: TicketConfigValue[];
  urgencies: TicketConfigValue[];
  statuses: TicketConfigValue[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function filterAndSort(values: TicketConfigValue[]): TicketConfigValue[] {
  return values
    .filter((v) => v.isActive)
    .sort((a, b) => a.order - b.order);
}

export function useTicketConfig(
  ticketService: TicketService
): UseTicketConfigReturn {
  const [types, setTypes] = useState<TicketConfigValue[]>([]);
  const [categories, setCategories] = useState<TicketConfigValue[]>([]);
  const [priorities, setPriorities] = useState<TicketConfigValue[]>([]);
  const [urgencies, setUrgencies] = useState<TicketConfigValue[]>([]);
  const [statuses, setStatuses] = useState<TicketConfigValue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchConfigs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await ticketService.getConfigs();

    if (isApiSuccess(result)) {
      for (const config of result.data) {
        const sorted = filterAndSort(config.values);

        switch (config.type) {
          case "ticket_type":
            setTypes(sorted);
            break;
          case "ticket_category":
            setCategories(sorted);
            break;
          case "ticket_priority":
            setPriorities(sorted);
            break;
          case "urgency_level":
            setUrgencies(sorted);
            break;
          case "ticket_status":
            setStatuses(sorted);
            break;
        }
      }
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  }, [ticketService]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchConfigs();
  }, [fetchConfigs]);

  const refetch = useCallback(async () => {
    hasFetched.current = false;
    await fetchConfigs();
  }, [fetchConfigs]);

  return {
    types,
    categories,
    priorities,
    urgencies,
    statuses,
    isLoading,
    error,
    refetch,
  };
}

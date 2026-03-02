import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { TicketService } from "@/services/ticket";
import type { Ticket, TicketStatus } from "@/lib/types/ticket";
import { isApiSuccess } from "@/lib/types/api";
import { ticketToast } from "@/lib/toast";
import {
  DEFAULT_FILTERS,
  type TicketFilterValues,
} from "@/components/ticket/ticket-filters";
import { DEFAULT_PAGE_SIZE } from "@/components/ticket/ticket-pagination";

const SEARCH_DEBOUNCE_MS = 300;
const VALID_PAGE_SIZES = [10, 20, 50];

function parsePageSize(value: string | null): number {
  const num = Number(value);
  return VALID_PAGE_SIZES.includes(num) ? num : DEFAULT_PAGE_SIZE;
}

function parsePageNum(value: string | null): number {
  const num = Number(value);
  return num >= 1 ? Math.floor(num) : 1;
}

export interface UseTicketListReturn {
  tickets: Ticket[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters: TicketFilterValues;
  isLoading: boolean;
  hasLoadedOnce: boolean;
  hasActiveFilters: boolean;
  onFiltersChange: (filters: TicketFilterValues) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

/**
 * Domain hook for the user-facing ticket list page.
 * Manages filters, pagination, URL sync, debounced search, and data fetching.
 */
export function useTicketList(
  ticketService: TicketService,
  isAdmin: boolean
): UseTicketListReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const serviceRef = useRef(ticketService);
  serviceRef.current = ticketService;

  // Initialize state from URL params
  const [filters, setFilters] = useState<TicketFilterValues>(() => ({
    search: searchParams.get("search") || DEFAULT_FILTERS.search,
    status: searchParams.get("status") || DEFAULT_FILTERS.status,
    type: searchParams.get("type") || DEFAULT_FILTERS.type,
    category: searchParams.get("category") || DEFAULT_FILTERS.category,
    urgency: searchParams.get("urgency") || DEFAULT_FILTERS.urgency,
  }));
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(() =>
    parsePageNum(searchParams.get("page"))
  );
  const [pageSize, setPageSize] = useState(() =>
    parsePageSize(searchParams.get("limit"))
  );
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedOnce = useRef(false);

  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  // Debounce search input
  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [filters.search]);

  // Sync state to URL
  const updateUrl = useCallback(
    (overrides: {
      page?: number;
      limit?: number;
      filters?: TicketFilterValues;
      search?: string;
    }) => {
      const p = overrides.page ?? page;
      const l = overrides.limit ?? pageSize;
      const f = overrides.filters ?? filters;
      const s = overrides.search ?? debouncedSearch;

      const params = new URLSearchParams();
      if (p > 1) params.set("page", String(p));
      if (l !== DEFAULT_PAGE_SIZE) params.set("limit", String(l));
      if (f.status && f.status !== DEFAULT_FILTERS.status)
        params.set("status", f.status);
      if (f.type) params.set("type", f.type);
      if (f.category) params.set("category", f.category);
      if (f.urgency) params.set("urgency", f.urgency);
      if (s) params.set("search", s);

      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [page, pageSize, filters, debouncedSearch, pathname, router]
  );

  // Update URL when relevant state changes (skip initial mount)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    updateUrl({ search: debouncedSearch });
  }, [page, pageSize, filters.status, filters.type, filters.category, filters.urgency, debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch tickets on filter/page change
  const fetchTickets = useCallback(async () => {
    setIsLoading(true);

    const params = {
      page,
      limit: pageSize,
      status: (filters.status as TicketStatus) || undefined,
      type: filters.type || undefined,
      category: filters.category || undefined,
      urgency: filters.urgency || undefined,
      search: debouncedSearch || undefined,
      sortBy: "updatedAt" as const,
      sortOrder: "desc" as const,
    };

    const result = isAdmin
      ? await serviceRef.current.adminGetTickets(params)
      : await serviceRef.current.getMyTickets(params);

    if (isApiSuccess(result) && result.data) {
      setTickets(result.data.tickets);
      setTotalCount(result.data.total);
    } else {
      ticketToast.loadError();
    }
    setIsLoading(false);
    hasLoadedOnce.current = true;
  }, [
    page,
    pageSize,
    filters.status,
    filters.type,
    filters.category,
    filters.urgency,
    debouncedSearch,
    isAdmin,
  ]);

  useEffect(() => {
    fetchTickets();
    if (hasLoadedOnce.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [fetchTickets]);

  const onFiltersChange = useCallback((newFilters: TicketFilterValues) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const onPageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const onPageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  }, []);

  const totalPages = Math.ceil(totalCount / pageSize);
  const hasActiveFilters =
    filters.status !== DEFAULT_FILTERS.status ||
    filters.type !== DEFAULT_FILTERS.type ||
    filters.category !== DEFAULT_FILTERS.category ||
    filters.urgency !== DEFAULT_FILTERS.urgency ||
    filters.search !== DEFAULT_FILTERS.search;

  return {
    tickets,
    totalCount,
    page,
    pageSize,
    totalPages,
    filters,
    isLoading,
    hasLoadedOnce: hasLoadedOnce.current,
    hasActiveFilters,
    onFiltersChange,
    onPageChange,
    onPageSizeChange,
  };
}

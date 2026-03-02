import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { TicketService } from "@/services/ticket";
import type {
  Ticket,
  TicketStatistics,
  TicketStatus,
  AdminUser,
  UpdateTicketRequest,
} from "@/lib/types/ticket";
import { isApiSuccess } from "@/lib/types/api";
import { ticketToast } from "@/lib/toast";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_ADMIN_FILTERS,
  type AdminTicketFilterValues,
} from "@/lib/constants/ticket";
import { parsePageSize, parsePageNum } from "@/lib/utils/pagination";

export type { AdminTicketFilterValues } from "@/lib/constants/ticket";
export { DEFAULT_ADMIN_FILTERS } from "@/lib/constants/ticket";

interface RawStatsBucket {
  _id: string;
  count: number;
}

/** Transform backend aggregation array into a Record. */
function bucketToRecord(buckets: RawStatsBucket[]): Record<string, number> {
  const record: Record<string, number> = {};
  for (const b of buckets) {
    if (b._id) record[b._id] = b.count;
  }
  return record;
}

function normalizeStatistics(raw: unknown): TicketStatistics | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;

  const byStatusArr = Array.isArray(obj.byStatus) ? obj.byStatus : [];
  const byCategoryArr = Array.isArray(obj.byCategory) ? obj.byCategory : [];

  const byStatus = bucketToRecord(byStatusArr as RawStatsBucket[]);
  const byCategory = bucketToRecord(byCategoryArr as RawStatsBucket[]);

  const total = Object.values(byStatus).reduce((sum, c) => sum + c, 0);

  return {
    total,
    byStatus: byStatus as Record<TicketStatus, number>,
    byCategory,
  };
}

export interface UseAdminTicketsReturn {
  tickets: Ticket[];
  statistics: TicketStatistics | null;
  adminUsers: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters: AdminTicketFilterValues;
  sortBy: string;
  sortOrder: "asc" | "desc";
  selectedIds: Set<string>;
  isLoading: boolean;
  isUpdating: boolean;
  hasLoadedOnce: boolean;
  onFiltersChange: (filters: AdminTicketFilterValues) => void;
  onSortChange: (column: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onRowUpdate: (ticketId: string, data: UpdateTicketRequest) => Promise<void>;
  onBulkUpdate: (data: UpdateTicketRequest) => Promise<void>;
}

/**
 * Central hook for the admin tickets dashboard.
 * Manages filters, sorting, pagination, selection, data fetching, and row/bulk update actions.
 * Syncs all state to URL search params.
 */
export function useAdminTickets(
  ticketService: TicketService
): UseAdminTicketsReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const serviceRef = useRef(ticketService);
  serviceRef.current = ticketService;

  // Initialize from URL
  const [filters, setFilters] = useState<AdminTicketFilterValues>(() => ({
    search: searchParams.get("search") || DEFAULT_ADMIN_FILTERS.search,
    status: searchParams.get("status") || DEFAULT_ADMIN_FILTERS.status,
    type: searchParams.get("type") || DEFAULT_ADMIN_FILTERS.type,
    category: searchParams.get("category") || DEFAULT_ADMIN_FILTERS.category,
    urgency: searchParams.get("urgency") || DEFAULT_ADMIN_FILTERS.urgency,
    assignedTo: searchParams.get("assignedTo") || DEFAULT_ADMIN_FILTERS.assignedTo,
  }));
  const [sortBy, setSortBy] = useState(
    () => searchParams.get("sortBy") || "updatedAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    () => (searchParams.get("sortOrder") === "asc" ? "asc" : "desc")
  );
  const [page, setPage] = useState(() => parsePageNum(searchParams.get("page")));
  const [pageSize, setPageSize] = useState(() => parsePageSize(searchParams.get("limit"), DEFAULT_PAGE_SIZE));

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [statistics, setStatistics] = useState<TicketStatistics | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const hasLoadedOnce = useRef(false);

  // Sync state to URL
  const updateUrl = useCallback(
    (overrides: {
      page?: number;
      limit?: number;
      filters?: AdminTicketFilterValues;
      sortBy?: string;
      sortOrder?: string;
    }) => {
      const p = overrides.page ?? page;
      const l = overrides.limit ?? pageSize;
      const f = overrides.filters ?? filters;
      const sb = overrides.sortBy ?? sortBy;
      const so = overrides.sortOrder ?? sortOrder;

      const params = new URLSearchParams();
      if (p > 1) params.set("page", String(p));
      if (l !== DEFAULT_PAGE_SIZE) params.set("limit", String(l));
      if (f.status) params.set("status", f.status);
      if (f.type) params.set("type", f.type);
      if (f.category) params.set("category", f.category);
      if (f.urgency) params.set("urgency", f.urgency);
      if (f.assignedTo) params.set("assignedTo", f.assignedTo);
      if (f.search) params.set("search", f.search);
      if (sb !== "updatedAt") params.set("sortBy", sb);
      if (so !== "desc") params.set("sortOrder", so);

      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [page, pageSize, filters, sortBy, sortOrder, pathname, router]
  );

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    updateUrl({});
  }, [page, pageSize, filters, sortBy, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch admin users once on mount
  useEffect(() => {
    let cancelled = false;
    async function fetchAdmins() {
      const result = await serviceRef.current.getAdminUsers();
      if (isApiSuccess(result) && result.data && !cancelled) {
        setAdminUsers(result.data);
      }
    }
    fetchAdmins();
    return () => { cancelled = true; };
  }, []);

  // Fetch tickets on filter/sort/page change
  const fetchTickets = useCallback(async () => {
    setIsLoading(true);

    const params = {
      page,
      limit: pageSize,
      status: (filters.status as TicketStatus) || undefined,
      search: filters.search || undefined,
      type: filters.type || undefined,
      category: filters.category || undefined,
      urgency: filters.urgency || undefined,
      assignedTo: filters.assignedTo || undefined,
      sortBy,
      sortOrder,
    };

    const result = await serviceRef.current.adminGetTickets(params);

    if (isApiSuccess(result) && result.data) {
      setTickets(result.data.tickets);
      setTotal(result.data.total);
      setStatistics(normalizeStatistics(result.data.statistics));
    } else {
      ticketToast.loadError();
    }

    setIsLoading(false);
    hasLoadedOnce.current = true;
  }, [page, pageSize, filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const onFiltersChange = useCallback((newFilters: AdminTicketFilterValues) => {
    setFilters(newFilters);
    setPage(1);
    setSelectedIds(new Set());
  }, []);

  const onSortChange = useCallback(
    (column: string) => {
      if (column === sortBy) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortBy(column);
        setSortOrder("desc");
      }
      setPage(1);
    },
    [sortBy]
  );

  const onPageChange = useCallback((newPage: number) => {
    setPage(newPage);
    setSelectedIds(new Set());
  }, []);

  const onPageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1);
    setSelectedIds(new Set());
  }, []);

  const onSelectRow = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const onSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedIds(new Set(tickets.map((t) => t._id)));
      } else {
        setSelectedIds(new Set());
      }
    },
    [tickets]
  );

  const onRowUpdate = useCallback(
    async (ticketId: string, data: UpdateTicketRequest) => {
      setIsUpdating(true);
      try {
        const result = await serviceRef.current.updateTicket(ticketId, data);
        if (isApiSuccess(result) && result.data) {
          setTickets((prev) =>
            prev.map((t) => (t._id === ticketId ? result.data! : t))
          );
          if (data.assignedTo) {
            ticketToast.assignToMeSuccess();
          } else if (data.status) {
            ticketToast.statusChangeSuccess();
          } else if (data.internalPriority) {
            ticketToast.priorityUpdateSuccess();
          }
        } else {
          ticketToast.updateError(result.message);
        }
      } catch {
        ticketToast.updateError();
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  const onBulkUpdate = useCallback(
    async (data: UpdateTicketRequest) => {
      if (selectedIds.size === 0) return;
      setIsUpdating(true);
      try {
        const result = await serviceRef.current.adminBulkUpdate(
          Array.from(selectedIds),
          data
        );
        if (isApiSuccess(result) && result.data) {
          const { updated, failed } = result.data;
          if (failed > 0) {
            ticketToast.bulkPartialSuccess(updated, failed);
          } else {
            ticketToast.bulkUpdateSuccess(updated);
          }
          setSelectedIds(new Set());
          await fetchTickets();
        } else {
          ticketToast.updateError(result.message);
        }
      } catch {
        ticketToast.updateError();
      } finally {
        setIsUpdating(false);
      }
    },
    [selectedIds, fetchTickets]
  );

  const totalPages = Math.ceil(total / pageSize);

  return {
    tickets,
    statistics,
    adminUsers,
    total,
    page,
    pageSize,
    totalPages,
    filters,
    sortBy,
    sortOrder,
    selectedIds,
    isLoading,
    isUpdating,
    hasLoadedOnce: hasLoadedOnce.current,
    onFiltersChange,
    onSortChange,
    onPageChange,
    onPageSizeChange,
    onSelectRow,
    onSelectAll,
    onRowUpdate,
    onBulkUpdate,
  };
}

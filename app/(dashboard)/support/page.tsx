"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TicketStatsBar } from "@/components/ticket/ticket-stats-bar";
import {
  TicketFilters,
  DEFAULT_FILTERS,
} from "@/components/ticket/ticket-filters";
import type { TicketFilterValues } from "@/components/ticket/ticket-filters";
import { TicketCard } from "@/components/ticket/ticket-card";
import { TicketCardSkeleton } from "@/components/ticket/ticket-card-skeleton";
import { TicketEmptyState } from "@/components/ticket/ticket-empty-state";
import {
  TicketPagination,
  DEFAULT_PAGE_SIZE,
} from "@/components/ticket/ticket-pagination";
import { useTicketConfig, useIsAdmin } from "@/hooks";
import { useTicketService } from "@/services/ticket";
import { isApiSuccess } from "@/lib/types/api";
import { ticketToast } from "@/lib/toast";
import type { Ticket, TicketStatus } from "@/lib/types/ticket";

const SKELETON_COUNT = 4;
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

export default function SupportPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAdmin = useIsAdmin();
  const ticketService = useTicketService();
  const {
    types,
    categories,
    urgencies,
    isLoading: configLoading,
  } = useTicketConfig(ticketService);

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
  const [page, setPage] = useState(() => parsePageNum(searchParams.get("page")));
  const [pageSize, setPageSize] = useState(() => parsePageSize(searchParams.get("limit")));
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedOnce = useRef(false);

  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

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
      if (f.status && f.status !== DEFAULT_FILTERS.status) params.set("status", f.status);
      if (f.type) params.set("type", f.type);
      if (f.category) params.set("category", f.category);
      if (f.urgency) params.set("urgency", f.urgency);
      if (s) params.set("search", s);

      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [page, pageSize, filters, debouncedSearch, pathname, router]
  );

  // Update URL when relevant state changes (after debounce for search)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    updateUrl({ search: debouncedSearch });
  }, [page, pageSize, filters.status, filters.type, filters.category, filters.urgency, debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const serviceRef = useRef(ticketService);
  serviceRef.current = ticketService;

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
  }, [page, pageSize, filters.status, filters.type, filters.category, filters.urgency, debouncedSearch, isAdmin]);

  useEffect(() => {
    fetchTickets();
    if (hasLoadedOnce.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [fetchTickets]);

  const handleTicketClick = useCallback(
    (ticket: Ticket) => {
      router.push(`/tickets/${ticket.reference}`);
    },
    [router]
  );

  const handleFiltersChange = useCallback(
    (newFilters: TicketFilterValues) => {
      setFilters(newFilters);
      setPage(1);
    },
    []
  );

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
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

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-8 py-6 min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-5xl mx-auto w-full flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Support</h1>
            <p className="text-gray-600 mt-1">
              {isAdmin
                ? "Gérez tous les tickets de support."
                : "Suivez l\u2019état de vos demandes de support."}
            </p>
          </div>
          {!isAdmin && (
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg"
            >
              <Link href="/support/new">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau ticket
              </Link>
            </Button>
          )}
        </div>

        {isAdmin && (
          <TicketStatsBar tickets={tickets} isLoading={isLoading && !hasLoadedOnce.current} />
        )}

        <TicketFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          config={{ types, categories, urgencies }}
          isLoading={configLoading}
        />

        <div className="flex flex-col gap-3">
          {isLoading && !hasLoadedOnce.current ? (
            Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <TicketCardSkeleton key={i} />
            ))
          ) : tickets.length === 0 ? (
            <TicketEmptyState
              hasFilters={hasActiveFilters}
              onCreateTicket={!isAdmin ? () => router.push("/support/new") : undefined}
            />
          ) : (
            tickets.map((ticket) => (
              <TicketCard
                key={ticket._id}
                ticket={ticket}
                onClick={handleTicketClick}
              />
            ))
          )}
        </div>

        {!isLoading && totalCount > 0 && (
          <TicketPagination
            page={page}
            totalPages={totalPages}
            totalItems={totalCount}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </div>
  );
}

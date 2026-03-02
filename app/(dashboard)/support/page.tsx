"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import { useTicketConfig, useIsAdmin } from "@/hooks";
import { useTicketService } from "@/services/ticket";
import { isApiSuccess } from "@/lib/types/api";
import { ticketToast } from "@/lib/toast";
import type { Ticket, TicketStatus } from "@/lib/types/ticket";

const PAGE_SIZE = 20;
const SKELETON_COUNT = 4;
const SEARCH_DEBOUNCE_MS = 300;

export default function SupportPage() {
  const router = useRouter();
  const isAdmin = useIsAdmin();
  const ticketService = useTicketService();
  const {
    types,
    categories,
    urgencies,
    isLoading: configLoading,
  } = useTicketConfig(ticketService);

  const [filters, setFilters] = useState<TicketFilterValues>(DEFAULT_FILTERS);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedOnce = useRef(false);

  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

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

  const serviceRef = useRef(ticketService);
  serviceRef.current = ticketService;

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);

    const params = {
      page,
      limit: PAGE_SIZE,
      status: (filters.status as TicketStatus) || undefined,
      search: debouncedSearch || undefined,
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
  }, [page, filters.status, debouncedSearch, isAdmin]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (filters.type && t.type !== filters.type) return false;
      if (filters.category && t.category !== filters.category) return false;
      if (filters.urgency && t.clientUrgency !== filters.urgency) return false;
      return true;
    });
  }, [tickets, filters.type, filters.category, filters.urgency]);

  const handleTicketClick = useCallback(
    (ticket: Ticket) => {
      router.push(`/tickets/${ticket.reference}`);
    },
    [router]
  );

  const handleFiltersChange = useCallback(
    (newFilters: TicketFilterValues) => {
      const statusChanged = newFilters.status !== filters.status;
      setFilters(newFilters);
      if (statusChanged) {
        setPage(1);
      }
    },
    [filters.status]
  );

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const hasActiveFilters =
    filters.status !== "" ||
    filters.type !== "" ||
    filters.category !== "" ||
    filters.urgency !== "" ||
    filters.search !== "";

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

        <TicketStatsBar tickets={tickets} isLoading={isLoading && !hasLoadedOnce.current} />

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
          ) : filteredTickets.length === 0 ? (
            <TicketEmptyState
              hasFilters={hasActiveFilters}
              onCreateTicket={!isAdmin ? () => router.push("/support/new") : undefined}
            />
          ) : (
            filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket._id}
                ticket={ticket}
                onClick={handleTicketClick}
              />
            ))
          )}
        </div>

        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Précédent
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} sur {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Suivant
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

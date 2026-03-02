"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TicketStatsBar } from "@/components/ticket/ticket-stats-bar";
import { TicketFilters } from "@/components/ticket/ticket-filters";
import { TicketCard } from "@/components/ticket/ticket-card";
import { TicketCardSkeleton } from "@/components/ticket/ticket-card-skeleton";
import { TicketEmptyState } from "@/components/ticket/ticket-empty-state";
import { TicketPagination } from "@/components/ticket/ticket-pagination";
import { useTicketConfig, useIsAdmin, useTicketList } from "@/hooks";
import { useTicketService } from "@/services/ticket";
import type { Ticket } from "@/lib/types/ticket";

const SKELETON_COUNT = 4;

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

  const {
    tickets,
    totalCount,
    page,
    pageSize,
    totalPages,
    filters,
    isLoading,
    hasLoadedOnce,
    hasActiveFilters,
    onFiltersChange,
    onPageChange,
    onPageSizeChange,
  } = useTicketList(ticketService, isAdmin);

  const handleTicketClick = useCallback(
    (ticket: Ticket) => {
      router.push(`/tickets/${ticket.reference}`);
    },
    [router]
  );

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
          <TicketStatsBar tickets={tickets} isLoading={isLoading && !hasLoadedOnce} />
        )}

        <TicketFilters
          filters={filters}
          onFiltersChange={onFiltersChange}
          config={{ types, categories, urgencies }}
          isLoading={configLoading}
        />

        <div className="flex flex-col gap-3">
          {isLoading && !hasLoadedOnce ? (
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
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        )}
      </div>
    </div>
  );
}

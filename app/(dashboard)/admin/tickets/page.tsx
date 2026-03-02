"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { TicketPagination } from "@/components/ticket/ticket-pagination";
import {
  AdminStatsBar,
  AdminTicketFilters,
  AdminTicketTable,
  AdminBulkToolbar,
} from "@/components/ticket/admin";
import { useSession, useIsAdmin } from "@/hooks";
import { useTicketConfig } from "@/hooks/useTicketConfig";
import { useAdminTickets } from "@/hooks/useAdminTickets";
import { useTicketService } from "@/services/ticket";
import type { TicketStatus } from "@/lib/types/ticket";

export default function AdminTicketsPage() {
  const router = useRouter();
  const session = useSession();
  const isAdmin = useIsAdmin();
  const ticketService = useTicketService();
  const {
    types,
    categories,
    urgencies,
    isLoading: configLoading,
  } = useTicketConfig(ticketService);

  const admin = useAdminTickets(ticketService);

  useEffect(() => {
    if (!session.loading && (!session.user || !isAdmin)) {
      router.push("/");
    }
  }, [session.loading, session.user, isAdmin, router]);

  useEffect(() => {
    if (admin.hasLoadedOnce) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [admin.page, admin.hasLoadedOnce]);

  const handleStatusCardClick = useCallback(
    (status: string) => {
      admin.onFiltersChange({ ...admin.filters, status });
    },
    [admin]
  );

  const handleRowClick = useCallback(
    (reference: string) => {
      router.push(`/tickets/${reference}`);
    },
    [router]
  );

  if (session.loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!session.user || !isAdmin) return null;

  const hasBulkSelection = admin.selectedIds.size > 0;

  return (
    <AuthGuard>
      <div className="flex flex-col gap-6 px-4 lg:px-8 py-6 min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestion des tickets
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez tous les tickets de support depuis cette page.
            </p>
          </div>

          {/* Stats Bar */}
          <AdminStatsBar
            statistics={admin.statistics}
            activeStatus={admin.filters.status}
            onStatusClick={handleStatusCardClick}
            isLoading={admin.isLoading && !admin.hasLoadedOnce}
          />

          {/* Filters */}
          <AdminTicketFilters
            filters={admin.filters}
            onFiltersChange={admin.onFiltersChange}
            config={{ types, categories, urgencies }}
            adminUsers={admin.adminUsers}
            isLoading={configLoading}
          />

          {/* Table */}
          <AdminTicketTable
            tickets={admin.tickets}
            selectedIds={admin.selectedIds}
            sortBy={admin.sortBy}
            sortOrder={admin.sortOrder}
            isLoading={admin.isLoading}
            hasLoadedOnce={admin.hasLoadedOnce}
            currentUserId={session.user._id}
            onRowClick={handleRowClick}
            onSelectRow={admin.onSelectRow}
            onSelectAll={admin.onSelectAll}
            onSortChange={admin.onSortChange}
            onRowUpdate={admin.onRowUpdate}
          />

          {/* Pagination */}
          {!admin.isLoading && admin.total > 0 && (
            <TicketPagination
              page={admin.page}
              totalPages={admin.totalPages}
              totalItems={admin.total}
              pageSize={admin.pageSize}
              onPageChange={admin.onPageChange}
              onPageSizeChange={admin.onPageSizeChange}
            />
          )}

          {/* Bulk Toolbar */}
          {hasBulkSelection && (
            <AdminBulkToolbar
              selectedCount={admin.selectedIds.size}
              adminUsers={admin.adminUsers}
              isUpdating={admin.isUpdating}
              onBulkStatusChange={(status: TicketStatus) =>
                admin.onBulkUpdate({ status })
              }
              onBulkAssign={(userId: string) =>
                admin.onBulkUpdate({ assignedTo: userId })
              }
              onBulkPriorityChange={(priority: string) =>
                admin.onBulkUpdate({ internalPriority: priority })
              }
              onClearSelection={() => admin.onSelectAll(false)}
            />
          )}
        </div>
      </div>
    </AuthGuard>
  );
}

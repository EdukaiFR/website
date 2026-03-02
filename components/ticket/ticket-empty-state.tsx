"use client";

import { Inbox, Search } from "lucide-react";

interface TicketEmptyStateProps {
  hasFilters: boolean;
  onCreateTicket?: () => void;
}

/**
 * Empty state displayed when no tickets match the current filters or the user has no tickets.
 * @param hasFilters - Whether active filters are applied
 * @param onCreateTicket - Optional callback to trigger ticket creation
 * @returns A centered message with an icon and contextual guidance
 */
export function TicketEmptyState({
  hasFilters,
  onCreateTicket,
}: TicketEmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Search className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700">
          Aucun ticket trouvé
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Aucun ticket ne correspond à vos filtres. Essayez de modifier vos
          critères de recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox className="h-12 w-12 text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700">
        Aucun ticket pour le moment
      </h3>
      <p className="text-sm text-gray-500 mt-1">
        Vous n&apos;avez pas encore créé de ticket.{" "}
        {onCreateTicket && (
          <button
            type="button"
            onClick={onCreateTicket}
            className="text-blue-600 hover:text-blue-700 font-medium underline"
          >
            Créer un ticket
          </button>
        )}
      </p>
    </div>
  );
}

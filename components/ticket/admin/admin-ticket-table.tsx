"use client";

import { useCallback } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  MoreHorizontal,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ticket/status-badge";
import { cn } from "@/lib/utils";
import {
  URGENCY_COLORS,
  URGENCY_LABELS,
  DEFAULT_URGENCY_COLOR,
  TYPE_LABELS,
  STATUS_LABELS,
  translateLabel,
} from "@/lib/constants/ticket";
import {
  resolveUserName,
  formatTicketDate,
  formatCompactRelativeDate,
  getStatusTransitions,
} from "@/lib/utils/ticket-helpers";
import type { Ticket, UpdateTicketRequest } from "@/lib/types/ticket";

type AdminTicket = Ticket & { hasUnreadAdminMessages?: boolean };

interface AdminTicketTableProps {
  tickets: Ticket[];
  selectedIds: Set<string>;
  sortBy: string;
  sortOrder: "asc" | "desc";
  isLoading: boolean;
  hasLoadedOnce: boolean;
  currentUserId: string;
  onRowClick: (reference: string) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onSortChange: (column: string) => void;
  onRowUpdate: (ticketId: string, data: UpdateTicketRequest) => Promise<void>;
}

const SKELETON_ROW_COUNT = 10;
const SORTABLE_COLUMNS = ["createdAt", "updatedAt", "internalPriority"];

/**
 * Admin ticket data table with sortable columns, checkbox selection,
 * per-row dropdown actions, and optional unread indicator.
 */
export function AdminTicketTable({
  tickets,
  selectedIds,
  sortBy,
  sortOrder,
  isLoading,
  hasLoadedOnce,
  currentUserId,
  onRowClick,
  onSelectRow,
  onSelectAll,
  onSortChange,
  onRowUpdate,
}: AdminTicketTableProps) {
  const allSelected =
    tickets.length > 0 && tickets.every((t) => selectedIds.has(t._id));
  const someSelected =
    tickets.some((t) => selectedIds.has(t._id)) && !allSelected;

  const handleSelectAllChange = useCallback(
    (checked: boolean) => {
      onSelectAll(checked);
    },
    [onSelectAll]
  );

  if (isLoading && !hasLoadedOnce) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10" />
              <TableHead className="w-[120px]">Référence</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead className="w-[110px]">Statut</TableHead>
              <TableHead className="w-[100px]">Priorité</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[140px]">Assigné à</TableHead>
              <TableHead className="w-[130px]">Créé le</TableHead>
              <TableHead className="w-[130px]">Mis à jour</TableHead>
              <TableHead className="w-[48px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-14 rounded-md" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-4" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-12 text-center">
        <p className="text-sm text-gray-500">Aucun ticket trouvé.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected ? true : someSelected ? "indeterminate" : false}
                onCheckedChange={handleSelectAllChange}
                aria-label="Sélectionner tout"
              />
            </TableHead>
            <TableHead className="w-[120px]">Référence</TableHead>
            <TableHead>Titre</TableHead>
            <SortableHead
              column="status"
              label="Statut"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSortChange}
              isSortable={false}
            />
            <SortableHead
              column="internalPriority"
              label="Priorité"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSortChange}
            />
            <TableHead className="w-[100px]">Type</TableHead>
            <TableHead className="w-[140px]">Assigné à</TableHead>
            <SortableHead
              column="createdAt"
              label="Créé le"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSortChange}
            />
            <SortableHead
              column="updatedAt"
              label="Mis à jour"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSortChange}
            />
            <TableHead className="w-[48px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TicketRow
              key={ticket._id}
              ticket={ticket as AdminTicket}
              isSelected={selectedIds.has(ticket._id)}
              currentUserId={currentUserId}
              onRowClick={onRowClick}
              onSelectRow={onSelectRow}
              onRowUpdate={onRowUpdate}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface SortableHeadProps {
  column: string;
  label: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (column: string) => void;
  isSortable?: boolean;
}

function SortableHead({
  column,
  label,
  sortBy,
  sortOrder,
  onSort,
  isSortable = SORTABLE_COLUMNS.includes(column),
}: SortableHeadProps) {
  if (!isSortable) {
    return <TableHead className="w-[110px]">{label}</TableHead>;
  }

  const isActive = sortBy === column;

  return (
    <TableHead
      className="w-[130px] cursor-pointer select-none hover:bg-gray-50 transition-colors"
      onClick={() => onSort(column)}
    >
      <span className="flex items-center gap-1">
        {label}
        {isActive ? (
          sortOrder === "asc" ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )
        ) : (
          <ChevronsUpDown className="h-3 w-3 opacity-40" />
        )}
      </span>
    </TableHead>
  );
}

interface TicketRowProps {
  ticket: AdminTicket;
  isSelected: boolean;
  currentUserId: string;
  onRowClick: (reference: string) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onRowUpdate: (ticketId: string, data: UpdateTicketRequest) => Promise<void>;
}

function TicketRow({
  ticket,
  isSelected,
  currentUserId,
  onRowClick,
  onSelectRow,
  onRowUpdate,
}: TicketRowProps) {
  const priorityColors =
    URGENCY_COLORS[ticket.internalPriority] ?? DEFAULT_URGENCY_COLOR;
  const priorityLabel = translateLabel(
    ticket.internalPriority,
    URGENCY_LABELS,
    ticket.internalPriority
  );
  const typeLabel = translateLabel(ticket.type, TYPE_LABELS, ticket.type);
  const assigneeName = resolveUserName(ticket.assignedTo);

  return (
    <TableRow
      className={cn(
        "cursor-pointer transition-colors",
        isSelected && "bg-blue-50/50"
      )}
      onClick={() => onRowClick(ticket.reference)}
    >
      <TableCell onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) =>
            onSelectRow(ticket._id, checked === true)
          }
          aria-label={`Sélectionner ${ticket.reference}`}
        />
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          {ticket.hasUnreadAdminMessages && (
            <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
          )}
          <span className="font-mono text-xs text-gray-600">
            {ticket.reference}
          </span>
        </div>
      </TableCell>

      <TableCell>
        <span className="text-sm font-medium text-gray-900 truncate block max-w-[280px]">
          {ticket.title}
        </span>
      </TableCell>

      <TableCell>
        <StatusBadge status={ticket.status} />
      </TableCell>

      <TableCell>
        {ticket.internalPriority ? (
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-medium",
              priorityColors.bg,
              priorityColors.text,
              priorityColors.border
            )}
          >
            {priorityLabel}
          </span>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        )}
      </TableCell>

      <TableCell>
        <span className="text-xs text-gray-600">{typeLabel}</span>
      </TableCell>

      <TableCell>
        <span className="text-xs text-gray-600">
          {assigneeName ?? "—"}
        </span>
      </TableCell>

      <TableCell>
        <span className="text-xs text-gray-500">
          {formatTicketDate(ticket.createdAt)}
        </span>
      </TableCell>

      <TableCell>
        <span className="text-xs text-gray-500">
          {formatCompactRelativeDate(ticket.updatedAt)}
        </span>
      </TableCell>

      <TableCell onClick={(e) => e.stopPropagation()}>
        <TicketActionMenu
          ticket={ticket}
          currentUserId={currentUserId}
          onRowUpdate={onRowUpdate}
          onRowClick={onRowClick}
        />
      </TableCell>
    </TableRow>
  );
}

interface TicketActionMenuProps {
  ticket: Ticket;
  currentUserId: string;
  onRowUpdate: (ticketId: string, data: UpdateTicketRequest) => Promise<void>;
  onRowClick: (reference: string) => void;
}

function TicketActionMenu({
  ticket,
  currentUserId,
  onRowUpdate,
  onRowClick,
}: TicketActionMenuProps) {
  const transitions = getStatusTransitions(ticket.status);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onRowClick(ticket.reference)}>
          Voir le ticket
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            onRowUpdate(ticket._id, { assignedTo: currentUserId })
          }
        >
          Assigner à moi
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {transitions.length > 0 && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Changer le statut</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {transitions.map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => onRowUpdate(ticket._id, { status: s })}
                >
                  {STATUS_LABELS[s] ?? s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Changer la priorité</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {Object.entries(URGENCY_LABELS).map(([key, label]) => (
              <DropdownMenuItem
                key={key}
                onClick={() =>
                  onRowUpdate(ticket._id, { internalPriority: key })
                }
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { SummarySheetActions } from "@/components/data-table/SummarySheetsActions";
import { SortableHeader } from "@/components/data-table/SortableHeader";
import { formatDate } from "@/lib/date-format";
import { ColumnDef } from "@tanstack/react-table";

export type SummarySheet = {
    id: number;
    src: string;
    alt: string;
    added_at: string;
    origin: string;
};

export const columns: ColumnDef<SummarySheet>[] = [
    {
        accessorKey: "alt",
        header: ({ column }) => (
            <SortableHeader
                column={column}
                title="Nom du fichier"
                className="w-[50px] satoshi-medium"
            />
        ),
        cell: ({ row }) => (
            <p className="satoshi-medium">{row.getValue("alt")}</p>
        ),
        enableSorting: true,
    },
    {
        accessorKey: "added_at",
        header: ({ column }) => (
            <SortableHeader
                column={column}
                title="Date d'ajout"
                className="w-[50px] satoshi-medium"
            />
        ),
        cell: ({ row }) => (
            <p className="satoshi-medium">
                {formatDate(
                    new Date(
                        row.getValue("added_at") as string
                    ).toLocaleDateString("fr-FR")
                )}
            </p>
        ),
        enableSorting: true,
    },
    {
        accessorKey: "origin",
        header: ({ column }) => (
            <SortableHeader
                column={column}
                title="Ajouté par"
                className="w-[50px] satoshi-medium"
            />
        ),
        cell: ({ row }) => (
            <p className="satoshi-medium">{row.getValue("origin")}</p>
        ),
        enableSorting: true,
    },
    {
        accessorKey: "actions",
        header: () => (
            <div className="w-full flex justify-end items-center satoshi-medium">
                Actions
            </div>
        ), // Align the title to the right
        cell: ({ row }) => (
            <div className="flex items-center justify-end w-full gap-2">
                <SummarySheetActions row={row} />
            </div>
        ),
    },
];

"use client";

import { ResumeFileActions } from "@/components/data-table/ResumeFilesActions";
import { SortableHeader } from "@/components/data-table/SortableHeader";
import { formatDate } from "@/lib/date-format";
import { ColumnDef } from "@tanstack/react-table";

export type ResumeFile = {
  id: number;
  src: string;
  alt: string;
  added_at: string;
  origin: string;
};

export const columns: ColumnDef<ResumeFile>[] = [
  {
    accessorKey: "alt",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Nom du fichier"
        className="w-[50px] satoshi-medium"
      />
    ),
    cell: ({ row }) => <p className="satoshi-medium">{row.getValue("alt")}</p>,
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
          new Date(row.getValue("added_at") as string).toLocaleDateString(
            "fr-FR"
          )
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
    ), // Aligner le titre à droite
    cell: ({ row }) => (
      <div className="flex justify-end w-full">
        <ResumeFileActions row={row} />
      </div>
    ),
  },
];

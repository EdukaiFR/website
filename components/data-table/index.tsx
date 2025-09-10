"use client";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { TableFooter } from "./Footer";
import TableHeader from "./TableHeader";

export interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = React.useState({});
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            rowSelection,
            sorting,
        },
        initialState: {
            pagination: {
                pageSize: 20,
                pageIndex: 0,
            },
        },
    });

    return (
        <ScrollArea className="w-[18rem] md:w-[20rem] lg:w-full overflow-x-hidden">
            <div className="flex flex-col pb-2 w-full">
                <div className="rounded-md border relative w-full min-w-[800px]">
                    <Table className="p-4 min-w-[800px]">
                        <TableHeader table={table} />
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map(row => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        Aucun résultat.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TableFooter table={table} />
            </div>
            <ScrollBar className="flex lg:hidden" orientation="horizontal" />
        </ScrollArea>
    );
}

import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export function Pagination<TData>({ table }: { table: Table<TData> }) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        className="hidden h-8 w-8 p-0 lg:flex"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        <span className="sr-only">Go to first page</span>
        <ChevronsLeft />
      </Button>
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <span className="sr-only">Go to previous page</span>
        <ChevronLeft />
      </Button>
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <span className="sr-only">Go to next page</span>
        <ChevronRight />
      </Button>
      <Button
        variant="outline"
        className="hidden h-8 w-8 p-0 lg:flex"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        <span className="sr-only">Go to last page</span>
        <ChevronsRight />
      </Button>
    </div>
  );
}

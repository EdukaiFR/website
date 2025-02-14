import { flexRender } from "@tanstack/react-table";

import {
  TableHead,
  TableHeader as ShadTableHeader,
  TableRow,
} from "@/components/ui/table";
import { Table } from "@tanstack/react-table";

const TableHeader = <TData, _>({ table }: { table: Table<TData> }) => {
  return (
    <ShadTableHeader className="bg-table-headerBackground">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead
                key={header.id}
                className="h-[34px] font-normal uppercase text-xs text-gray-500"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </ShadTableHeader>
  );
};

export default TableHeader;

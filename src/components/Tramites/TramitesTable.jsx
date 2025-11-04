import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { getTramiteColumns } from "./TramitesColums";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TramitesTable({
  tramites,
  refresh,
  onToggle,
  onDelete,
  glosasData,
  setGlosasData,
  onSubmit
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const columns = getTramiteColumns({
    refresh,
    onToggle,
    onDelete,
    glosasData,
    setGlosasData,
    onSubmit,
  });

  const table = useReactTable({
    data: tramites,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 500 } },
  });

  return (
    <div className="w-full">
      {/* Controles superiores */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Mostrando</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border border-gray-200  px-2 py-1 text-sm text-gray-700"
          >
            {[10, 25, 50, 100, 500].map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700">entradas</span>
        </div>
        <div>
            <span className="text-sm text-gray-700"> Filtro: </span>
            <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="border border-gray-500 rounded px-3 py-1 text-sm text-gray-700"
            />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto  rounded-md">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-500 text-white">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-3 py-2 text-left cursor-pointer"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: " ↑",
                      desc: " ↓",
                    }[header.column.getIsSorted()] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`border-b hover:bg-gray-100 ${
                  row.original.tre_hab ? "" : "bg-red-100"
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-3 text-xs text-gray-600">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
        <span>
          Mostrando{" "}
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            tramites.length
          )}{" "}
          de {tramites.length} entradas
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border px-2 py-1 rounded disabled:opacity-50 flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <span>{table.getState().pagination.pageIndex + 1}</span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border px-2 py-1 rounded disabled:opacity-50 flex items-center gap-1"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

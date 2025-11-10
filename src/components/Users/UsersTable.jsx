import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useState } from "react";
import { getUserColumns } from "./UsersColums";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function UsersTable({ users = [], isBlocked = false, refresh }) {
  const [globalFilter, setGlobalFilter] = useState("");
const columns = getUserColumns(isBlocked, refresh);

  const table = useReactTable({
    data: users,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 500, // <--- CAMBIO AQUÍ
      },
    },
  });

  return (
    <div className="w-full">
        {/* Título */}
      <div className="flex justify-center mb-2">
        <button className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md font-semibold">
          {isBlocked ? "Lista de Usuarios Bloqueados" : "Lista de Usuarios"}
        </button>
      </div>
      {/* Filtro y controles superiores */}
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
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-3 py-2 cursor-pointer select-none text-left hover:bg-gray-400"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
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
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b border-x border-gray-300 hover:bg-gray-300">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-3 py-2 text-left text-xs text-gray-500">
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
            users.length
          )}{" "}
          de {users.length} entradas
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

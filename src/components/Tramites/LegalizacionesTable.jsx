import React, { useMemo, useState } from "react";
import LegalizacionesColumns from "./LegalizacionesColums";

export default function LegalizacionesTable({ tramites, loading, error, selectedDate }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(500);

    const filtered = useMemo(() => {
    return tramites.filter((t) =>
        (t.per_nombre ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.per_ci ?? "").includes(searchTerm)
    );
}, [tramites, searchTerm]);


    const currentRows = filtered.slice(0, rowsPerPage);

    const columns = LegalizacionesColumns();

    return (
        <div>

            {/* Título tabla */}
            <div className="mb-4">
                <h2 className="text-2xl font-semibold text-center">Trámites de Legalización</h2>
                <span className="text-sm font-medium text-blue-600">
                    Fecha:{" "}
                    {new Date(selectedDate).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })}
                </span>
            </div>

            {/* Filtros tabla */}
            <div className="flex justify-between mb-4">

                {/* Entradas */}
                <div className="flex items-center gap-2 text-sm">
                    <span>Mostrando</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
                        className="border border-gray-400 rounded p-1"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="500">500</option>
                    </select>
                    <span>entradas</span>
                </div>

                {/* Búsqueda */}
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filtrar..."
                    className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500 w-40"
                />
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto rounded-lg">
                {loading ? (
                    <p className="text-center p-4 text-gray-500">Cargando...</p>
                ) : error ? (
                    <p className="text-center text-red-500 p-4">{error}</p>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">

                        {/* Encabezados */}
                        <thead className="bg-gray-500">
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={col.header}
                                        className="px-3 py-2 text-left text-xs font-semibold text-white uppercase"
                                    >
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Filas */}
                        <tbody className="bg-white divide-y divide-gray-200  ">
                            {currentRows.map((row, index) => (
                                <tr key={row.cod_tra} className="hover:bg-gray-200">
                                    {columns.map((col) => (
                                        <td
                                            key={col.accessorKey}
                                            className="px-3 py-2 text-xs "
                                        >
                                            {col.cell({
                                                row,
                                                value: row[col.accessorKey],
                                                index,
                                            })}
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            {currentRows.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="text-center p-4 text-gray-500">
                                        No hay trámites para esta fecha.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

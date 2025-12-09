import React, { useMemo, useState, useCallback } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
  Tooltip
} from "@heroui/react";
import { useApostilla } from '../../hooks/useApostilla';
import { useModal } from '../../hooks/useModal';
import EditApostillaModal from '../../modals/apostilla/EditApostillaModal';
import EliminarApostillaModal from '../../modals/apostilla/EliminarApostillaModal';
import { Pencil, SquareCheck, SquareX, Trash2, Search } from 'lucide-react';

export default function DocumentosApostillaTable({ documentos, onReload }) {
  const { habilitarDocumento } = useApostilla();
  const { openModal } = useModal();
  
  // Estados
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(500);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: null,
    direction: null,
  });

  // Definición de columnas con sorting
  const columns = [
    { key: "numero", label: "Nº", sortable: false },
    { key: "lis_nombre", label: "NOMBRE", sortable: true },
    { key: "lis_cuenta", label: "N° CUENTA", sortable: true },
    { key: "lis_asociado", label: "ASOCIADO", sortable: true },
    { key: "lis_monto", label: "COSTO", sortable: true },
    { key: "opciones", label: "OPCIONES", sortable: false },
  ];

  // Filtrado
  const filteredItems = useMemo(() => {
    let filtered = [...documentos];

    if (filterValue) {
      filtered = filtered.filter((doc) =>
        doc.lis_nombre?.toLowerCase().includes(filterValue.toLowerCase()) ||
        doc.lis_alias?.toLowerCase().includes(filterValue.toLowerCase()) ||
        doc.lis_cuenta?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filtered;
  }, [documentos, filterValue]);

  // Ordenamiento
  const sortedItems = useMemo(() => {
    if (!sortDescriptor.column) return filteredItems;

    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      
      // Manejar valores nulos o undefined
      if (first == null) return 1;
      if (second == null) return -1;
      
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [filteredItems, sortDescriptor]);

  // Paginación
  const pages = Math.ceil(sortedItems.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedItems.slice(start, end);
  }, [page, sortedItems, rowsPerPage]);

  // Handlers
  const onSearchChange = useCallback((value) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const handleEditar = (cod_lis) => {
    openModal(EditApostillaModal, { cod_lis, onSuccess: onReload });
  };

  const handleEliminar = (cod_lis) => {
    openModal(EliminarApostillaModal, { cod_lis, onSuccess: onReload });
  };

  const handleHabilitar = async (cod_lis) => {
    await habilitarDocumento(cod_lis);
  };

  // Renderizado de celdas
  const renderCell = useCallback((item, columnKey, index) => {
    const isDeshabilitado = item.lis_hab === 'f';

    switch (columnKey) {
      case "numero":
        return (
          <span className="text-blue-600 font-bold">
            {(page - 1) * rowsPerPage + index + 1}
          </span>
        );

      case "lis_nombre":
        return (
          <span className={isDeshabilitado ? "text-gray-400" : ""}>
            {item.lis_nombre}
          </span>
        );

      case "lis_cuenta":
        return <span>{item.lis_cuenta}</span>;

      case "lis_asociado":
        return <span className="uppercase">{item.lis_asociado || '-'}</span>;

      case "lis_monto":
        return <span className="font-semibold">{item.lis_monto} Bs.</span>;

      case "opciones":
        return (
          <div className="flex items-center justify-center gap-2">
            <Tooltip content="Editar trámite">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="primary"
                onClick={() => handleEditar(item.cod_lis)}
              >
                <Pencil size={20} />
              </Button>
            </Tooltip>

            <Tooltip content={isDeshabilitado ? "Habilitar" : "Deshabilitar"}>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color={isDeshabilitado ? "danger" : "success"}
                onClick={() => handleHabilitar(item.cod_lis)}
              >
                {isDeshabilitado ? (
                  <SquareCheck size={20} />
                ) : (
                  <SquareX size={20} />
                )}
              </Button>
            </Tooltip>

            <Tooltip content="Eliminar trámite" color="danger">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onClick={() => handleEliminar(item.cod_lis)}
              >
                <Trash2 size={20} />
              </Button>
            </Tooltip>
          </div>
        );

      default:
        return item[columnKey];
    }
  }, [page, rowsPerPage, handleEditar, handleEliminar, handleHabilitar]);

  // Contenido superior
  const topContent = useMemo(() => {
    return (
      <div className="flex justify-between items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Mostrando</span>
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={rowsPerPage}
            onChange={onRowsPerPageChange}
          >
            {[10, 25, 50, 100, 500].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700">entradas</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Filtro:</span>
          <Input
            isClearable
            size="sm"
            placeholder="Buscar por nombre, alias o cuenta..."
            startContent={<Search className="w-4 h-4" />}
            value={filterValue}
            onClear={() => onSearchChange("")}
            onValueChange={onSearchChange}
            className="w-80"
          />
        </div>
      </div>
    );
  }, [filterValue, rowsPerPage, onSearchChange, onRowsPerPageChange]);

  // Contenido inferior
  const bottomContent = useMemo(() => {
    const start = (page - 1) * rowsPerPage + 1;
    const end = Math.min(page * rowsPerPage, sortedItems.length);

    return (
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          Mostrando {start} a {end} de {sortedItems.length} entradas
        </span>
        {pages > 1 && (
          <Pagination
            showControls
            page={page}
            total={pages}
            onChange={setPage}
            size="sm"
          />
        )}
      </div>
    );
  }, [page, pages, rowsPerPage, sortedItems.length]);

  return (
    <div className="w-full">
      {topContent}
      <Table
        aria-label="Tabla de documentos de apostilla"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        classNames={{
          wrapper: "shadow-md",
          th: "bg-gray-500 text-white",
          td: "text-gray-600",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              allowsSorting={column.sortable}
              align={
                column.key === "numero" || column.key === "opciones"
                  ? "center"
                  : column.key === "lis_monto"
                  ? "end"
                  : "start"
              }
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent="No hay documentos disponibles">
          {(item) => (
            <TableRow
              key={item.cod_lis}
              className={item.lis_hab === 'f' ? "bg-red-50" : ""}
            >
              {(columnKey) => (
                <TableCell
                  className={
                    columnKey === "numero" || columnKey === "opciones"
                      ? "text-center"
                      : columnKey === "lis_monto"
                      ? "text-right"
                      : ""
                  }
                >
                  {renderCell(item, columnKey, items.indexOf(item))}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {bottomContent}
    </div>
  );
}
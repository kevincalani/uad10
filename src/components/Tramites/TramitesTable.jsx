import React, { useState, useMemo, useCallback } from "react";
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
  Chip,
} from "@heroui/react";
import {
  SquarePen,
  AlignJustify,
  SquareCheck,
  SquareX,
  Trash2,
  Search,
} from "lucide-react";
import { useModal } from "../../hooks/useModal";
import AddEditTramiteModal from "../../modals/AddEditTramiteModal";
import GlosaModal from "../../modals/GlosaModal";
import DeleteTramiteModal from "../../modals/DeleteTramiteModal";
import { TRAMITE_COLORS } from "../../Constants/tramiteDatos";

export default function TramitesTable({
  tramites,
  refresh,
  onToggle,
  onDelete,
  onSubmit,
}) {
  const { openModal } = useModal();
  
  // Estados
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: null,
    direction: null,
  });

  // Definición de columnas
  const columns = [
    { key: "numero", label: "N°", sortable: false },
    { key: "tre_tipo", label: "Tipo", sortable: true },
    { key: "tre_nombre", label: "Nombre", sortable: true },
    { key: "tre_numero_cuenta", label: "N° Cuenta", sortable: true },
    { key: "tre_buscar_en", label: "Asociado", sortable: true },
    { key: "tre_duracion", label: "Duración", sortable: true },
    { key: "tre_costo", label: "Costo (Bs.)", sortable: true },
    { key: "acciones", label: "Opciones", sortable: false },
  ];

  // Filtrado de items
  const filteredItems = useMemo(() => {
    let filtered = [...tramites];

    if (filterValue) {
      filtered = filtered.filter((tramite) =>
        Object.values(tramite).some((value) =>
          String(value).toLowerCase().includes(filterValue.toLowerCase())
        )
      );
    }

    return filtered;
  }, [tramites, filterValue]);

  // Ordenamiento
  const sortedItems = useMemo(() => {
    if (!sortDescriptor.column) return filteredItems;

    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
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

  // Mapeo de colores de TRAMITE_COLORS a colores de HeroUI
  const getChipColor = (tipo) => {
    const color = TRAMITE_COLORS[tipo]?.base || "bg-gray-400";
    const colorMap = {
      "bg-blue-500": "primary",
      "bg-green-500": "success",
      "bg-yellow-500": "warning",
      "bg-red-500": "danger",
      "bg-purple-500": "secondary",
    };
    return colorMap[color] || "default";
  };

  // Renderizado de celdas
  const renderCell = useCallback(
    (tramite, columnKey, index) => {
      switch (columnKey) {
        case "numero":
          return (
            <span className="text-sm">
              {(page - 1) * rowsPerPage + index + 1}
            </span>
          );

        case "tre_tipo":
          return (
            <Chip color={getChipColor(tramite.tre_tipo)} size="sm" variant="flat">
              {tramite.tre_tipo.toUpperCase()}
            </Chip>
          );

        case "tre_nombre":
          return <span className="text-sm">{tramite.tre_nombre}</span>;

        case "tre_numero_cuenta":
          return <span className="text-sm">{tramite.tre_numero_cuenta}</span>;

        case "tre_buscar_en":
          return (
            <span className="text-sm uppercase">
              {tramite.tre_buscar_en}
            </span>
          );

        case "tre_duracion":
          return <span className="text-sm">{tramite.tre_duracion}</span>;

        case "tre_costo":
          return <span className="text-sm">{tramite.tre_costo} Bs.</span>;

        case "acciones":
          return (
            <div className="flex gap-1 items-center justify-center">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() =>
                  openModal(AddEditTramiteModal, {
                    title: `Editar Trámite: ${tramite.tre_tipo}`,
                    type: tramite.tre_tipo,
                    initialData: tramite,
                    onSubmit: (formData) =>
                      onSubmit(formData, tramite.tre_tipo, tramite.cod_tre),
                    onSuccess: refresh,
                  })
                }
              >
                <SquarePen className="w-4 h-4 text-blue-600" />
              </Button>

              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => openModal(GlosaModal, { tramite })}
              >
                <AlignJustify className="w-4 h-4 text-purple-600" />
              </Button>

              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onToggle(tramite.cod_tre)}
              >
                {tramite.tre_hab ? (
                  <SquareCheck className="w-4 h-4 text-green-600" />
                ) : (
                  <SquareX className="w-4 h-4 text-red-600" />
                )}
              </Button>

              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() =>
                  openModal(DeleteTramiteModal, {
                    itemData: tramite,
                    onConfirm: () => onDelete(tramite.cod_tre),
                  })
                }
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          );

        default:
          return tramite[columnKey];
      }
    },
    [openModal, onSubmit, onToggle, onDelete, refresh, page, rowsPerPage]
  );

  // Contenido superior (Filtros y controles)
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
            placeholder="Buscar..."
            startContent={<Search className="w-4 h-4" />}
            value={filterValue}
            onClear={() => onSearchChange("")}
            onValueChange={onSearchChange}
            className="w-64  rounded-lg border border-gray-300"
          />
        </div>
      </div>
    );
  }, [filterValue, rowsPerPage, onSearchChange, onRowsPerPageChange]);

  // Contenido inferior (Paginación)
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
        aria-label="Tabla de trámites"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        classNames={{
          wrapper: "shadow-md p-0",
          th: "bg-gray-500 text-white",
          td: "text-gray-600",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              allowsSorting={column.sortable}
              align={column.key === "acciones" ? "center" : "start"}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent="No hay trámites disponibles">
          {(item) => (
            <TableRow
              key={item.cod_tre}
              className={!item.tre_hab ? "bg-red-50" : ""}
            >
              {(columnKey) => (
                <TableCell>
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
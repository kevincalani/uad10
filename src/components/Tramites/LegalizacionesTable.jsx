import React, { useMemo, useState, useCallback } from "react";
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
  Tooltip,
} from "@heroui/react";
import {
  CircleArrowRight,
  Move,
  Pencil,
  Trash2,
  Search,
  Info,
} from "lucide-react";
import { TRAMITE_COLORS, TIPO_TRAMITE } from "../../Constants/tramiteDatos";
import { useModal } from "../../hooks/useModal";
import EditLegalizacionModal from "../../modals/EditLegalizacionModal";
import CambiarTipoTramiteModal from "../../modals/servicios/tramitesLegalizacion/CambiarTipoTramiteModal";
import EntregaModal from "../../modals/servicios/entrega/EntregaModal";
import EliminarTramiteModal from "../../modals/servicios/EliminarTramiteModal";

export default function LegalizacionesTable({
  tramites,
  loading,
  error,
  selectedDate,
  recargarTramites,
  setTramites,
  guardarDatosTramite,
}) {
  const { openModal } = useModal();

  // Estados
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(500);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: null,
    direction: null,
  });

  // Definición de columnas
  const columns = [
    { key: "numero", label: "N°", sortable: false },
    { key: "tra_tipo_tramite", label: "Tipo", sortable: true },
    { key: "tra_numero", label: "Número", sortable: true },
    { key: "per_ci", label: "CI", sortable: true },
    { key: "per_nombre", label: "Nombre", sortable: true },
    { key: "tra_fecha_solicitud", label: "Fecha Solicitud", sortable: true },
    { key: "tra_fecha_firma", label: "Fecha Firma", sortable: true },
    { key: "tra_fecha_recojo", label: "Fecha Recojo", sortable: true },
    { key: "opciones", label: "Opciones", sortable: false },
    { key: "entrega", label: "Entrega", sortable: false },
  ];

  // Filtrado
  const filteredItems = useMemo(() => {
    let filtered = [...tramites];

    if (filterValue) {
      filtered = filtered.filter(
        (t) =>
          (t.per_nombre ?? "").toLowerCase().includes(filterValue.toLowerCase()) ||
          (t.per_apellido ?? "").toLowerCase().includes(filterValue.toLowerCase()) ||
          (t.per_ci ?? "").includes(filterValue) ||
          (t.tra_numero ?? "").includes(filterValue)
      );
    }

    return filtered;
  }, [tramites, filterValue]);

  // Ordenamiento
  const sortedItems = useMemo(() => {
    if (!sortDescriptor.column) return filteredItems;

    return [...filteredItems].sort((a, b) => {
      let first = a[sortDescriptor.column];
      let second = b[sortDescriptor.column];

      // Para nombre completo
      if (sortDescriptor.column === "per_nombre") {
        first = `${a.per_apellido ?? ""} ${a.per_nombre ?? ""}`.trim();
        second = `${b.per_apellido ?? ""} ${b.per_nombre ?? ""}`.trim();
      }

      // Manejar valores nulos
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

  // Mapeo de colores para Chips
  const getChipColor = (tipoTramite) => {
    const tipo = TIPO_TRAMITE[tipoTramite];
    const color = TRAMITE_COLORS[tipo]?.base || "bg-gray-500";
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
    (row, columnKey, index) => {
      switch (columnKey) {
        case "numero":
          return (
            <span className="font-bold text-blue-600">
              {(page - 1) * rowsPerPage + index + 1}
            </span>
          );

        case "tra_tipo_tramite":
          const tipo = TIPO_TRAMITE[row.tra_tipo_tramite];
          return (
            <div className="flex items-center gap-2">
              <Chip color={getChipColor(row.tra_tipo_tramite)} size="sm" variant="flat">
                {tipo}
              </Chip>
              {row.tra_obs === "t" && (
                <Tooltip content="Tiene observaciones">
                  <Info size={20} className="text-red-500"/>
                </Tooltip>
              )}
            </div>
          );

        case "tra_numero":
          return <span className="font-medium">{row.tra_numero}</span>;

        case "per_ci":
          return <span>{row.per_ci || "-"}</span>;

        case "per_nombre":
          const nombre = row.per_nombre ?? "";
          const apellido = row.per_apellido ?? "";
          const nombreCompleto = `${apellido} ${nombre}`.trim();

          let badge = null;
          if (row.tra_tipo_apoderado === "p") {
            badge = (
              <Chip size="sm" color="danger" variant="flat" className="ml-2">
                Pod
              </Chip>
            );
          } else if (row.tra_tipo_apoderado === "d") {
            badge = (
              <Chip size="sm" color="success" variant="flat" className="ml-2">
                Dec
              </Chip>
            );
          }

          return (
            <div className="flex items-center">
              <span>{nombreCompleto || "-"}</span>
              {badge}
            </div>
          );

        case "tra_fecha_solicitud":
        case "tra_fecha_firma":
        case "tra_fecha_recojo":
          return <span>{row[columnKey] || "-"}</span>;

        case "opciones":
          return (
            <div className="flex gap-1">
              <Tooltip content="Insertar Datos Trámite">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="primary"
                  onPress={() =>
                    openModal(EditLegalizacionModal, {
                      tramiteData: row,
                      setTramites,
                      guardarDatosTramite,
                      recargarTramites,
                    })
                  }
                >
                  <Pencil size={16} />
                </Button>
              </Tooltip>

              <Tooltip content="Cambiar Tipo de Trámite">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="secondary"
                  onPress={() =>
                    openModal(CambiarTipoTramiteModal, {
                      cod_tra: row.cod_tra,
                      onSuccess: recargarTramites,
                    })
                  }
                >
                  <Move size={16} />
                </Button>
              </Tooltip>

              <Tooltip content="Eliminar Trámite" color="danger">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={() =>
                    openModal(EliminarTramiteModal, {
                      cod_tra: row.cod_tra,
                      onSuccess: recargarTramites,
                    })
                  }
                >
                  <Trash2 size={16} />
                </Button>
              </Tooltip>
            </div>
          );

        case "entrega":
          if (!row.id_per) return null;

          return (
            <Tooltip content="Panel de Entrega">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="success"
                onPress={() =>
                  openModal(EntregaModal, {
                    cod_tra: row.cod_tra,
                    onSuccess: recargarTramites,
                  })
                }
              >
                <CircleArrowRight size={16} />
              </Button>
            </Tooltip>
          );

        default:
          return row[columnKey];
      }
    },
    [
      openModal,
      setTramites,
      guardarDatosTramite,
      recargarTramites,
      page,
      rowsPerPage,
    ]
  );

  // Contenido superior
  const topContent = useMemo(() => {
    return (
      <div className="space-y-4 mb-4">
        {/* Título y fecha */}
        <div className="flex justify-center items-center gap-4">
          <div className="bg-blue-600 text-white px-4 py-2 rounded shadow-md">
            <h2 className="text-xl font-semibold">Trámites de Legalización</h2>
          </div>
          <span className="text-sm font-medium text-blue-600">
            Fecha:{" "}
            {new Date(selectedDate).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Controles */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Mostrando</span>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              value={rowsPerPage}
              onChange={onRowsPerPageChange}
            >
              {[5, 10, 25, 50, 100, 500].map((size) => (
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
              placeholder="Buscar por nombre, CI, número..."
              startContent={<Search className="w-4 h-4" />}
              value={filterValue}
              onClear={() => onSearchChange("")}
              onValueChange={onSearchChange}
              className="w-80"
            />
          </div>
        </div>
      </div>
    );
  }, [filterValue, rowsPerPage, selectedDate, onSearchChange, onRowsPerPageChange]);

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

  // Manejo de estados de carga y error
  if (loading) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Cargando trámites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {topContent}
      <Table
        aria-label="Tabla de legalizaciones"
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
              align={column.key === "numero" ? "center" : "start"}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent="No hay trámites para esta fecha">
          {(item) => (
            <TableRow key={item.cod_tra} className="hover:bg-gray-50">
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
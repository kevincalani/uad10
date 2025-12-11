// 📁 components/apostilla/TramitesApostilla.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Pagination,
  Tooltip,
} from "@heroui/react";
import {
  Search,
  FileText,
  Edit2,
  Trash2,
  PenTool,
  HandCoins,
  Download,
} from "lucide-react";
import { useApostilla } from "../../hooks/useApostilla";
import { useModal } from "../../hooks/useModal";
import EliminarTramiteModal from "../../modals/apostilla/EliminarTramiteModal";
import EntregaTramiteModal from "../../modals/apostilla/EntregaTramiteModal";
import BusquedaModal from "../../modals/apostilla/BusquedaModal";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import TramiteModal from "../../modals/apostilla/tramiteModal";

export default function TramitesApostilla() {
  const { fecha: fechaUrl } = useParams(); // Obtener fecha de la URL
  const navigate = useNavigate();
  const { openModal } = useModal();
  const {
    tramites,
    loading,
    listarTramitesPorFecha,
    actualizarTablaTramites,
    firmarTramite,
    registrarEntrega,
  } = useApostilla();

  // Función para validar formato de fecha
  const isValidDate = (dateString) => {
    if (!dateString) return false;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  // Inicializar fecha desde URL o usar fecha actual
  const getInitialDate = () => {
    if (fechaUrl && isValidDate(fechaUrl)) {
      return fechaUrl;
    }
    return new Date().toISOString().split("T")[0];
  };

  const [selectedDate, setSelectedDate] = useState(getInitialDate());
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(500);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: null,
    direction: null,
  });

  // Sincronizar fecha de URL con estado
  useEffect(() => {
    if (fechaUrl && isValidDate(fechaUrl)) {
      setSelectedDate(fechaUrl);
    }
  }, [fechaUrl]);

  // Cargar trámites cuando cambia la fecha
  useEffect(() => {
    if (selectedDate) {
      listarTramitesPorFecha(selectedDate);
    }
  }, [selectedDate]);

      // Formatear fecha 
   const formatearFecha = (fecha) => {
        if (!fecha) return "";

        const [year, month, day] = fecha.split("-");
        const date = new Date(Number(year), Number(month) - 1, Number(day));

        return date.toLocaleDateString("es-BO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        });
    };

  // Definición de columnas con sorting
  const columns = [
    { key: "numero_orden", label: "Nº", sortable: false },
    { key: "apos_numero", label: "NÚMERO", sortable: true },
    { key: "per_ci", label: "CI", sortable: true },
    { key: "per_apellido", label: "NOMBRE", sortable: true },
    { key: "apos_fecha_ingreso", label: "FECHA SOLICITUD", sortable: true },
    { key: "apos_fecha_firma", label: "FECHA FIRMA", sortable: true },
    { key: "apos_fecha_recojo", label: "FECHA RECOJO", sortable: true },
    { key: "opciones", label: "OPCIONES", sortable: false },
    { key: "entrega", label: "ENTREGA", sortable: false },
  ];

  // Filtrado
  const filteredItems = useMemo(() => {
    let filtered = [...tramites];

    if (filterValue) {
      filtered = filtered.filter(
        (tramite) =>
          tramite.per_apellido
            ?.toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          tramite.per_nombre
            ?.toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          tramite.per_ci?.toLowerCase().includes(filterValue.toLowerCase()) ||
          tramite.apos_numero?.toString().includes(filterValue)
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

      // Convertir fechas para comparación
      if (sortDescriptor.column.includes("fecha") && first && second) {
        first = new Date(first).getTime();
        second = new Date(second).getTime();
      }

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

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setPage(1);
    // Actualizar URL con la nueva fecha
    navigate(`/apostilla/tramites/${newDate}`, { replace: true });
  };

  const handleFirmar = async (cod_apos) => {
    if (!confirm("¿Está seguro de firmar este trámite?")) return;

    const result = await firmarTramite(cod_apos);
    if (result) {
      await actualizarTablaTramites(selectedDate);
    }
  };

  const handleEntregaRapida = async (tramite) => {
    const formData = { ca: tramite.cod_apos, apo: "T" };
    const result = await registrarEntrega(formData);
    if (result) {
      await actualizarTablaTramites(selectedDate);
    }
  };

  const handleNuevoTramite = () => {
    openModal(TramiteModal, {
      cod_apos: 0,
      fecha: selectedDate,
      onSuccess: () => actualizarTablaTramites(selectedDate),
    });
  };

  const handleEditarTramite = (cod_apos) => {
    openModal(TramiteModal, {
      cod_apos,
      fecha: selectedDate,
      onSuccess: () => actualizarTablaTramites(selectedDate),
    });
  };

  const handleEliminarTramite = (cod_apos) => {
    openModal(EliminarTramiteModal, {
      cod_apos,
      onSuccess: () => actualizarTablaTramites(selectedDate),
    });
  };

  const handleEntregarTramite = (cod_apos) => {
    openModal(EntregaTramiteModal, {
      cod_apos,
      onSuccess: () => actualizarTablaTramites(selectedDate),
    });
  };

  const handleBuscar = () => {
    openModal(BusquedaModal, {});
  };

  // Renderizado de celdas
  const renderCell = useCallback(
    (tramite, columnKey, index) => {
      const cellValue = tramite[columnKey];

      switch (columnKey) {
        case "numero_orden":
          return (
            <span className="text-blue-600 font-bold">
              {(page - 1) * rowsPerPage + index + 1}
            </span>
          );

        case "apos_numero":
          return (
            <span className="font-semibold text-sm">
              UAD{tramite.apos_numero}
            </span>
          );

        case "per_ci":
          return <span className="text-sm">{tramite.per_ci}</span>;

        case "per_apellido":
          return (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">
                {tramite.per_apellido} {tramite.per_nombre}
              </span>
              {tramite.apos_apoderado === "p" && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 w-fit">
                  Pod
                </span>
              )}
              {tramite.apos_apoderado === "d" && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 w-fit">
                  Dec
                </span>
              )}
            </div>
          );

        case "apos_fecha_ingreso":
        case "apos_fecha_firma":
        case "apos_fecha_recojo":
          return (
            <span className="text-sm text-right">
              {tramite[columnKey]
                ? formatearFecha(tramite[columnKey])
                : "-"}
            </span>
          );

        case "opciones":
          return (
            <div className="flex items-center justify-center gap-1">
              <Tooltip content="Editar trámite">
                <button
                  onClick={() => handleEditarTramite(tramite.cod_apos)}
                  className="p-1.5 hover:bg-blue-300 rounded-full transition-colors text-blue-600 cursor-pointer"
                >
                  <Edit2 size={16} />
                </button>
              </Tooltip>

              {tramite.apos_estado == 1 ? (
                <Tooltip content="Firmar trámite">
                  <button
                    onClick={() => handleFirmar(tramite.cod_apos)}
                    className="p-1.5 hover:bg-blue-300 rounded-full transition-colors text-blue-600 cursor-pointer"
                  >
                    <PenTool size={16} />
                  </button>
                </Tooltip>
              ) : (
                <span className="p-1.5">
                  <PenTool
                    size={16}
                    className={
                      tramite.apos_estado >= 2
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  />
                </span>
              )}

              <Tooltip content="Eliminar trámite" color="danger">
                <button
                  onClick={() => handleEliminarTramite(tramite.cod_apos)}
                  className="p-1.5 hover:bg-red-300 rounded-full transition-colors text-red-600 cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </Tooltip>
            </div>
          );

        case "entrega":
          if (tramite.apos_estado == 2) {
            return (
              <div className="flex justify-center">
                <Tooltip content="Entregar trámite">
                  <button
                    onClick={() =>
                      !tramite.cod_apo
                        ? handleEntregaRapida(tramite)
                        : handleEntregarTramite(tramite.cod_apos)
                    }
                    className="p-1.5 hover:bg-green-300 rounded-full transition-colors text-green-600 cursor-pointer"
                  >
                    <HandCoins size={18} />
                  </button>
                </Tooltip>
              </div>
            );
          } else if (tramite.apos_estado == 3) {
            return (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                Entregado
              </span>
            );
          }
          return null;

        default:
          return cellValue;
      }
    },
    [page, rowsPerPage]
  );

  // Contenido superior (toolbar)
  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 mb-4">
        {/* Primera fila: controles de fecha y acciones */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                Buscar fecha:
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <span className="text-gray-400">|</span>

            {selectedDate === new Date().toISOString().split("T")[0] && (
              <>
                <button
                  onClick={handleNuevoTramite}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  + Apostilla
                </button>
                <span className="text-gray-400">|</span>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleBuscar}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Search size={16} />
              Buscar
            </button>
          </div>
        </div>

        {/* Segunda fila: info de fecha */}
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="bg-blue-600 text-white px-4 py-2 rounded shadow-md w-auto">
            <h5 className="text-xl font-semibold">Trámites de apostilla</h5>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold italic text-blue-600">Fecha:</span>
          <span className="italic text-gray-700 ml-2">
            {(() => {
              if (!selectedDate) return "";

              const [year, month, day] = selectedDate.split("-");
              const date = new Date(year, month - 1, day);

              return date.toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
            })()}
          </span>
        </div>
        <hr className="border-gray-300" />

        {/* Tercera fila: controles de tabla */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Mostrar</span>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              placeholder="Buscar por nombre, CI o número..."
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
  }, [
    selectedDate,
    filterValue,
    rowsPerPage,
    onSearchChange,
    onRowsPerPageChange,
  ]);

  // Contenido inferior (paginación)
  const bottomContent = useMemo(() => {
    const start = (page - 1) * rowsPerPage + 1;
    const end = Math.min(page * rowsPerPage, sortedItems.length);

    return (
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          Mostrando {sortedItems.length > 0 ? start : 0} a {end} de{" "}
          {sortedItems.length} entradas
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

  if (loading && tramites.length === 0) {
    return <LoadingSpinner size="lg" message="Cargando trámites..." />;
  }

  return (
    <div className="p-6">
      {/* Card principal */}
      <div className="bg-white shadow-md rounded-lg">
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
          <h5 className="text-xl font-semibold flex items-center">
            <FileText className="mr-2" size={24} />
            TRÁMITES DE APOSTILLAS
          </h5>
        </div>

        <div className="p-6">
          {topContent}

          {/* Tabla */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <Table
              aria-label="Tabla de trámites de apostilla"
              sortDescriptor={sortDescriptor}
              onSortChange={setSortDescriptor}
              classNames={{
                wrapper: "shadow-sm p-0 border-gray-300",
                th: "bg-gray-600 text-white",
                td: "text-gray-700",
              }}
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn
                    key={column.key}
                    allowsSorting={column.sortable}
                    align={
                      column.key === "numero_orden" ||
                      column.key === "opciones" ||
                      column.key === "entrega"
                        ? "center"
                        : column.key.includes("fecha")
                        ? "end"
                        : "start"
                    }
                  >
                    {column.label}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody
                items={items}
                emptyContent={
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No hay trámites registrados para esta fecha
                    </p>
                  </div>
                }
              >
                {(item) => (
                  <TableRow key={item.cod_apos} className="hover:bg-gray-50">
                    {(columnKey) => (
                      <TableCell
                        className={
                          columnKey === "numero_orden" ||
                          columnKey === "opciones" ||
                          columnKey === "entrega"
                            ? "text-center"
                            : columnKey.includes("fecha")
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
          </div>

          {bottomContent}
        </div>
      </div>
    </div>
  );
}
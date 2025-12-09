import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
} from '@heroui/react';
import { useModal } from '../../../hooks/useModal';
import { useNoAtentado } from '../../../hooks/useNoAtentados';
import EntregaNoAtentadoModal from '../../../modals/servicios/entrega/EntregaNoAtentadoModal';
import { ArrowRightCircle, Search } from 'lucide-react';

export default function EntregasNoAtentadoTable({ noAtentado }) {
  const { openModal } = useModal();
  const { obtenerCandidatos, formatearCandidatosTexto } = useNoAtentado();

  const [candidatosPorTramite, setCandidatosPorTramite] = useState({});
  const [cargandoCandidatos, setCargandoCandidatos] = useState(false);

  // Estados de tabla
  const [filterValue, setFilterValue] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: null,
    direction: null,
  });

  useEffect(() => {
    if (noAtentado && noAtentado.length > 0) {
      cargarTodosCandidatos();
    }
  }, [noAtentado]);

  const cargarTodosCandidatos = async () => {
    setCargandoCandidatos(true);
    const candidatosTemp = {};

    for (const tramite of noAtentado) {
      const candidatos = await obtenerCandidatos(tramite.cod_dtra);
      candidatosTemp[tramite.cod_dtra] = candidatos;
    }

    setCandidatosPorTramite(candidatosTemp);
    setCargandoCandidatos(false);
  };

  // Definición de columnas
  const columns = [
    { key: 'numero', label: 'Nº', sortable: false },
    { key: 'tipo', label: 'Tipo', sortable: false },
    { key: 'dtra_numero_tramite', label: 'Nro. Trámite', sortable: true },
    { key: 'tre_nombre', label: 'Trámite', sortable: true },
    { key: 'candidatos', label: 'Nombres', sortable: false },
    { key: 'dtra_fecha_registro', label: 'Fecha solicitud', sortable: true },
    { key: 'opciones', label: 'Opciones', sortable: false },
  ];

  // Filtrado
  const filteredItems = useMemo(() => {
    let filtered = [...noAtentado];

    if (filterValue) {
      filtered = filtered.filter((item) => {
        const candidatos = candidatosPorTramite[item.cod_dtra] || [];
        const nombresCandidatos = candidatos
          .map((c) => c.nombre_completo)
          .join(' ')
          .toLowerCase();

        return (
          item.dtra_numero_tramite?.toString().includes(filterValue) ||
          item.tre_nombre?.toLowerCase().includes(filterValue.toLowerCase()) ||
          nombresCandidatos.includes(filterValue.toLowerCase())
        );
      });
    }

    return filtered;
  }, [noAtentado, filterValue, candidatosPorTramite]);

  // Ordenamiento
  const sortedItems = useMemo(() => {
    if (!sortDescriptor.column) return filteredItems;

    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];

      if (first == null) return 1;
      if (second == null) return -1;

      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [filteredItems, sortDescriptor]);

  // Paginación
  const pages = Math.ceil(sortedItems.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedItems.slice(start, end).map((item, idx) => ({
      ...item,
      _uniqueKey: `${item.cod_dtra}-${start + idx}`,
      _rowIndex: start + idx
    }));
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

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-BO');
  };

  // Renderizado de celdas
  const renderCell = useCallback(
    (item, columnKey) => {
      switch (columnKey) {
        case 'numero':
          return (
            <span className="text-sm font-semibold">
              {item._rowIndex + 1}
            </span>
          );

        case 'tipo':
          return (
            <Chip color="primary" size="sm" variant="flat">
              NO-ATENTADO
            </Chip>
          );

        case 'dtra_numero_tramite':
          return (
            <div className="text-sm">
              <span className="text-blue-600 font-bold">
                {item.dtra_numero_tramite}
              </span>
              /{item.dtra_gestion_tramite}
            </div>
          );

        case 'tre_nombre':
          return <span className="text-sm">{item.tre_nombre}</span>;

        case 'candidatos':
          const candidatos = candidatosPorTramite[item.cod_dtra] || [];

          if (cargandoCandidatos) {
            return (
              <span className="text-gray-400 italic text-xs">Cargando...</span>
            );
          }

          if (candidatos.length === 0) {
            return (
              <span className="text-gray-500 italic text-xs">Sin candidatos</span>
            );
          }

          const candidatosAMostrar = candidatos.slice(0, 3);
          const hayMas = candidatos.length > 3;

          return (
            <div className="space-y-1">
              {candidatosAMostrar.map((candidato, idx) => (
                <div key={idx} className="text-xs">
                  <span className="text-gray-800 font-semibold">
                    {candidato.nombre_completo}
                  </span>
                  {candidato.carg_nombre && (
                    <span className="text-blue-600 ml-1">
                      - {candidato.carg_nombre}
                    </span>
                  )}
                </div>
              ))}
              {hayMas && (
                <div className="text-gray-500 italic text-xs">
                  +{candidatos.length - 3} más...
                </div>
              )}
            </div>
          );

        case 'dtra_fecha_registro':
          return (
            <span className="text-sm">{formatearFecha(item.dtra_fecha_registro)}</span>
          );

        case 'opciones':
          return (
            <Tooltip content="Entregar trámite">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="success"
                onPress={() =>
                  openModal(EntregaNoAtentadoModal, { cod_dtra: item.cod_dtra })
                }
              >
                <ArrowRightCircle size={20} />
              </Button>
            </Tooltip>
          );

        default:
          return item[columnKey];
      }
    },
    [openModal, candidatosPorTramite, cargandoCandidatos]
  );

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
            {[50, 100, 200].map((size) => (
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
            placeholder="Buscar por número, trámite o nombre..."
            startContent={<Search className="w-4 h-4" />}
            value={filterValue}
            onClear={() => onSearchChange('')}
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

  if (!noAtentado || noAtentado.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No hay trámites de no-atentado pendientes de entrega
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {topContent}
      <Table
        aria-label="Tabla de entregas de no-atentado"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        classNames={{
          wrapper: 'shadow-md p-0 border border-gray-300',
          th: 'bg-gray-500 text-white',
          td: 'text-gray-600',
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              allowsSorting={column.sortable}
              align={column.key === 'opciones' ? 'center' : 'start'}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent="No hay registros para mostrar">
          {(item) => (
            <TableRow key={item._uniqueKey} className="hover:bg-gray-50">
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {bottomContent}
    </div>
  );
}
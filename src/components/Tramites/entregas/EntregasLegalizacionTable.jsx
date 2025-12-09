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
  Chip,
  Tooltip,
} from '@heroui/react';
import { useModal } from '../../../hooks/useModal';
import EntregaModal from '../../../modals/servicios/entrega/EntregaModal';
import { ArrowRightCircle, Search } from 'lucide-react';

export default function EntregasLegalizacionTable({ entregas }) {
  const { openModal } = useModal();

  // Estados
  const [filterValue, setFilterValue] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(500);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: null,
    direction: null,
  });

  const tipoTramiteConfig = {
    L: { nombre: 'LEGALIZACIÓN', color: 'primary' },
    F: { nombre: 'CONFRONTACIÓN', color: 'danger' },
    C: { nombre: 'CERTIFICACIÓN', color: 'warning' },
    B: { nombre: 'BÚSQUEDA', color: 'success' },
    E: { nombre: 'CONSEJO', color: 'default' },
  };

  // Definición de columnas
  const columns = [
    { key: 'numero', label: 'Nº', sortable: false },
    { key: 'dtra_tipo', label: 'Tipo', sortable: true },
    { key: 'per_ci', label: 'CI', sortable: true },
    { key: 'per_nombre', label: 'Nombre', sortable: true },
    { key: 'tra_numero', label: 'Número Atención', sortable: true },
    { key: 'dtra_numero_tramite', label: 'Número trámite', sortable: true },
    { key: 'tra_fecha_solicitud', label: 'Fecha solicitud', sortable: true },
    { key: 'dtra_fecha_firma', label: 'Fecha firma', sortable: true },
    { key: 'entrega', label: 'Entrega', sortable: false },
  ];

  // Filtrado
  const filteredItems = useMemo(() => {
    let filtered = [...entregas];

    if (filterValue) {
      filtered = filtered.filter(
        (item) =>
          item.per_ci?.toLowerCase().includes(filterValue.toLowerCase()) ||
          item.per_nombre?.toLowerCase().includes(filterValue.toLowerCase()) ||
          item.per_apellido?.toLowerCase().includes(filterValue.toLowerCase()) ||
          item.tra_numero?.toString().includes(filterValue) ||
          item.dtra_numero_tramite?.toString().includes(filterValue)
      );
    }

    return filtered;
  }, [entregas, filterValue]);

  // Ordenamiento
  const sortedItems = useMemo(() => {
    if (!sortDescriptor.column) return filteredItems;

    return [...filteredItems].sort((a, b) => {
      let first = a[sortDescriptor.column];
      let second = b[sortDescriptor.column];

      // Para nombre completo
      if (sortDescriptor.column === 'per_nombre') {
        first = `${a.per_apellido ?? ''} ${a.per_nombre ?? ''}`.trim();
        second = `${b.per_apellido ?? ''} ${b.per_nombre ?? ''}`.trim();
      }

      // Manejar valores nulos
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
      _uniqueKey: `${item.cod_tra}-${item.cod_dtra}-${start + idx}`,
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

        case 'dtra_tipo':
          const config = tipoTramiteConfig[item.dtra_tipo] || {
            nombre: item.dtra_tipo,
            color: 'default',
          };
          return (
            <Chip color={config.color} size="sm" variant="flat">
              {config.nombre}
            </Chip>
          );

        case 'per_ci':
          return <span className="text-sm">{item.per_ci}</span>;

        case 'per_nombre':
          const nombreCompleto = `${item.per_apellido} ${item.per_nombre}`;
          let badge = null;

          if (item.tra_tipo_apoderado === 'p') {
            badge = (
              <Chip size="sm" color="danger" variant="flat" className="ml-2">
                Pod
              </Chip>
            );
          } else if (item.tra_tipo_apoderado === 'd') {
            badge = (
              <Chip size="sm" color="success" variant="flat" className="ml-2">
                Dec
              </Chip>
            );
          }

          return (
            <div className="flex items-center">
              <span className="text-sm">{nombreCompleto}</span>
              {badge}
            </div>
          );

        case 'tra_numero':
          return <span className="text-sm">{item.tra_numero}</span>;

        case 'dtra_numero_tramite':
          return (
            <span className="text-sm">
              {item.dtra_numero_tramite} / {item.dtra_gestion_tramite}
            </span>
          );

        case 'tra_fecha_solicitud':
          return (
            <span className="text-sm">{formatearFecha(item.tra_fecha_solicitud)}</span>
          );

        case 'dtra_fecha_firma':
          return (
            <span className="text-sm">{formatearFecha(item.dtra_fecha_firma)}</span>
          );

        case 'entrega':
          return (
            <Tooltip content="Entregar legalizaciones">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="success"
                onPress={() => openModal(EntregaModal, { cod_tra: item.cod_tra })}
              >
                <ArrowRightCircle size={20} />
              </Button>
            </Tooltip>
          );

        default:
          return item[columnKey];
      }
    },
    [openModal]
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
            {[50, 100, 200, 500].map((size) => (
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

  if (!entregas || entregas.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay trámites pendientes de entrega</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {topContent}
      <Table
        aria-label="Tabla de entregas de legalización"
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
              align={column.key === 'entrega' ? 'center' : 'start'}
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
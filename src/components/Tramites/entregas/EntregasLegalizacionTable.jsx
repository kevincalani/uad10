// 📁 components/entregas/TablaEntregasLegalizacion.jsx
import React, { useMemo } from 'react';
import { useModal } from '../../../hooks/useModal';
import DataTable from 'react-data-table-component';
import EntregaModal from '../../../modals/servicios/entrega/EntregaModal';
import { ArrowRightCircle } from 'lucide-react';

export default function EntregasLegalizacionTable ({ entregas }) {
  const { openModal } = useModal();

  const tipoTramiteConfig = {
    L: { nombre: 'LEGALIZACIÓN', clase: 'bg-blue-500 text-white' },
    F: { nombre: 'CONFRONTACIÓN', clase: 'bg-red-600 text-white' },
    C: { nombre: 'CERTIFICACIÓN', clase: 'bg-yellow-500 text-gray-900' },
    B: { nombre: 'BÚSQUEDA', clase: 'bg-green-600 text-white' },
    E: { nombre: 'CONSEJO', clase: 'bg-gray-600 text-white' }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-BO');
  };

  const columns = [
    {
      name: 'Nº',
      selector: (row, index) => index + 1,
      width: '60px',
      center: true
    },
    {
      name: 'Tipo',
      cell: (row) => {
        const config = tipoTramiteConfig[row.dtra_tipo] || { nombre: row.dtra_tipo, clase: 'bg-gray-500 text-white' };
        return (
          <span className={`font-bold rounded px-2 py-1 text-xs ${config.clase}`}>
            {config.nombre}
          </span>
        );
      },
      width: '150px'
    },
    {
      name: 'CI',
      selector: (row) => row.per_ci,
      width: '100px'
    },
    {
      name: 'Nombre',
      cell: (row) => (
        <div>
          {row.per_apellido} {row.per_nombre}
          {row.tra_tipo_apoderado === 'p' && (
            <span className="ml-2 bg-red-600 text-white rounded px-1 text-xs">Pod</span>
          )}
          {row.tra_tipo_apoderado === 'd' && (
            <span className="ml-2 bg-green-600 text-white rounded px-1 text-xs">Dec</span>
          )}
        </div>
      ),
      grow: 2
    },
    {
      name: 'Número Atención',
      selector: (row) => row.tra_numero,
      width: '130px'
    },
    {
      name: 'Número trámite',
      selector: (row) => `${row.dtra_numero_tramite} / ${row.dtra_gestion_tramite}`,
      width: '150px'
    },
    {
      name: 'Fecha solicitud',
      selector: (row) => formatearFecha(row.tra_fecha_solicitud),
      width: '130px'
    },
    {
      name: 'Fecha firma',
      selector: (row) => formatearFecha(row.dtra_fecha_firma),
      width: '130px'
    },
    {
      name: 'Entrega',
      cell: (row) => (
        <button
          onClick={() => openModal(EntregaModal, { cod_tra: row.cod_tra })}
          className="p-1 rounded-full shadow-sm text-green-600 hover:bg-gray-300"
          title="Entregar legalizaciones"
        >
          <ArrowRightCircle/>
        </button>
      ),
      center: true,
      width: '100px'
    }
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#4B5563',
        color: '#fff',
        fontSize: '0.9em',
        fontWeight: 'bold'
      }
    },
    rows: {
      style: {
        fontSize: '0.85em',
        '&:hover': {
          backgroundColor: '#F3F4F6'
        }
      }
    }
  };

  if (!entregas || entregas.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay trámites pendientes de entrega</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <DataTable
        columns={columns}
        data={entregas}
        customStyles={customStyles}
        pagination
        paginationPerPage={500}
        paginationRowsPerPageOptions={[50, 100, 200, 500]}
        highlightOnHover
        responsive
        noDataComponent="No hay registros para mostrar"
        paginationComponentOptions={{
          rowsPerPageText: 'Filas por página:',
          rangeSeparatorText: 'de'
        }}
      />
    </div>
  );
};
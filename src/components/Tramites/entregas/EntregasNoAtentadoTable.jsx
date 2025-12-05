// 📁 components/entregas/TablaEntregasNoAtentado.jsx
import React from 'react';
import { useModal } from '../../../hooks/useModal';
import DataTable from 'react-data-table-component';
import EntregaNoAtentadoModal from '../../../modals/servicios/entrega/EntregaNoAtentadoModal';

export default function EntregasNoAtentadoTable ({ noAtentado }) {
  const { openModal } = useModal();

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-BO');
  };

  // Función para obtener candidatos (similar a la del blade)
  const obtenerCandidatos = (cod_dtra) => {
    // Esto debe venir desde el backend, por ahora retornamos placeholder
    return 'Candidatos...';
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
      cell: () => (
        <span className="font-bold rounded px-2 py-1 text-xs bg-blue-600 text-white">
          NO-ATENTADO
        </span>
      ),
      width: '150px'
    },
    {
      name: 'Nro. Trámite',
      cell: (row) => (
        <div>
          <span className="text-blue-600 font-bold">{row.dtra_numero_tramite}</span>
          /{row.dtra_gestion_tramite}
        </div>
      ),
      width: '130px'
    },
    {
      name: 'Trámite',
      selector: (row) => row.tre_nombre,
      grow: 1
    },
    {
      name: 'Nombres',
      cell: (row) => (
        <span className="font-bold text-gray-800 text-xs" style={{ fontFamily: 'Times New Roman' }}>
          {obtenerCandidatos(row.cod_dtra)}
        </span>
      ),
      grow: 2
    },
    {
      name: 'Fecha solicitud',
      selector: (row) => formatearFecha(row.dtra_fecha_registro),
      width: '130px'
    },
    {
      name: 'Opciones',
      cell: (row) => (
        <button
          onClick={() => openModal(EntregaNoAtentadoModal, { cod_dtra: row.cod_dtra })}
          className="text-green-600 hover:text-green-800 text-xl"
          title="Entregar trámite"
        >
          <i className="fas fa-hand-point-right"></i>
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

  if (!noAtentado || noAtentado.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay trámites de no-atentado pendientes de entrega</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <DataTable
        columns={columns}
        data={noAtentado}
        customStyles={customStyles}
        pagination
        paginationPerPage={100}
        paginationRowsPerPageOptions={[50, 100, 200]}
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
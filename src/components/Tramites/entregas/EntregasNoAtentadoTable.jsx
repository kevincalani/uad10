// 📁 components/entregas/TablaEntregasNoAtentado.jsx
import React, {useState, useEffect} from 'react';
import { useModal } from '../../../hooks/useModal';
import DataTable from 'react-data-table-component';
import EntregaNoAtentadoModal from '../../../modals/servicios/entrega/EntregaNoAtentadoModal';
import { useNoAtentado } from '../../../hooks/useNoAtentados';
import { ArrowRightCircle } from 'lucide-react';

export default function EntregasNoAtentadoTable ({ noAtentado }) {
  const { openModal } = useModal();
  const { obtenerCandidatos, formatearCandidatosTexto } = useNoAtentado();
  const [candidatosPorTramite, setCandidatosPorTramite] = useState({});
  const [cargandoCandidatos, setCargandoCandidatos] = useState(false);

   useEffect(() => {
    if (noAtentado && noAtentado.length > 0) {
      cargarTodosCandidatos();
    }
  }, [noAtentado]);

  const cargarTodosCandidatos = async () => {
    setCargandoCandidatos(true);
    const candidatosTemp = {};

    // Cargar candidatos para todos los trámites
    for (const tramite of noAtentado) {
      const candidatos = await obtenerCandidatos(tramite.cod_dtra);
      candidatosTemp[tramite.cod_dtra] = candidatos;
    }

    setCandidatosPorTramite(candidatosTemp);
    setCargandoCandidatos(false);
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
      cell: (row) => {
        const candidatos = candidatosPorTramite[row.cod_dtra] || [];
        const textoFormateado = formatearCandidatosTexto(candidatos);
        
        return (
          <div className="text-xs" style={{ fontFamily: 'Times New Roman' }} title={textoFormateado}>
            {cargandoCandidatos ? (
              <span className="text-gray-400 italic">Cargando...</span>
            ) : candidatos.length > 0 ? (
              <CandidatosList candidatos={candidatos} />
            ) : (
              <span className="text-gray-500 italic">Sin candidatos</span>
            )}
          </div>
        );
      },
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
          className="p-1 rounded-full shadow-sm text-green-600 hover:bg-gray-300 cursor-pointer"
          title="Entregar trámite"
        >
          <ArrowRightCircle />
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
// Componente auxiliar para mostrar la lista de candidatos
const CandidatosList = ({ candidatos }) => {
  if (!candidatos || candidatos.length === 0) {
    return <span className="text-gray-500 italic">Sin candidatos</span>;
  }

  // Si hay muchos candidatos, mostrar solo los primeros 3 con un indicador
  const candidatosAMostrar = candidatos.slice(0, 3);
  const hayMas = candidatos.length > 3;

  return (
    <div className="space-y-1">
      {candidatosAMostrar.map((candidato, index) => (
        <div key={index} className="text-gray-800 font-bold">
          {candidato.nombre_completo}
          {candidato.carg_nombre && (
            <span className="text-blue-600 ml-1 font-normal">
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
};
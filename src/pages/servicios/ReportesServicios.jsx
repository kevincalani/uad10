import React from 'react';
import { useModal } from '../../hooks/useModal';
import ReportePersonalModal from '../../modals/servicios/reportes/ReportePersonalModal';
import ReporteGeneralModal from '../../modals/servicios/reportes/ReporteGeneralModal';
import ReporteEstadisticoModal from '../../modals/servicios/reportes/ReporteEstadisticoModal';
import ReporteTramitesPDFModal from '../../modals/servicios/reportes/ReporteTramitesPDFModal';
import ReporteEntregasPDFModal from '../../modals/servicios/reportes/ReporteEntregasPDFModal';
import { BookText } from 'lucide-react';

export default function ReportesPage(){
  const { openModal } = useModal();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-white shadow-md rounded-lg mb-6">
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
          <h5 className="text-xl font-semibold flex items-center">
            <BookText className='mr-2'/>
            LEGALIZACIONES
          </h5>
        </div>
        
        <div className="p-6">
          {/* Filtro de fecha */}
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-300">
            <span className="text-gray-700 font-semibold text-sm">
              Buscar fecha:
            </span>
            <input
              type="date"
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                if (e.target.value) {
                  window.location.href = `/listar-tramite-legalizacion/${e.target.value}`;
                }
              }}
            />
          </div>

          {/* Card de reportes */}
          <div className="bg-white shadow-sm rounded-lg ">
            <div className="p-4">
              <div className="bg-blue-600 text-white px-4 py-2 rounded shadow-md w-fit mx-auto mb-4">
                <h5 className="text-lg text-center font-semibold">Reportes y estadísticas</h5>
              </div>
              
              <hr className="my-4 border-gray-300" />
              
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => openModal(ReportePersonalModal)}
                    className="text-blue-600 hover:text-blue-800 hover:underline transition cursor-pointer"
                  >
                    1. Reporte mediante datos personales
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal(ReporteGeneralModal)}
                    className="text-blue-600 hover:text-blue-800 hover:underline transition cursor-pointer"
                  >
                    2. Reporte general de trámites
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal(ReporteEstadisticoModal)}
                    className="text-blue-600 hover:text-blue-800 hover:underline transition cursor-pointer"
                  >
                    3. Reporte Estadístico
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal(ReporteTramitesPDFModal)}
                    className="text-blue-600 hover:text-blue-800 hover:underline transition cursor-pointer"
                  >
                    4. Reporte en PDF de trámites mediante fecha
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal(ReporteEntregasPDFModal)}
                    className="text-blue-600 hover:text-blue-800 hover:underline transition cursor-pointer"
                  >
                    5. Reporte en PDF de entrega de trámites
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

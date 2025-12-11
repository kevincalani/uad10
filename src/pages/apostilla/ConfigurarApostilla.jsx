// 📁 pages/ApostillaConfigPage.jsx
import React, { useEffect } from 'react';
import { useApostilla } from '../../hooks/useApostilla';
import { useModal } from '../../hooks/useModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DocumentosApostillaTable from '../../components/apostilla/DocumentosApostillaTable';
import EditApostillaModal from '../../modals/apostilla/EditApostillaModal';
import { Plus } from 'lucide-react';

export default function ConfigurarApostilla () {
  const { loading, documentos, obtenerDocumentos } = useApostilla();
  const { openModal } = useModal();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    await obtenerDocumentos();
  };

  const handleNuevoDocumento = () => {
    openModal(EditApostillaModal, { cod_lis: 0, onSuccess: cargarDatos });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-white shadow-md rounded-lg mb-6">
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
          <h5 className="text-xl font-semibold flex items-center">
            <i className="fas fa-stamp mr-2"></i>
            Apostilla
          </h5>
        </div>

        <div className="p-6">
          <hr className="my-4 border-gray-300" />

          {/* Card principal */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              {/* Botón crear */}
              <div className="mb-4">
                <button
                  onClick={handleNuevoDocumento}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-sm transition text-sm flex items-center gap-2"
                >
                  <Plus/>
                   Trámite apostilla
                </button>
              </div>
              <div className='flex justify-center'>
                <div className="bg-blue-600 text-white px-4 py-2 rounded shadow-md w-fit mb-4 ">
                  <h5 className="text-lg font-semibold">Lista de Trámites de Apostilla</h5>
                </div>
              </div>
              <hr className="my-4 border-gray-300" />

              {/* Tabla */}
              {loading ? (
                <LoadingSpinner />
              ) : (
                <DocumentosApostillaTable 
                  documentos={documentos} 
                  onReload={cargarDatos}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
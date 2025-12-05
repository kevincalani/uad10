import React, { useState, useEffect } from 'react';
import { useEntregas } from '../../../hooks/useEntregas';
import { useModal } from '../../../hooks/useModal';
import ConfirmarEntregaModal from './ConfirmarEntregaModal';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

export default function EntregaModal ({ onClose, cod_tra }) {
  const { loading, obtenerPanelEntrega } = useEntregas();
  const { openModal } = useModal();
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, [cod_tra]);

  const cargarDatos = async () => {
    const resultado = await obtenerPanelEntrega(cod_tra);
    if (resultado) {
      setDatos(resultado);
    }
  };

  const handleEntregarTodo = () => {
    openModal(ConfirmarEntregaModal, { 
      varios: '2', 
      cod_dtra: cod_tra,
      onSuccess: onClose
    });
  };

  const handleEntregarUno = (cod_dtra) => {
    openModal(ConfirmarEntregaModal, { 
      varios: '1', 
      cod_dtra: cod_dtra,
      onSuccess: onClose
    });
  };

  if (loading || !datos) {
    return (
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl p-8">
        <LoadingSpinner />
      </div>
    );
  }

  const { tramita, documentos, persona, apoderado } = datos;

  return (
    <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
        <h5 className="text-white text-xl font-semibold flex items-center">
          <i className="fas fa-hand-point-right mr-2"></i>
          Entregas
        </h5>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 text-2xl font-bold transition"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-blue-600 text-white px-4 py-2 rounded shadow-md w-3/4 mx-auto mb-6">
          <h6 className="text-center font-semibold">Formulario de entrega de legalizaciones</h6>
        </div>

        <hr className="my-4 border-gray-300" />

        {/* Información del trámite */}
        <div className="mb-6">
          <table className="w-full text-sm text-gray-800">
            <tbody>
              <tr>
                <th className="text-right italic pr-4 py-2">Nro. Trámite:</th>
                <td className="border-b border-gray-800 py-2">{tramita.tra_numero}</td>
              </tr>
              <tr>
                <th className="text-right italic pr-4 py-2">Persona:</th>
                <td className="border-b border-gray-800 py-2">
                  {persona ? `${persona.per_apellido} ${persona.per_nombre}` : 'N/A'}
                </td>
              </tr>
              {apoderado && (
                <tr>
                  <th className="text-right italic pr-4 py-2">Apoderado:</th>
                  <td className="border-b border-gray-800 py-2">
                    {apoderado.apo_apellido} {apoderado.apo_nombre}
                    <span className="ml-2 bg-red-600 text-white rounded px-2 py-1 text-xs">
                      Apoderado
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Lista de documentos */}
        <div>
          <h6 className="text-blue-600 font-bold mb-3">Documentos a entregar:</h6>
          
          {documentos && documentos.length > 0 ? (
            <div className="space-y-3">
              {documentos.map((doc, index) => (
                <div 
                  key={index} 
                  className="border border-gray-300 rounded p-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{doc.tre_nombre}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Nº: {doc.dtra_numero_tramite}/{doc.dtra_gestion_tramite}
                    </div>
                    {doc.dcon_doc && (
                      <div className="text-xs text-gray-500 mt-1">
                        Documento: {doc.dcon_doc}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleEntregarUno(doc.cod_dtra)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
                    disabled={doc.dtra_falso === 't'}
                  >
                    <i className="fas fa-hand-point-right mr-2"></i>
                    Entregar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No hay documentos disponibles para entregar
            </p>
          )}
        </div>

        {/* Advertencia */}
        <div className="mt-6 p-3 border border-red-600 rounded bg-red-50 text-red-700 text-xs italic">
          <p>* Esta acción quedará registrada en el sistema</p>
          <p>* Si hace la entrega de este trámite, ya no se podrá modificar su estado</p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center gap-3 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-sm"
        >
          Cerrar
        </button>
        {documentos && documentos.length > 1 && (
          <button
            onClick={handleEntregarTodo}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
          >
            <i className="fas fa-check-double mr-2"></i>
            Entregar Todos
          </button>
        )}
      </div>
    </div>
  );
};
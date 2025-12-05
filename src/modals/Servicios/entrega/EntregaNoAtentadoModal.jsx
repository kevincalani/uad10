import React, { useState, useEffect } from 'react';
import { useEntregas } from '../../../hooks/useEntregas';
import { toast } from '../../../utils/toast';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

export default function EntregaNoAtentadoModal ({ onClose, cod_dtra }) {
  const { loading, obtenerDatosConfirmacion, guardarEntrega } = useEntregas();
  const [datos, setDatos] = useState(null);
  const [tipoEntrega, setTipoEntrega] = useState('t');

  useEffect(() => {
    cargarDatos();
  }, [cod_dtra]);

  const cargarDatos = async () => {
    // Para no-atentado usamos varios='1'
    const resultado = await obtenerDatosConfirmacion('1', cod_dtra);
    if (resultado) {
      setDatos(resultado);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      tipo: tipoEntrega,
      cdtra: cod_dtra
    };

    try {
      await guardarEntrega(formData);
      toast.success('Entrega de no-atentado registrada exitosamente');
      onClose();
    } catch (error) {
      console.error('Error al guardar entrega:', error);
    }
  };

  if (loading || !datos) {
    return (
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-8">
        <LoadingSpinner />
      </div>
    );
  }

  const { tramita, docleg } = datos;

  return (
    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
        <h5 className="text-white text-xl font-bold flex items-center">
          <i className="fas fa-hand-point-right mr-2"></i>
          Entrega No-Atentado
        </h5>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 text-2xl font-bold transition"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="bg-blue-600 text-white px-4 py-2 rounded shadow-md w-3/4 mx-auto mb-6">
            <h6 className="text-center font-semibold">
              Formulario de entrega de no-atentado
            </h6>
          </div>

          <hr className="my-4 border-gray-300" />

          <table className="w-11/12 mx-auto text-sm text-gray-800">
            <tbody>
              <tr>
                <th className="text-right italic pr-4 py-2 align-top">Nro. Trámite:</th>
                <td className="border-b border-gray-800 py-2">
                  {docleg.dtra_numero_tramite}/{docleg.dtra_gestion_tramite}
                </td>
              </tr>
              <tr>
                <th className="text-right italic pr-4 py-2 align-top">Trámite:</th>
                <td className="border-b border-gray-800 py-2">{docleg.tre_nombre}</td>
              </tr>
              <tr>
                <th className="text-right italic pr-4 py-2 align-top">Tipo:</th>
                <td className="border-b border-gray-800 py-2">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                    NO-ATENTADO
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-6 p-3 border border-red-600 rounded bg-red-50 text-red-700 text-xs italic">
            <p>* Esta acción quedará registrada en el sistema</p>
            <p>* Si hace la entrega de este trámite, ya no se podrá modificar su estado</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-sm"
          >
            Cerrar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm disabled:bg-blue-300"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};
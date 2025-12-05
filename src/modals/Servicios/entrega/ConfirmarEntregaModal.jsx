import React, { useState, useEffect } from 'react';
import { useEntregas } from '../../../hooks/useEntregas';
import LoadingSpinner from '../../../components/common/LoadingSpinner';


export default function ConfirmarEntregaModal ({ onClose, varios, cod_dtra, onSuccess }) {
  const { loading, obtenerDatosConfirmacion, guardarEntrega } = useEntregas();
  const [datos, setDatos] = useState(null);
  const [tipoEntrega, setTipoEntrega] = useState('t'); // 't' = titular, 'a' = apoderado

  useEffect(() => {
    cargarDatos();
  }, [varios, cod_dtra]);

  const cargarDatos = async () => {
    const resultado = await obtenerDatosConfirmacion(varios, cod_dtra);
    if (resultado) {
      setDatos(resultado);
      // Si tiene apoderado, seleccionar apoderado por defecto
      if (resultado.apoderado) {
        setTipoEntrega('a');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      tipo: tipoEntrega
    };

    if (varios === '2') {
      // Entregar todos
      formData.todo = 't';
      formData.ctra = cod_dtra;
    } else {
      // Entregar uno
      formData.cdtra = cod_dtra;
    }

    try {
      await guardarEntrega(formData);
      if (onSuccess) {
        onSuccess();
      }
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

  const { tramita, persona, apoderado, docleg } = datos;

  // Determinar si docleg es único o múltiple
  const esDocumentoUnico = varios === '1';

  return (
    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
        <h5 className="text-white text-xl font-bold flex items-center">
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
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="bg-blue-600 text-white px-4 py-2 rounded shadow-md w-3/4 mx-auto mb-6">
            <h6 className="text-center font-semibold">
              Formulario de entrega de legalizaciones
            </h6>
          </div>

          <hr className="my-4 border-gray-300" />

          <table className="w-11/12 mx-auto text-sm text-gray-800">
            <tbody>
              <tr>
                <th className="text-right italic pr-4 py-2 align-top">Nro. Trámite:</th>
                <td className="border-b border-gray-800 py-2">{tramita.tra_numero}</td>
              </tr>
              <tr>
                <th className="text-right italic pr-4 py-2 align-top">Trámite:</th>
                <td className="border-b border-gray-800 py-2">
                  {esDocumentoUnico ? docleg.tre_nombre : 'Múltiples documentos'}
                </td>
              </tr>
              <tr>
                <th className="text-right italic pr-4 py-2 align-top">
                  <br />
                  Entregar A:
                </th>
                <td className="border-b border-gray-800 py-2">
                  <br />
                  <div className="space-y-2">
                    {apoderado ? (
                      <>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="tipo"
                            value="a"
                            checked={tipoEntrega === 'a'}
                            onChange={(e) => setTipoEntrega(e.target.value)}
                            className="w-4 h-4"
                          />
                          <span>
                            {apoderado.apo_apellido} {apoderado.apo_nombre}
                            <span className="ml-2 bg-red-600 text-white rounded px-2 py-1 text-xs">
                              Apo
                            </span>
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="tipo"
                            value="t"
                            checked={tipoEntrega === 't'}
                            onChange={(e) => setTipoEntrega(e.target.value)}
                            className="w-4 h-4"
                          />
                          <span>
                            {persona.per_apellido} {persona.per_nombre}
                          </span>
                        </label>
                      </>
                    ) : (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tipo"
                          value="t"
                          checked={tipoEntrega === 't'}
                          onChange={(e) => setTipoEntrega(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span>
                          {persona.per_apellido} {persona.per_nombre}
                        </span>
                      </label>
                    )}
                  </div>
                  <br />
                </td>
              </tr>
            </tbody>
          </table>

          {varios !== '2' && (
            <div className="mt-6 p-3 border border-red-600 rounded bg-red-50 text-red-700 text-xs italic">
              <p>* Esta acción quedará registrada en el sistema</p>
              <p>* Si hace la entrega de este trámite, ya no se podrá modificar su estado</p>
            </div>
          )}
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
          {(!esDocumentoUnico || docleg.dtra_falso !== 't') && (
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm disabled:bg-blue-300"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
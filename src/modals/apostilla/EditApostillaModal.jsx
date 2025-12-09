// 📁 components/apostilla/ModalFormDocumento.jsx
import React, { useState, useEffect } from 'react';
import { useApostilla } from '../../hooks/useApostilla';
import LoadingSpinner from '../../components/common/LoadingSpinner';


export default function EditApostillaModal ({ onClose, cod_lis = 0, onSuccess }) {
  const { loading, obtenerDocumento, guardarDocumento } = useApostilla();
  const [formData, setFormData] = useState({
    nombre: '',
    alias: '',
    cuenta: '',
    monto: '',
    resolucion: '',
    tipo: '',
    desc: '',
    cl: cod_lis
  });

  useEffect(() => {
    if (cod_lis !== 0) {
      cargarDatos();
    }
  }, [cod_lis]);

  const cargarDatos = async () => {
    const data = await obtenerDocumento(cod_lis);
    if (data && data.tramite) {
      setFormData({
        nombre: data.tramite.lis_nombre || '',
        alias: data.tramite.lis_alias || '',
        cuenta: data.tramite.lis_cuenta || '',
        monto: data.tramite.lis_monto || '',
        resolucion: data.tramite.lis_resolucion || '',
        tipo: data.tramite.lis_tipo || '',
        desc: data.tramite.lis_desc || '',
        cl: cod_lis
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await guardarDocumento(formData);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      // El error ya se maneja en el hook
    }
  };

  const tiposBusqueda = [
    { value: 'db', label: 'DIPLOMA DE BACHILLER' },
    { value: 'ca', label: 'CERTIFICADO ACADEMICO' },
    { value: 'da', label: 'DIPLOMA ACADEMICO' },
    { value: 'tp', label: 'TITULO PROFESIONAL' },
    { value: 'di', label: 'DIPLOMADO' },
    { value: 'ma', label: 'MAESTRIA' },
    { value: 'es', label: 'ESPECIALIDAD' },
    { value: 'do', label: 'DOCTORADO' },
    { value: 're', label: 'REVALIDA' },
    { value: 'su', label: 'SUPLETORIO' },
    { value: 'sid', label: 'TRAMITE MEDIANTE EL SID' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
        <h5 className="text-white text-xl font-bold flex items-center">
          <i className="fas fa-book mr-2"></i>
          Trámite
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
          <div className="bg-blue-600 text-white px-4 py-2 rounded shadow-md w-fit mx-auto mb-6">
            <h6 className="text-center font-semibold">
              Formulario para {cod_lis === 0 ? 'crear' : 'editar'} trámite
            </h6>
          </div>

          <hr className="my-4 border-gray-300" />

          {loading && cod_lis !== 0 ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-4">
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <th className="text-right italic pr-4 py-2 align-top w-1/3">
                      Nombre<span className="text-red-600">*</span>:
                    </th>
                    <td className="border-b border-gray-800 py-2">
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-0"
                        placeholder="Ingrese el nombre"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className="text-right italic pr-4 py-2 align-top">
                      Alias<span className="text-red-600">*</span>:
                    </th>
                    <td className="border-b border-gray-800 py-2">
                      <input
                        type="text"
                        name="alias"
                        value={formData.alias}
                        onChange={handleInputChange}
                        required
                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-0"
                        placeholder="Ingrese el alias"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className="text-right italic pr-4 py-2 align-top">
                      N° Cuenta<span className="text-red-600">*</span>:
                    </th>
                    <td className="border-b border-gray-800 py-2">
                      <input
                        type="text"
                        name="cuenta"
                        value={formData.cuenta}
                        onChange={handleInputChange}
                        required
                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-0"
                        placeholder="Ingrese el número de cuenta"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className="text-right italic pr-4 py-2 align-top">
                      Monto (Bs.)<span className="text-red-600">*</span>:
                    </th>
                    <td className="border-b border-gray-800 py-2">
                      <input
                        type="text"
                        name="monto"
                        value={formData.monto}
                        onChange={handleInputChange}
                        required
                        pattern="[0-9]{1,4}"
                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-0"
                        placeholder="Ingrese el monto"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className="text-right italic pr-4 py-2 align-top">Resolución:</th>
                    <td className="border-b border-gray-800 py-2">
                      <input
                        type="text"
                        name="resolucion"
                        value={formData.resolucion}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-0"
                        placeholder="Ingrese la resolución"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className="text-right italic pr-4 py-2 align-top">Buscar en:</th>
                    <td className="border-b border-gray-800 py-2">
                      <select
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-0"
                      >
                        <option value="">Seleccione...</option>
                        {tiposBusqueda.map(tipo => (
                          <option key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th className="text-right italic pr-4 py-2 align-top">Descripción:</th>
                    <td className="border-b border-gray-800 py-2">
                      <textarea
                        name="desc"
                        value={formData.desc}
                        onChange={handleInputChange}
                        rows="5"
                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-0 resize-none"
                        placeholder="Ingrese la descripción"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? 'Guardando...' : 'Aceptar'}
          </button>
        </div>
      </form>
    </div>
  );
};
import React, { useState, useEffect } from "react";
import { BUSCAR_EN_OPTIONS } from "../Constants/tramiteDatos";
import { BookText } from "lucide-react";

export default function AddEditTramiteModal({
  onClose,
  title,
  type,
  initialData = {},
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    cod_tre: "",
    tre_nombre: "",
    tre_numero_cuenta: "",
    tre_costo: "",
    tre_duracion: "",
    tre_buscar_en: "",
    tre_desc: "",
    tre_titulo: "",
    tre_titulo_interno: "",
    tre_solo_sello: false,
    tre_tipo: "",
    tre_hab: "",
    tre_glosa: "",
  });

  useEffect(() => {
    setFormData({
      cod_tre: initialData.cod_tre || "",
      tre_nombre: initialData.tre_nombre || "",
      tre_numero_cuenta: initialData.tre_numero_cuenta || "",
      tre_costo: initialData.tre_costo || "",
      tre_duracion: initialData.tre_duracion || "",
      tre_buscar_en: initialData.tre_buscar_en || "",
      tre_desc: initialData.tre_desc || "",
      tre_titulo: initialData.tre_titulo || "",
      tre_titulo_interno: initialData.tre_titulo_interno || "",
      tre_solo_sello:
        initialData.tre_solo_sello === "t" || initialData.tre_solo_sello === true,
      tre_tipo: initialData.tre_tipo || type || "",
      tre_hab: initialData.tre_hab || "t",
      tre_glosa: initialData.tre_glosa || "",
    });
  }, []);

  const showDatosGlosa = ["Legalizacion", "Certificacion", "No atentado", "Consejo"].includes(type);
  const showBuscarEn = ["Legalizacion", "Certificacion", "No atentado", "Consejo"].includes(type);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      sello: formData.tre_solo_sello ? "on" : "",
    };
    onSubmit(dataToSubmit);
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-[120vh] max-h-[90vh] mx-auto">
      {/* Header */}
      <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center sticky top-0 z-10">
        <h2 className="text-xl font-semibold flex items-center">
          <BookText className="mr-3 text-white" size={32} /> {title}
        </h2>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="pt-2 px-4 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6"
      >
        {/* Columna Izquierda */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-blue-700">
            * Datos del trámite
          </h3>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre :
            </label>
            <input
              type="text"
              name="tre_nombre"
              value={formData.tre_nombre}
              onChange={handleChange}
              required
              className="w-full border-b border-gray-300 pl-2 focus:outline-none focus:border-blue-500 py-1 "
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              N° Cuenta :
            </label>
            <input
              type="text"
              name="tre_numero_cuenta"
              value={formData.tre_numero_cuenta}
              onChange={handleChange}
              required
              className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Costo (Bs.):
            </label>
            <input
              type="number"
              name="tre_costo"
              value={formData.tre_costo}
              onChange={handleChange}
              required
              className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duración (Hrs):
            </label>
            <input
              type="text"
              name="tre_duracion"
              value={formData.tre_duracion}
              onChange={handleChange}
              required
              className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1"
            />
          </div>

          {showBuscarEn && (
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar en :
              </label>
              <select
                name="tre_buscar_en"
                value={formData.tre_buscar_en}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1"
              >
                <option value=""></option>
                {BUSCAR_EN_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción :
            </label>
            <textarea
              name="tre_desc"
              value={formData.tre_desc}
              onChange={handleChange}
              rows="2"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1 resize-y"
            />
          </div>
        </div>

        {/* Columna Derecha */}
        {showDatosGlosa && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-blue-700">
              * Datos de glosa
            </h3>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título de glosa:
              </label>
              <textarea
                name="tre_titulo"
                value={formData.tre_titulo}
                onChange={handleChange}
                rows="3"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1 resize-y"
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título de glosa (Interno):
              </label>
              <textarea
                name="tre_titulo_interno"
                value={formData.tre_titulo_interno}
                onChange={handleChange}
                rows="3"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1 resize-y"
              />
            </div>

            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                name="tre_solo_sello"
                checked={formData.tre_solo_sello}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Solo sello:
              </label>
            </div>
          </div>
        )}
      </form>

      {/* Footer */}
      <div className="bg-gray-100 p-2 rounded-b-lg flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-6 rounded-md transition duration-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}

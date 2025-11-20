import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import LabeledInput from "../LabeledInput"; // asegúrate que exista

export default function DatosApoderadoForm({
  datosApoderado,
  handleApoderadoCiChange,
  handleDatosApoderadoChange,
  onSave, // función para guardar
}) {
  const [isVisible, setIsVisible] = useState(
    !!datosApoderado.ci || !!datosApoderado.nombres || !!datosApoderado.apellidos
  );
  const [localDatos, setLocalDatos] = useState(datosApoderado);
  const [loading, setLoading] = useState(false);

  // Sincroniza localDatos con el padre y muestra el formulario si hay datos
  useEffect(() => {
    setLocalDatos(datosApoderado);
    if (datosApoderado.ci || datosApoderado.nombres || datosApoderado.apellidos) {
      setIsVisible(true);
    }
  }, [datosApoderado]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setLocalDatos((prev) => ({ ...prev, [name]: value }));

    if (name === "ci") {
      if (value.length < 3) return;

      setLoading(true);
      const ap = await handleApoderadoCiChange({ target: { value } });

      if (ap) {
        setLocalDatos({
          ci: ap.ap_ci,
          apellidos: ap.ap_apellido,
          nombres: ap.ap_nombre,
          tipoApoderado: ap.ap_tipo || ""
        });
      } else {
        setLocalDatos((prev) => ({
          ...prev,
          apellidos: "",
          nombres: "",
          tipoApoderado: ""
        }));
      }

      setLoading(false);
    } else {
      handleDatosApoderadoChange(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(localDatos);
    setIsVisible(false);
  };

  const showNoApoderadoMessage =
    !datosApoderado.ci && !datosApoderado.nombres && !datosApoderado.apellidos;

  return (
    <div className="border border-gray-200 p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
        Datos del Apoderado
      </h3>

      {!isVisible ? (
        <div className="flex justify-end">
          <button
            onClick={() => setIsVisible(true)}
            className="bg-blue-500 text-white py-1 px-4 text-sm rounded font-medium hover:bg-blue-600 transition"
          >
            Editar Datos
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h4 className="font-semibold text-gray-700">Editar Datos del Apoderado</h4>
            <button
              onClick={() => setIsVisible(false)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={18} />
            </button>
          </div>

          {/* FORMULARIO */}
          <form className="space-y-3 text-sm pb-3" onSubmit={handleSubmit}>
            <LabeledInput
              label="CI:"
              name="ci"
              value={localDatos.ci}
              onChange={handleChange}
            />
            {loading && <p className="text-xs text-gray-500">Cargando...</p>}

            <LabeledInput
              label="Apellidos:"
              name="apellidos"
              value={localDatos.apellidos}
              onChange={handleChange}
            />

            <LabeledInput
              label="Nombres:"
              name="nombres"
              value={localDatos.nombres}
              onChange={handleChange}
            />

            {/* Tipo Apoderado */}
            <div className="flex text-sm">
              <label className="text-gray-600 font-medium whitespace-nowrap text-right mr-2 flex-shrink-0 w-24">
                Tipo Apoderado:
              </label>
              <div className="flex flex-col space-y-1">
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="tipoApoderado"
                    value="Declaracion Jurada"
                    checked={localDatos.tipoApoderado === "Declaracion Jurada"}
                    onChange={handleChange}
                  />
                  <span>Declaración Jurada</span>
                </label>

                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="tipoApoderado"
                    value="Poder Notariado"
                    checked={localDatos.tipoApoderado === "Poder Notariado"}
                    onChange={handleChange}
                  />
                  <span>Poder Notariado</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-green-500 text-white py-1 px-4 text-sm rounded font-medium hover:bg-green-600 transition"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {showNoApoderadoMessage && (
        <p className="mt-2 text-red-500 text-xs">
          No existe apoderado registrado
        </p>
      )}
    </div>
  );
}

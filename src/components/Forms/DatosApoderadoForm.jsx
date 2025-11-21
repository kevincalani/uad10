import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import LabeledInput from "../LabeledInput";

export default function DatosApoderadoForm({
  datosApoderado,
  handleApoderadoCiChange,
  handleDatosApoderadoChange,
  onSave,
}) {
  // ---------------------------------------
  // ESTADOS
  // ---------------------------------------
  const [isEditing, setIsEditing] = useState(false); // primera vista bloqueada siempre
  const [localDatos, setLocalDatos] = useState({
    ci: "",
    apellidos: "",
    nombres: "",
    tipoApoderado: "",
  });

  const [loading, setLoading] = useState(false);

  // ---------------------------------------
  // SINCRONIZAR CON DATOS EXTERNOS
  // ---------------------------------------
  useEffect(() => {
    setLocalDatos({
      ci: datosApoderado.ci ?? "",
      apellidos: datosApoderado.apellidos ?? "",
      nombres: datosApoderado.nombres ?? "",
      tipoApoderado: datosApoderado.tipoApoderado ?? "",
    });
  }, [datosApoderado]);

  // ---------------------------------------
  // MANEJO DE CAMBIOS
  // ---------------------------------------
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setLocalDatos((prev) => ({ ...prev, [name]: value }));

    // AUTOCOMPLETADO SOLO POR CI
    if (name === "ci") {
      if (value.length < 3) return;

      setLoading(true);
      const ap = await handleApoderadoCiChange(value);

      if (ap) {
        setLocalDatos((prev) => ({
          ...prev,
          ci: value,
          apellidos: ap.apellidos,
          nombres: ap.nombres,
          tipoApoderado: "", // no autocompletar tipo
        }));
      } else {
        setLocalDatos((prev) => ({
          ...prev,
          apellidos: "",
          nombres: "",
          tipoApoderado: "",
        }));
      }
      setLoading(false);
    } else {
      handleDatosApoderadoChange(e);
    }
  };

  // ---------------------------------------
  // GUARDAR
  // ---------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // onSave debe devolver el objeto guardado con todos los campos
    const savedApoderado = await onSave(localDatos);

    if (savedApoderado) {
      setLocalDatos({
        ci: savedApoderado.ci ?? "",
        apellidos: savedApoderado.apellidos ?? "",
        nombres: savedApoderado.nombres ?? "",
        tipoApoderado: savedApoderado.tipoApoderado ?? "",
      });
    }

    setIsEditing(false);
  };

  // ---------------------------------------
  // MAPEAR TIPO PARA MOSTRAR EN VISTA BLOQUEADA
  // ---------------------------------------
  const tipoTexto =
    localDatos.tipoApoderado === "d"
      ? "Declaración Jurada"
      : localDatos.tipoApoderado === "p"
      ? "Poder Notarial"
      : "";

  return (
    <div className="border border-gray-200 p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
        Datos del Apoderado
      </h3>

      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h4 className="font-semibold text-gray-700">
          {isEditing ? "Editar Datos del Apoderado" : "Apoderado Registrado"}
        </h4>
        {isEditing && (
          <button
            onClick={() => setIsEditing(false)}
            className="text-red-500 hover:text-red-700"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <form className="space-y-3 text-sm pb-3" onSubmit={handleSubmit}>
        <LabeledInput
          label="CI:"
          name="ci"
          value={localDatos.ci ?? ""}
          onChange={handleChange}
          disabled={!isEditing}
        />

        {loading && <p className="text-xs text-gray-500">Cargando...</p>}

        <LabeledInput
          label="Apellidos:"
          name="apellidos"
          value={localDatos.apellidos ?? ""}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <LabeledInput
          label="Nombres:"
          name="nombres"
          value={localDatos.nombres ?? ""}
          onChange={handleChange}
          disabled={!isEditing}
        />

        {/* Tipo Apoderado */}
        {!isEditing ? (
          <LabeledInput
            label="Tipo Apoderado:"
            name="tipoApoderado"
            value={tipoTexto}
            disabled
          />
        ) : (
          <div className="flex text-sm">
            <label className="text-gray-600 font-medium whitespace-nowrap text-right mr-2 flex-shrink-0 w-24">
              Tipo Apoderado:
            </label>
            <div className="flex flex-col space-y-1">
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="tipoApoderado"
                  value="d"
                  checked={localDatos.tipoApoderado === "d"}
                  onChange={handleChange}
                />
                <span>Declaración Jurada</span>
              </label>

              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="tipoApoderado"
                  value="p"
                  checked={localDatos.tipoApoderado === "p"}
                  onChange={handleChange}
                />
                <span>Poder Notarial</span>
              </label>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-green-500 text-white py-1 px-4 text-sm rounded font-medium hover:bg-green-600 transition"
            >
              Guardar
            </button>
          </div>
        )}
      </form>

      {/* Botón Editar Datos */}
      {!isEditing && (
        <div className="flex justify-end mt-2">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white py-1 px-4 text-sm rounded font-medium hover:bg-blue-600 transition"
          >
            Editar Datos
          </button>
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { KeyRound, X } from "lucide-react";
import { toast } from "../utils/toast";
import { usePermisos } from "../Hooks/usePermisos";

export default function NuevoPermisoModal({ onClose, subsistema, objetos }) {
  const [permiso, setPermiso] = useState("");
  const [leyenda, setLeyenda] = useState("");
  const [objeto, setObjeto] = useState("");
  const { crearPermiso, listarPermisos } = usePermisos();

  const handleGuardar = async () => {
    if (!permiso.trim() || !leyenda.trim() || !objeto) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    try {
      const { message } = await crearPermiso({
        permiso: permiso.trim(),
        leyenda: leyenda.trim(),
        objeto,
        subsistema,
      });

      toast.success(message || "Permiso creado correctamente.");
      listarPermisos(); // 🔁 refresca lista
      onClose();
    } catch {
      toast.error("Error al crear el permiso.");
    }
  };

  return (
    <div className="w-[550px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* 🔹 Encabezado */}
      <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-4">
        <h3 className="flex items-center gap-2 font-bold text-lg">
          <KeyRound className="w-5 h-5" />
          Nuevo Permiso
        </h3>
        <button onClick={onClose}>
          <X className="w-5 h-5 hover:text-gray-200" />
        </button>
      </div>

      {/* 🔹 Título */}
      <div className="text-center py-4 text-base font-semibold text-blue-600">
        Formulario para nuevo permiso
      </div>

      {/* 🔹 Formulario */}
      <div className="px-6 pt-4 pb-8 space-y-3">
        <div className="grid grid-cols-3 items-center">
          <label className="text-right font-semibold text-gray-600 text-base pr-2">
            Permiso:
          </label>
          <input
            type="text"
            value={permiso}
            onChange={(e) => setPermiso(e.target.value)}
            className="col-span-2 border border-gray-300 rounded px-2 py-1 w-full focus:ring focus:ring-blue-300 outline-none"
          />
        </div>

        <div className="grid grid-cols-3 items-center">
          <label className="text-right font-semibold text-gray-600 text-base pr-2">
            Leyenda:
          </label>
          <input
            type="text"
            value={leyenda}
            onChange={(e) => setLeyenda(e.target.value)}
            className="col-span-2 border border-gray-300 rounded px-2 py-1 w-full focus:ring focus:ring-blue-300 outline-none"
          />
        </div>

        <div className="grid grid-cols-3 items-center">
          <label className="text-right font-semibold text-gray-600 text-base pr-2">
            Objeto:
          </label>
          <select
            value={objeto}
            onChange={(e) => setObjeto(e.target.value)}
            className="col-span-2 border border-gray-300 rounded px-2 py-1 w-full focus:ring focus:ring-blue-300 outline-none"
          >
            <option value=""></option>
            {objetos.map((o) => (
              <option key={o.cod_obj} value={o.cod_obj}>
                {o.obj_nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 items-center">
          <label className="text-right font-semibold text-gray-600 text-base pr-2">
            Subsistema:
          </label>
          <input
            type="text"
            value={subsistema}
            readOnly
            className="col-span-2 border border-gray-300 rounded px-2 py-1 bg-gray-100 text-gray-600 w-full"
          />
        </div>
      </div>

      {/* 🔹 Botones */}
      <div className="flex justify-end gap-2 px-6 py-3 border-t border-gray-300">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded border bg-gray-400 text-white hover:bg-gray-500 transition"
        >
          Cancelar
        </button>
        <button
          onClick={handleGuardar}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

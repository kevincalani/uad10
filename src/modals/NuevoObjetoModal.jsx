import React, { useState } from "react";
import { Package2, X } from "lucide-react";
import { toast } from "../utils/toast";
import { usePermisos } from "..//Hooks/usePermisos";

export default function NuevoObjetoModal({ onClose, subsistema }) {
  const [nombre, setNombre] = useState("");
  const { crearObjeto, listarPermisos } = usePermisos();

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      toast.error("El campo Objeto no puede estar vacío.");
      return;
    }

    try {
      const { message } = await crearObjeto({
        nombre: nombre.trim(),
        subsistema,
      });

      toast.success(message || "Objeto creado correctamente.");
      listarPermisos(); // 🔁 refresca lista (si está en contexto)
      onClose();
    } catch {
      toast.error("Error al crear el objeto.");
    }
  };

  return (
    <div className="w-[500px] rounded-lg shadow-lg overflow-hidden ">
      {/* 🔹 Encabezado */}
      <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-4">
        <h3 className="flex items-center gap-2 font-bold text-lg">
          <Package2 className="w-5 h-5" />
          Nuevo Objeto
        </h3>
        <button onClick={onClose}>
          <X className="w-5 h-5 hover:text-gray-200" />
        </button>
      </div>

      {/* 🔹 Título */}
      <div className="text-center py-4 text-base font-semibold text-blue-600">
        Formulario para nuevo objeto
      </div>

      {/* 🔹 Formulario */}
      <div className="px-6 pt-4 pb-8 space-y-3">
        <div className="grid grid-cols-3 items-center">
          <label className="text-right font-semibold text-gray-600 text-base pr-2">
            Objeto:
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="col-span-2 border border-gray-300 rounded px-2 py-1 w-full focus:ring focus:ring-blue-300 outline-none"
          />
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
      <div className="flex justify-end gap-2 px-6 py-3 border-t border-gray-300" >
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

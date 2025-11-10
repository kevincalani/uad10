import React, { useState } from "react";
import { UserCheck, CircleHelp } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../api/axios";


export default function HabilitarUsuarioModal({ onClose, usuario, onSuccess }) {
  const [loading, setLoading] = useState(false);

  if (!usuario) return null;

  const estaHabilitado = usuario.bloqueado === "f";
  const accion = estaHabilitado ? "Deshabilitar" : "Habilitar";
  const mensaje = estaHabilitado
    ? "¿Está seguro de bloquear al usuario?"
    : "¿Está seguro de habilitar al usuario?";

  const handleAceptar = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/api/usuarios/habilitar/${usuario.id}`);
      toast.success(response.data?.message || "Estado actualizado correctamente");
      onSuccess?.(); // refrescar la tabla
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo cambiar el estado del usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-gray-800 w-[480px] mx-auto">
      {/* 🔴 Header */}
      <div className="flex justify-between items-center bg-red-600 p-3 rounded-t-lg">
        <div className="flex items-center gap-2 text-lg text-white font-semibold">
          <UserCheck className="w-6 h-6" />
          {accion}
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 text-xl font-semibold"
        >
          ✕
        </button>
      </div>

      {/* 🧠 Mensaje principal */}
      <p className="text-sm my-4 mx-2 text-left">{mensaje}</p>

      {/* 📋 Datos del usuario */}
      <div className="relative bg-red-200 border border-red-200 rounded p-4 mx-16 text-left">
        <div className="grid grid-cols-[1fr_3fr] gap-y-1 text-sm">
          <div className="font-semibold text-gray-700 text-right">Nombre:</div>
          <div className="font-bold text-gray-900 ml-2">{usuario.name}</div>

          <div className="font-semibold text-gray-700 text-right">Login:</div>
          <div className="font-bold text-gray-900 ml-2">{usuario.email}</div>

          <div className="font-semibold text-gray-700 text-right">Rol:</div>
          <div className="font-bold text-gray-900 uppercase ml-2">{usuario.rol}</div>
        </div>

        {/* ❓ Icono fuera del bloque de datos */}
        <div className="absolute -right-10 top-5 text-red-500">
          <CircleHelp className="w-8 h-8" />
        </div>
      </div>

      {/* ⚠️ Advertencia */}
      <p className="text-xs text-red-600 italic my-4 ml-2 text-left border border-red-500 w-90 rounded ">
        * Esta acción se quedará registrada en el sistema
      </p>

      {/* 🔘 Botones */}
      <div className="flex justify-end gap-3 py-3 pr-3 border-t border-gray-300">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 rounded bg-gray-400  text-white hover:bg-gray-700"
        >
          Cancelar
        </button>

        <button
          onClick={handleAceptar}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Procesando..." : "Aceptar"}
        </button>
      </div>
    </div>
  );
}
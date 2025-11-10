import React from "react";
import { useGlosas } from "../hooks/useGlosas";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { toast } from "../utils/toast";

export default function DeleteTramiteModal({ onClose, onConfirm, itemData }) {
  // Usamos el hook con el código del trámite
  const { glosas, loading, error } = useGlosas(itemData?.cod_tre);

  // 🔁 Estado de carga
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 text-center">
        <p className="text-gray-500">Verificando glosas asociadas...</p>
      </div>
    );
  }

  // ⚠️ Si hay error al cargar glosas
  if (error) {
    toast.error("No se pudo verificar las glosas del trámite.");
  }

  // 🧩 Si tiene glosas, protegemos la acción
  const isProtected = glosas.length > 0;

  return (
    <DeleteConfirmModal
      onClose={onClose}
      onConfirm={onConfirm}
      itemType="tramite"
      itemData={itemData}
      isProtected={isProtected}
    />
  );
}

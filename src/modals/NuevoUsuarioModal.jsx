import { useState } from "react";
import { UserPlus } from "lucide-react";
import NuevoUsuarioForm from "../components/Forms/NuevoUsuarioForm";
import api from "../api/axios"; // tu archivo de configuración axios
import { toast } from "../utils/toast"; // pequeño helper que crearemos abajo

export default function NuevoUsuarioModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Recibir el formData desde el formulario hijo
  const handleFormChange = (data) => {
    setFormData(data);
  };

  const handleSave = async () => {
    if (!formData?.validate || !formData.validate()) {
      toast.error("Por favor, completa los campos requeridos.");
      return;
    }

    // Validación simple
    const requiredFields = [
      "nombre", "ci", "sexo", "login", "cargo", "rol"
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`El campo "${field}" es obligatorio.`);
        return;
      }
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      const response = await api.post("/api/usuarios/guardar", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ Usuario creado correctamente");
      if (typeof onSuccess === "function") {
        onSuccess();
      } // actualiza lista
      onClose();

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Error al crear el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-white max-w-full">
      {/* HEADER */}
      <div className="flex justify-between bg-blue-700 rounded-t-lg items-center border-b border-gray-50 p-3 mb-3">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <UserPlus size={20} />
          Registrar Nuevo Usuario
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-black text-lg font-semibold"
        >
          ✕
        </button>
      </div>

      {/* FORMULARIO */}
      <NuevoUsuarioForm onSubmit={handleFormChange} />

      {/* BOTONES INFERIORES */}
      <div className="flex justify-end gap-3 border-t border-gray-400 p-3">
        <button
          onClick={onClose}
          className="px-4 py-1.5 text-sm border bg-gray-200 border-gray-800 rounded text-gray-700 hover:bg-gray-500 hover:text-white"
        >
          Cancelar
        </button>
        <button
          disabled={loading}
          onClick={handleSave}
          className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
}

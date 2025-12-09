import React, { useState } from "react";
import GlosaForm from "../components/Forms/GlosaForm";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useGlosas } from "../hooks/useGlosas";
import { useModal } from "../hooks/useModal";
import {X} from 'lucide-react'

export default function GlosaModal({ onClose, tramite }) {
  const { glosas, loading, addGlosa, updateGlosa, deleteGlosa } = useGlosas(tramite?.cod_tre);

  const [formMode, setFormMode] = useState(null);
  const [glosaToEdit, setGlosaToEdit] = useState(null);

  const { openModal } = useModal(); // Hook de contexto

  const handleFormSubmit = async (formData) => {
    if (formMode === "add") {
      await addGlosa(formData);
    } else if (glosaToEdit) {
      await updateGlosa(glosaToEdit.cod_glo, formData);
    }
    setFormMode(null);
  };

  const handleEdit = (glosa) => {
    setGlosaToEdit(glosa);
    setFormMode(glosa.cod_glo);
  };

  const handleDelete = (glosa) => {
    openModal(DeleteConfirmModal, {
      itemType: "glosa",
      itemData: {
        ...glosa,
        glosa: glosa.glo_glosa,
        titulo: glosa.glo_titulo,
        tramiteNombre: tramite.tre_nombre,
      },
      onConfirm: async () => await deleteGlosa(glosa.cod_glo),
    });
  };

  if (!tramite) return null;

  return (
    <div
      className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h2 className="text-xl font-semibold">Glosas de Trámite</h2>
        <X  className=" text-white hover:text-gray-200 cursor-pointer" onClick={onClose}/>
      </div>

      {/* Info del trámite */}
      <div className="p-4 bg-gray-50 text-center">
        <div className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md text-lg inline-block">
          Formulario para Editar Glosas
        </div>
        <div className="text-start text-md text-gray-600 p-1 mt-2">
          {`Trámite: ${tramite.tre_nombre} (${tramite.tre_tipo})`}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-6">
        {loading ? (
          <p className="text-center text-gray-500">Cargando glosas...</p>
        ) : formMode === null ? (
          <>
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-700">Lista de Glosas ({glosas.length})</h3>
              <button
                onClick={() => { setGlosaToEdit(null); setFormMode("add"); }}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow"
              >
                Nuevo +
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {glosas.length > 0 ? glosas.map((glosa) => (
                <div key={glosa.cod_glo} className="flex justify-between items-start p-3 border rounded-lg bg-gray-50 hover:bg-gray-100">
                  <div>
                    <p className="font-semibold text-gray-800">{glosa.glo_titulo}</p>
                    <div className="text-sm text-gray-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: glosa.glo_glosa }} />
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button onClick={() => handleEdit(glosa)} className="text-blue-600 hover:text-blue-800 p-2 rounded bg-white shadow">✏️</button>
                    <button onClick={() => handleDelete(glosa)} className="text-red-600 hover:text-red-800 p-2 rounded bg-white shadow">🗑️</button>
                  </div>
                </div>
              )) : (
                <p className="text-center py-4 text-gray-500">No hay glosas configuradas para este trámite.</p>
              )}
            </div>
          </>
        ) : (
          <>
            <button onClick={() => setFormMode(null)} className="text-sm text-blue-600 hover:text-blue-800 mb-4">&lt; Volver a la Lista</button>
            <GlosaForm initialData={glosaToEdit || {}} onSubmit={handleFormSubmit} isAdding={formMode === "add"} />
          </>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-100 p-4 flex justify-end space-x-3">
        <button onClick={onClose} className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-6 rounded-md">
          Cerrar
        </button>
      </div>
    </div>
  );
}

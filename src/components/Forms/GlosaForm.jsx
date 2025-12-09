import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function GlosaForm({ initialData = {}, onSubmit, isAdding }) {
  // Mapear datos iniciales del backend a nombres de campo del formulario
  const mapInitialData = (data) => ({
    titulo: data.glo_titulo || "",
    glosa: data.glo_glosa || "",
  });

  const [formData, setFormData] = useState(mapInitialData(initialData));

  // Reiniciar el formulario si cambian los datos iniciales
  useEffect(() => {
    setFormData(mapInitialData(initialData));
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditorChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      glosa: content,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
    >
      <h4 className="text-md font-semibold mb-4 text-gray-700">
        {isAdding ? "Nuevo Formulario de Glosa" : "Editar Glosa"}
      </h4>

      {/* Título */}
      <div className="mb-4">
        <label
          htmlFor="titulo"
          className="block text-gray-700 text-sm font-medium mb-1"
        >
          Título de Glosa:
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1"
          required
        />
      </div>

      {/* Cuerpo con TinyMCE */}
      <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">Cuerpo de Glosa (HTML):</label>
            <Editor
                // 🚨 ¡CLAVE PARA SELF-HOSTING! 
                tinymceScriptSrc="/tinymce/js/tinymce/tinymce.min.js"               
                init={{
                    
                    license_key: 'gpl',
                }}
                value={formData.glosa} 
                onEditorChange={handleEditorChange} 
            />
        </div>

      {/* Botón */}
      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
        >
          {isAdding ? "Guardar Glosa" : "Actualizar Glosa"}
        </button>
      </div>
    </form>
  );
}

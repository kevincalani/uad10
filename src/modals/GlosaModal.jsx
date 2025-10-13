
import React, { useState } from 'react';
import GlosaForm from './GlosaForm';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function GlosaModal({ isOpen, onClose, tramite, glosasData, setGlosasData }) {
  
  // Estado para controlar el formulario: null=listado, 'add'=nuevo, id=editar
  const [formMode, setFormMode] = useState(null); 
  const [glosaToEdit, setGlosaToEdit] = useState(null); // Datos de la glosa a editar
  const [glosaToDeleteId, setGlosaToDeleteId] = useState(null); // ID para confirmar eliminación
  const glosaToDelete = glosasData.find(g => g.id === glosaToDeleteId);
  

  if (!isOpen || !tramite) return null;
  
  // Filtramos las glosas que corresponden a este trámite
  const currentGlosas = glosasData.filter(g => g.tramiteId === tramite.id);

  // Handlers
  const handleEdit = (glosa) => {
    setGlosaToEdit(glosa);
    setFormMode(glosa.id); // Usamos el ID de la glosa como modo de edición
  };

  const handleNew = () => {
    setGlosaToEdit(null); // Limpiar datos previos
    setFormMode('add');
  };

  const handleFormSubmit = (formData) => {
    if (formMode === 'add') {
      // Lógica de Añadir
      const newId = Math.max(...glosasData.map(g => g.id), 0) + 1;
      const newGlosa = { ...formData, id: newId, tramiteId: tramite.id };
      setGlosasData(prev => [...prev, newGlosa]);
    } else {
      // Lógica de Edición
      setGlosasData(prev => prev.map(g => g.id === glosaToEdit.id ? { ...glosaToEdit, ...formData } : g));
    }
    setFormMode(null); // Volver al modo lista
  };

  const handleDeleteConfirm = () => {
    setGlosasData(prev => prev.filter(g => g.id !== glosaToDeleteId));
    setGlosaToDeleteId(null); // Cerrar el modal de confirmación
  };
  
  // Función para manejar el clic fuera
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-gray-500/50 bg-opacity-50 flex justify-center items-center z-50 p-4"
        onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
           onClick={e => e.stopPropagation()}> 
        
        {/* Header del Modal */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-semibold">Glosas de Trámite</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* 1. Titulo de la página */}
        <div className="p-4 bg-gray-50 text-center">
            <div className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md text-lg inline-block">
                Formulario para Editar Glosas
            </div>
            <div className="text-start text-md text-gray-600 p-1 mt-1 ">{`Trámite: ${tramite.nombre} (${tramite.tipo})`}</div>
        </div>

        {/* Contenido Principal: Lista vs Formulario */}
        <div className="p-6">
            
            {/* Si NO estamos en modo formulario, mostramos la lista y el botón Nuevo */}
            {formMode === null && (
                <>
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h3 className="text-lg font-semibold text-gray-700">Lista de Modelos de Glosas ({currentGlosas.length})</h3>
                        {/* 4. Botón Nuevo */}
                        <button 
                            onClick={handleNew} 
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 shadow"
                        >
                            Nuevo +
                        </button>
                    </div>

                    {/* 3. Lista de Modelos */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {currentGlosas.length > 0 ? (
                            currentGlosas.map((glosa) => (
                                <div key={glosa.id} className="flex justify-between items-start p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                                    <div>
                                        <p className="font-semibold text-gray-800">{glosa.titulo}</p>
                                        <p className="text-sm text-gray-500 line-clamp-2">{glosa.cuerpo}</p>
                                        {glosa.interno && <span className="text-xs text-indigo-600 font-medium"> (Interna)</span>}
                                    </div>
                                    <div className="flex space-x-2 ml-4 flex-shrink-0">
                                        {/* 6. Botón Editar Glosa */}
                                        <button 
                                            onClick={() => handleEdit(glosa)}
                                            className="text-blue-600 hover:text-blue-800 p-2 rounded bg-white shadow"
                                            title="Editar Glosa"
                                        >
                                            ✏️
                                        </button>
                                        {/* 5. Botón Eliminar Glosa */}
                                        <button 
                                            onClick={() => setGlosaToDeleteId(glosa.id)}
                                            className="text-red-600 hover:text-red-800 p-2 rounded bg-white shadow"
                                            title="Eliminar Glosa"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center py-4 text-gray-500">No hay glosas configuradas para este trámite.</p>
                        )}
                    </div>
                </>
            )}

            {/* Si estamos en modo formulario (Añadir o Editar), mostramos el formulario */}
            {(formMode === 'add' || formMode === glosaToEdit?.id) && (
                <div>
                    {/* Botón para volver a la lista */}
                    <button 
                        onClick={() => setFormMode(null)} 
                        className="text-sm text-blue-600 hover:text-blue-800 mb-4"
                    >
                        &lt; Volver a la Lista
                    </button>
                    {/* 4. y 6. Formulario de Glosa */}
                    <GlosaForm 
                        initialData={glosaToEdit || {}}
                        onSubmit={handleFormSubmit}
                        isAdding={formMode === 'add'}
                    />
                </div>
            )}
        </div>

        {/* Footer del Modal (Sin cambios) */}
        <div className="bg-gray-100 p-4 rounded-b-lg flex justify-end space-x-3">
             <button onClick={onClose} className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-6 rounded-md transition duration-200">
                Cerrar
             </button>
        </div>

      </div>

      {/* 5. Modal de Confirmación de Eliminación (Anidado) */}
      <DeleteConfirmModal 
          isOpen={glosaToDeleteId !== null}
          onClose={() => setGlosaToDeleteId(null)}
          onConfirm={handleDeleteConfirm}
          itemType="glosa" 
          // 🚨 Pasar los datos de la glosa, incluyendo el nombre del trámite asociado
          itemData={glosaToDelete ? {...glosaToDelete, tramiteNombre: tramite.nombre} : null}
          isProtected={false} // La eliminación de glosas no está protegida
        />
      
    </div>
  );
}
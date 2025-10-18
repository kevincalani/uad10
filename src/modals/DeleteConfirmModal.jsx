// src/components/Modals/DeleteConfirmModal.jsx
import React from 'react';

export default function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemType, // 'tramite' o 'glosa'
  itemData, // Objeto con los datos del ítem a eliminar
  isProtected = false // Determina si la eliminación está restringida
}) {
    if (!isOpen || !itemData) return null;
    const title = `Eliminar ${itemType === 'tramite' ? 'Trámite' : 'Glosa'}`;
    const question = `¿Está seguro de eliminar ${itemType === 'tramite' ? 'el trámite' : 'la glosa'}?`;
    
// 1. Contenido de la Información Dinámica
    const itemDetails = itemType === 'tramite' ? (
        <>
            <p className="text-sm text-gray-700"><strong>Nombre:</strong> {itemData.nombre}</p>
            <p className="text-sm text-gray-700"><strong>Costo:</strong> {itemData.costo || 'N/A'}</p>
            <p className="text-sm text-gray-700"><strong>Descripción:</strong> {itemData.descripcion || 'N/A'}</p>
        </>
    ) : (
        <>
            <p className="text-sm text-gray-700"><strong>Título de Glosa:</strong> {itemData.titulo}</p>
            {/* Se espera que itemData.tramiteNombre venga del padre */}
            <p className="text-sm text-gray-700"><strong>Trámite Asociado:</strong> {itemData.tramiteNombre || 'Desconocido'}</p>
            {/* Usamos dangerouslySetInnerHTML para renderizar el HTML del cuerpo de la glosa */}
            <p className="text-sm text-gray-700"><strong>Glosa (Cuerpo):</strong> <span dangerouslySetInnerHTML={{ __html: itemData.cuerpo || 'N/A' }} /></p>
        </>
    );

    // 2. Mensaje de restricción para el caso "protegido"
    const protectionMessage = "Este trámite no se puede eliminar porque está asociado a trámites, reportes, o documentos. Si desea inhabilitarlo, presione el botón (✅/❌) en la columna de Opciones.";

    // Lógica para deshabilitar la acción de eliminación
    const actionDisabled = isProtected;
    

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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-0 overflow-hidden">
                
                {/* 1. Header */}
                <div className="bg-red-600 text-white p-4 flex justify-between items-center">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Cuerpo del Modal */}
                <div className="p-6">
                    
                    {/* 2. Subtítulo/Pregunta o Título de Restricción */}
                    {actionDisabled ? (
                        <h4 className="text-lg font-semibold mb-4 text-red-600">¡Acción Restringida!</h4>
                    ) : (
                        <h4 className="text-lg font-semibold mb-4 text-gray-700">{question}</h4>
                    )}

                    {/* 3. Contenido de la Información */}
                    <div className="border border-gray-200 p-4 rounded-md bg-gray-50 mb-4 space-y-1">
                        {itemDetails}
                    </div>

                    {/* 4. Mensaje de Advertencia o Mensaje de Protección */}
                    <div className="space-y-3">
                        {actionDisabled ? (
                            // Mensaje de protección (azul)
                            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                                <p className="text-sm font-medium">{protectionMessage}</p>
                            </div>
                        ) : (
                            // Advertencia estándar (rojo)
                            <p className="text-sm font-medium text-red-600">
                                * Esta acción se quedará registrada en el sistema.
                            </p>
                        )}
                    </div>
                </div>

                {/* 5. Pie de Página con Botones */}
                <div className="bg-gray-100 p-4 flex justify-end space-x-3">
                    
                    {/* Botón Cancelar */}
                    <button 
                        onClick={onClose} 
                        className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-md transition duration-200 shadow-sm font-medium"
                    >
                        Cancelar
                    </button>
                    
                    {/* Botón Aceptar (Deshabilitado si está protegido) */}
                    <button 
                        onClick={() => { 
                            if (!actionDisabled) { 
                                onConfirm(); 
                            } 
                            onClose(); 
                        }} 
                        disabled={actionDisabled}
                        className={`py-2 px-4 rounded-md transition duration-200 shadow-sm font-medium 
                            ${actionDisabled 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-red-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
}
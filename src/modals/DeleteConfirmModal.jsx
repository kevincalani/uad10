import React from 'react';
import {X} from 'lucide-react'

export default function DeleteConfirmModal({
  onClose,
  onConfirm,
  itemType, // 'tramite' o 'glosa'
  itemData, // Objeto con los datos del ítem a eliminar
  isProtected = false // Determina si la eliminación está restringida
}) {
  if (!itemData) return null;

  const title = `Eliminar ${itemType === 'tramite' ? 'Trámite' : 'Glosa'}`;
  const question = `¿Está seguro de eliminar ${itemType === 'tramite' ? 'el trámite' : 'la glosa'}?`;

  // Contenido dinámico optimizado
  const itemDetails = itemType === 'tramite' ? (
    <>
      <p className="text-sm text-gray-700"><strong>Nombre:</strong> {itemData.tre_nombre}</p>
      <p className="text-sm text-gray-700"><strong>Costo:</strong> {itemData.tre_costo || 'N/A'}</p>
      <p className="text-sm text-gray-700"><strong>Descripción:</strong> {itemData.tre_desc || 'N/A'}</p>
    </>
  ) : (
    <>
      <p className="text-sm text-gray-700"><strong>Título de Glosa:</strong> {itemData.titulo}</p>
      <p className="text-sm text-gray-700"><strong>Trámite Asociado:</strong> {itemData.tramiteNombre || 'Desconocido'}</p>
      <div className="flex space-x-2 text-sm text-gray-700">
        <span><strong>Glosa:</strong></span>
        <span className="flex-1" dangerouslySetInnerHTML={{ __html: itemData.glosa || 'N/A' }} />
    </div>  
    </>
  );

  const protectionMessage =
  itemType === "tramite"
    ? "No se puede eliminar el trámite porque tiene glosas registradas. Si desea inhabilitarlo, presione el botón (✅/❌) en la columna de Opciones."
    : "Esta glosa no se puede eliminar por restricciones del sistema.";
const actionDisabled = isProtected;

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-0 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="bg-red-600 text-white p-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold">{title}</h3>
        <X onClick={onClose} className="text-white hover:text-gray-200 cursor-pointer"/>
      </div>

      {/* Body */}
      <div className="p-6">
        {actionDisabled ? (
          <h4 className="text-lg font-semibold mb-4 text-red-600">¡Acción Restringida!</h4>
        ) : (
          <h4 className="text-lg font-semibold mb-4 text-gray-700">{question}</h4>
        )}

        <div className="border border-gray-200 p-6 rounded-md bg-red-100 mb-4 space-y-1">
          {itemDetails}
        </div>

        <div className="space-y-3">
          {actionDisabled ? (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
              <p className="text-sm font-medium">{protectionMessage}</p>
            </div>
          ) : (
            <p className="text-sm font-medium text-red-600 border border-red-600 rounded-lg p-1">
              * Esta acción se quedará registrada en el sistema.
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 p-4 flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-md shadow-sm font-medium"
        >
          Cancelar
        </button>
        <button
          onClick={() => {
            if (!actionDisabled) onConfirm();
            onClose();
          }}
          disabled={actionDisabled}
          className={`py-2 px-4 rounded-md shadow-sm font-medium transition duration-200 
            ${actionDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-blue-700 text-white'}`}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}

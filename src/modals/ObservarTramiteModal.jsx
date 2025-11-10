import React, { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';

export default function ObservarTramiteModal({
    isOpen,
    onClose,
    tramiteData,
    onSave,
}) {
    // Si tramiteData existe, es un documento:
    const initialObservacion = tramiteData?.observacion || '';
    const initialBloquear = tramiteData?.isBlocked || false;

    const [observacion, setObservacion] = useState(initialObservacion);
    const [bloquear, setBloquear] = useState(initialBloquear);

    // Sincronizar estados locales cuando el modal se abre con nuevos datos
    useEffect(() => {
        if (isOpen && tramiteData) {
            setObservacion(tramiteData.observacion || '');
            setBloquear(tramiteData.isBlocked || false);
        }
    }, [isOpen, tramiteData]);

    if (!isOpen || !tramiteData) return null;

    // Handler para prevenir el cierre al hacer clic fuera del contenido (opcional, pero buena práctica)
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    };
    
    // Handler de guardado
    const handleGuardar = () => {
        // 1. Validar la observación si se va a bloquear (Opcional: forzar observación si se bloquea)
        // Por ahora, solo se guarda lo que se ingresa.
        
        // 2. Llamar a la función onSave del componente padre con los datos.
        // El componente padre (EditLegalizacionModal.jsx) es responsable de actualizar 
        // el estado consolidado del documento y del trámite.
        onSave({ 
            observacion: observacion.trim(), 
            bloquear: bloquear 
        });
        
        // onSave ya llama a onClose en el diseño previo, 
        // pero por si acaso, lo dejamos a discreción del padre para manejar la UX
    };
    
    // El texto del trámite que se muestra en el modal
    const tramiteDisplay = tramiteData.nombre || 'Trámite Desconocido';

    return (
        <div 
            className="fixed inset-0 bg-gray-500/50 bg-opacity-70 flex justify-center items-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4/6">
                
                {/* 1. Header (Rojo) */}
                <div className="flex justify-between items-center bg-red-600 text-white p-3 rounded-t-lg">
                    <h2 className="text-xl font-bold flex items-center">
                        <Eye className="w-6 h-6 mr-2" />
                        Observar
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                {/* 2. Título del Formulario */}
                <div className="p-4 border-b border-gray-400">
                    <div className="bg-red-100 text-gray-700 p-2 rounded text-center font-medium">
                        Formulario de registro de observaciones
                    </div>
                </div>

                {/* 3. Datos del Formulario */}
                <div className="p-6 space-y-4 text-sm">
                    
                    {/* Estructura del campo Trámite */}
                    {/* Usamos flex para alinear el label y el valor */}
                    <div className="flex items-center">
                        {/* Label: Alineado a la derecha, ancho fijo para alineación vertical */}
                        <label className="block text-red-700 font-semibold whitespace-nowrap text-right mr-3 w-32">
                            Trámite :
                        </label>
                        {/* Contenido: Toma el espacio restante */}
                        <span className="font-normal text-gray-700 flex-grow">
                            {tramiteDisplay}
                        </span>
                    </div>

                    {/* Estructura del campo Observación */}
                    <div className="flex items-start">
                        {/* Label: Alineado a la derecha, ancho fijo para alineación vertical */}
                        <label className="block text-red-700 font-semibold whitespace-nowrap text-right mr-3 pt-1 w-32">
                            Observación :
                        </label>
                        {/* Textarea: Toma el espacio restante */}
                        <textarea
                            value={observacion}
                            onChange={(e) => setObservacion(e.target.value)}
                            rows="4"
                            className="w-32 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm flex-grow"
                        ></textarea>
                    </div>
                    
                    {/* Estructura del campo Bloquear */}
                    <div className="flex items-center pt-2">
                         {/* Label: Alineado a la derecha, ancho fijo para alineación vertical */}
                        <label className="block text-red-700 font-semibold whitespace-nowrap text-right mr-3 w-32">
                            Bloquear :
                        </label>
                        {/* Checkbox */}
                        <input
                            type="checkbox"
                            checked={bloquear}
                            onChange={(e) => setBloquear(e.target.checked)}
                            className="w-4 h-4 text-red-600 border-gray-300 rounded"
                        />
                    </div>

                    {/* Mensaje de Advertencia (Rodeado de margen rojo bordeado) */}
                    <div className="border border-red-400 bg-red-50 p-3 text-xs text-red-800 rounded">
                        <p className="font-medium">* Esta acción se quedará registrado en el sistema</p>
                        <p className="font-medium">* Si bloquea el trámite, ya no se podra modificar su estado</p>
                    </div>

                </div>

                {/* 4. Botones de Acción */}
                <div className="p-4 border-t border-gray-400 flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
                    <button 
                        onClick={onClose}
                        className="bg-gray-500 text-white py-2 px-4 rounded font-medium hover:bg-gray-600 transition"
                    >
                        Cerrar
                    </button>
                    <button 
                        onClick={handleGuardar}
                        className="bg-red-600 text-white py-2 px-4 rounded font-medium hover:bg-red-700 transition"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
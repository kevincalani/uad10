import React, { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';
import { useModal } from '../hooks/useModal';

export default function ObservarTramiteModal({ tramiteData, onSave }) {
    const { closeModal } = useModal();

    if (!tramiteData) return null;

    const [observacion, setObservacion] = useState(tramiteData.observacion || '');
    const [bloquear, setBloquear] = useState(tramiteData.isBlocked || false);

    // Sincronizar estados locales si cambia tramiteData
    useEffect(() => {
        setObservacion(tramiteData.observacion || '');
        setBloquear(tramiteData.isBlocked || false);
    }, [tramiteData]);

    const handleGuardar = () => {
        onSave({ observacion: observacion.trim(), bloquear });
        closeModal(); // Cerramos el modal usando el hook
    };

    const tramiteDisplay = tramiteData.nombre || 'Trámite Desconocido';

    return (
        <div className="bg-black/40 fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
                
                {/* Header */}
                <div className="flex justify-between items-center bg-red-600 text-white p-3 rounded-t-lg">
                    <h2 className="text-xl font-bold flex items-center">
                        <Eye className="w-6 h-6 mr-2" /> Observar
                    </h2>
                    <button onClick={closeModal} className="text-white hover:text-gray-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Título */}
                <div className="p-4 border-b border-gray-400">
                    <div className="bg-red-100 text-gray-700 p-2 rounded text-center font-medium">
                        Formulario de registro de observaciones
                    </div>
                </div>

                {/* Formulario */}
                <div className="p-6 space-y-4 text-sm">

                    {/* Trámite */}
                    <div className="flex items-center">
                        <label className="block text-red-700 font-semibold w-32 mr-3 text-right">
                            Trámite:
                        </label>
                        <span className="flex-grow font-normal text-gray-700">{tramiteDisplay}</span>
                    </div>

                    {/* Observación */}
                    <div className="flex items-start">
                        <label className="block text-red-700 font-semibold w-32 mr-3 pt-1 text-right">
                            Observación:
                        </label>
                        <textarea
                            value={observacion}
                            onChange={(e) => setObservacion(e.target.value)}
                            rows="4"
                            className="flex-grow w-32 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>

                    {/* Bloquear */}
                    <div className="flex items-center pt-2">
                        <label className="block text-red-700 font-semibold w-32 mr-3 text-right">
                            Bloquear:
                        </label>
                        <input
                            type="checkbox"
                            checked={bloquear}
                            onChange={(e) => setBloquear(e.target.checked)}
                            className="w-4 h-4 text-red-600 border-gray-300 rounded"
                        />
                    </div>

                    {/* Advertencias */}
                    <div className="border border-red-400 bg-red-50 p-3 text-xs text-red-800 rounded">
                        <p className="font-medium">* Esta acción quedará registrada en el sistema</p>
                        <p className="font-medium">* Si bloquea el trámite, ya no se podrá modificar su estado</p>
                    </div>

                </div>

                {/* Botones */}
                <div className="p-4 border-t border-gray-400 flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
                    <button 
                        onClick={closeModal}
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

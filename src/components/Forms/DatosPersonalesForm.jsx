import React from 'react';
import LabeledInput from '../LabeledInput';
import { CheckCircle } from 'lucide-react'; // Asumo que esto se usa para el mensaje de GUARDADO

/**
 * Muestra y edita los datos personales del titular del trámite.
 */
export default function DatosPersonalesForm({ 
    tramiteData, 
    datosPersonales, 
    handleCiChange, 
    handleDatosPersonalesChange,
    handleDatosPersonalesSubmit,
    isDatosPersonalesSaved
}) {
    
    // Función interna que previene el refresco antes de llamar al handler del padre.
    const handleSubmit = (event) => {
        // 🛑 CLAVE: Previene el refresco de la página causado por el submit del formulario.
        event.preventDefault(); 
        
        // Llama a la lógica de guardado proporcionada por el componente padre.
        handleDatosPersonalesSubmit(event); 
    };
    
    const cardDate = new Date(tramiteData.fechaSolicitud).toLocaleDateString('es-ES', { 
        day: '2-digit', month: '2-digit', year: 'numeric' 
    });

    return (
        <div className="border border-gray-200 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                Datos Personales
                {isDatosPersonalesSaved && <span className="ml-2 text-xs font-bold text-green-600">(GUARDADO)</span>}
            </h3>
            
            <div className="h-20 w-20 flex flex-col mb-3 text-center mx-auto border border-gray-200 rounded-lg shadow-sm">
                <p className="text-4xl font-extrabold text-red-600 mb-1">{tramiteData.numero}</p>
                <p className="text-sm text-gray-600"> {cardDate}</p>
            </div>
            
            {/* Usamos el handler corregido 'handleSubmit' */}
            <form className="space-y-3 pb-3" onSubmit={handleSubmit}>
                <LabeledInput 
                    label="CI:" 
                    name="ci" 
                    value={datosPersonales.ci} 
                    onChange={handleCiChange} 
                    required
                    disabled={isDatosPersonalesSaved}
                />
                <LabeledInput 
                    label="Pasaporte:" 
                    name="pasaporte" 
                    value={datosPersonales.pasaporte} 
                    onChange={handleDatosPersonalesChange} 
                    disabled={isDatosPersonalesSaved}
                />
                <LabeledInput 
                    label="Apellidos:" 
                    name="apellidos" 
                    value={datosPersonales.apellidos} 
                    onChange={handleDatosPersonalesChange} 
                    required
                    disabled={isDatosPersonalesSaved}
                />
                <LabeledInput 
                    label="Nombres:" 
                    name="nombres" 
                    value={datosPersonales.nombres} 
                    onChange={handleDatosPersonalesChange} 
                    required
                    disabled={isDatosPersonalesSaved}
                />

                {/* Ocultar botón si ya fue guardado */}
                {!isDatosPersonalesSaved && (
                    <div className="flex justify-end pt-2">
                        <button type="submit" className="bg-green-500 text-white py-1 px-4 text-sm rounded font-medium hover:bg-green-600 transition">Guardar</button>
                    </div>
                )}
            </form>
        </div>
    );
}

// Nota: LabeledInput no necesita modificaciones para esta corrección.
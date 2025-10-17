import React from 'react';
import LabeledInput from '../Common/LabeledInput';

/**
 * Muestra y edita los datos personales del titular del trámite.
 */
export default function DatosPersonalesForm({ tramiteData, datosPersonales, handleCiChange, handleDatosPersonalesChange }) {
    
    const cardDate = new Date(tramiteData.fechaSolicitud).toLocaleDateString('es-ES', { 
        day: '2-digit', month: '2-digit', year: 'numeric' 
    });

    return (
        <div className="border border-gray-200 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Datos Personales</h3>
            
            <div className="h-20 w-20 flex flex-col mb-3 text-center mx-auto border border-gray-200 rounded-lg shadow-sm">
                <p className="text-4xl font-extrabold text-red-600">{tramiteData.numero}</p>
                <p className="text-sm text-gray-600">Nro. Trámite / Fecha: {cardDate}</p>
            </div>
            
            <form className="space-y-3 pb-3">
                <LabeledInput 
                    label="CI:" 
                    name="ci" 
                    value={datosPersonales.ci} 
                    onChange={handleCiChange} 
                />
                <LabeledInput 
                    label="Pasaporte:" 
                    name="pasaporte" 
                    value={datosPersonales.pasaporte} 
                    onChange={handleDatosPersonalesChange} 
                />
                <LabeledInput 
                    label="Apellidos:" 
                    name="apellidos" 
                    value={datosPersonales.apellidos} 
                    onChange={handleDatosPersonalesChange} 
                />
                <LabeledInput 
                    label="Nombres:" 
                    name="nombres" 
                    value={datosPersonales.nombres} 
                    onChange={handleDatosPersonalesChange} 
                />

                <div className="flex justify-end pt-2">
                    <button type="submit" className="bg-green-500 text-white py-1 px-4 text-sm rounded font-medium hover:bg-green-600 transition">Guardar</button>
                </div>
            </form>
        </div>
    );
}
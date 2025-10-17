import React from 'react';
import { X } from 'lucide-react';
import LabeledInput from '../Common/LabeledInput';

/**
 * Muestra y edita los datos del apoderado.
 */
export default function DatosApoderadoForm({
    isApoderadoFormVisible,
    setIsApoderadoFormVisible,
    datosApoderado,
    handleApoderadoCiChange,
    handleDatosApoderadoChange
}) {
    return (
        <div className="border border-gray-200 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Datos del Apoderado</h3>
            
            {!isApoderadoFormVisible ? (
                <div className="flex justify-end">
                    <button 
                        onClick={() => setIsApoderadoFormVisible(true)}
                        className="bg-blue-500 text-white py-1 px-4 text-sm rounded font-medium hover:bg-blue-600 transition"
                    >
                        Editar Datos
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h4 className="font-semibold text-gray-700">Editar Datos del Apoderado</h4>
                        <button onClick={() => setIsApoderadoFormVisible(false)} className="text-red-500 hover:text-red-700">
                            <X size={18} />
                        </button>
                    </div>
                    
                    {/* Formulario de Apoderado */}
                    <form className="space-y-3 text-sm pb-3">
                        <LabeledInput label="CI:" name="ci" value={datosApoderado.ci} onChange={handleApoderadoCiChange} />
                        <LabeledInput label="Apellidos:" name="apellidos" value={datosApoderado.apellidos} onChange={handleDatosApoderadoChange} />
                        <LabeledInput label="Nombres:" name="nombres" value={datosApoderado.nombres} onChange={handleDatosApoderadoChange} />
                        
                        {/* Radio buttons para Tipo Apoderado */}
                        <div className="flex text-sm">
                            <label className="text-gray-600 font-medium whitespace-nowrap text-right mr-2 flex-shrink-0 w-24">Tipo Apoderado:</label>
                            
                            <div className="flex flex-col space-y-1">
                                {/* Opción 1: Declaración Jurada */}
                                <label className="flex items-center space-x-1">
                                    <input 
                                        type="radio" 
                                        name="tipoApoderado"
                                        value="Declaracion Jurada"
                                        checked={datosApoderado.tipoApoderado === 'Declaracion Jurada'}
                                        onChange={handleDatosApoderadoChange}
                                    />
                                    <span>Declaración Jurada</span>
                                </label>
                                
                                {/* Opción 2: Poder Notariado */}
                                <label className="flex items-center space-x-1">
                                    <input 
                                        type="radio" 
                                        name="tipoApoderado"
                                        value="Poder Notariado"
                                        checked={datosApoderado.tipoApoderado === 'Poder Notariado'}
                                        onChange={handleDatosApoderadoChange}
                                    />
                                    <span>Poder Notariado</span>
                                </label>
                            </div>
                        </div>
                        
                        <div className="flex justify-end pt-2">
                            <button type="submit" className="bg-green-500 text-white py-1 px-4 text-sm rounded font-medium hover:bg-green-600 transition">Guardar</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
import React from "react";
import { X } from "lucide-react";
import LabeledInput from "../LabeledInput";

/**
 * Formulario de edición del apoderado.
 * Totalmente integrado al backend.
 */
export default function DatosApoderadoForm({
    isVisible,
    setIsVisible,
    datosApoderado,
    setDatosApoderado,
    onSave
}) {
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatosApoderado((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(); // Llama al modal que ejecuta POST /guardar-apoderado
    };

    return (
        <div className="border border-gray-200 p-4 rounded-lg shadow-sm">
        
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                Datos del Apoderado
            </h3>

            {/* Si NO está visible → solo botón "Editar" */}
            {!isVisible ? (
                <div className="flex justify-end">
                    <button
                        onClick={() => setIsVisible(true)}
                        className="bg-blue-500 text-white py-1 px-4 text-sm rounded font-medium hover:bg-blue-600 transition"
                    >
                        Editar Datos
                    </button>
                </div>
            ) : (
                <div className="space-y-3">

                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h4 className="font-semibold text-gray-700">Editar Datos del Apoderado</h4>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* FORMULARIO */}
                    <form className="space-y-3 text-sm pb-3" onSubmit={handleSubmit}>
                        
                        <LabeledInput
                            label="CI:"
                            name="ci"
                            value={datosApoderado.ci}
                            onChange={handleChange}
                        />

                        <LabeledInput
                            label="Apellidos:"
                            name="apellidos"
                            value={datosApoderado.apellidos}
                            onChange={handleChange}
                        />

                        <LabeledInput
                            label="Nombres:"
                            name="nombres"
                            value={datosApoderado.nombres}
                            onChange={handleChange}
                        />

                        {/* Tipo Apoderado */}
                        <div className="flex text-sm">
                            <label className="text-gray-600 font-medium whitespace-nowrap text-right mr-2 flex-shrink-0 w-24">
                                Tipo Apoderado:
                            </label>

                            <div className="flex flex-col space-y-1">

                                <label className="flex items-center space-x-1">
                                    <input
                                        type="radio"
                                        name="tipoApoderado"
                                        value="Declaracion Jurada"
                                        checked={datosApoderado.tipoApoderado === "Declaracion Jurada"}
                                        onChange={handleChange}
                                    />
                                    <span>Declaración Jurada</span>
                                </label>

                                <label className="flex items-center space-x-1">
                                    <input
                                        type="radio"
                                        name="tipoApoderado"
                                        value="Poder Notariado"
                                        checked={datosApoderado.tipoApoderado === "Poder Notariado"}
                                        onChange={handleChange}
                                    />
                                    <span>Poder Notariado</span>
                                </label>

                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                className="bg-green-500 text-white py-1 px-4 text-sm rounded font-medium hover:bg-green-600 transition"
                            >
                                Guardar
                            </button>
                        </div>

                    </form>
                </div>
            )}
        </div>
    );
}

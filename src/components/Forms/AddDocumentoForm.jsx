import React from 'react';
import { X } from 'lucide-react';
import { TIPOS_LEGALIZACION } from '../../Constants/tramiteDatos';

/**
 * Formulario para añadir un nuevo documento (legalización),
 * enviándolo al backend mediante handleAddDocumento().
 */
export default function AddDocumentoForm({
    setIsAddDocumentoFormVisible,
    newDocForm,
    setNewDocForm,
    handleAddDocumento, // ahora envía al backend
}) {

    const handleNewDocChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewDocForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // Enviar al backend
    const handleSubmit = (e) => {
        e.preventDefault();

        const nroTituloFinal = `${newDocForm.nroTitulo1 || ''}/${newDocForm.nroTitulo2 || ''}`;

        // No enviamos FormData aquí: lo delegamos al padre
        handleAddDocumento({
            ...newDocForm,
            nroTitulo: nroTituloFinal,
            nombre: newDocForm.tipoLegalizacion
        });
    };

    return (
        <div className="mt-4 p-4 border border-blue-300 rounded-lg bg-blue-50 flex-shrink-0">
            <div className="flex justify-between items-center mb-3">
                <div className="flex-grow text-center">
                    <h4 className="font-semibold text-gray-700">Añadir Trámite</h4>
                </div>
                <button
                    onClick={() => setIsAddDocumentoFormVisible(false)}
                    className="text-red-500 hover:text-red-700 ml-auto"
                >
                    <X size={18} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2 text-sm">

                {/* Tipo de Legalización */}
                <div className="flex items-center">
                    <label className="text-gray-600 font-medium w-40">Tipo de Legalización:</label>
                    <select
                        name="tipoLegalizacion"
                        value={newDocForm.tipoLegalizacion}
                        onChange={handleNewDocChange}
                        className="p-1 border border-gray-300 rounded bg-white w-full"
                    >
                        {TIPOS_LEGALIZACION.map(tipo => (
                            <option key={tipo.value} value={tipo.value}>
                                {tipo.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tipo de Trámite */}
                <div className="flex items-center space-x-4">
                    <label className="text-gray-600 w-40">Tipo de Trámite:</label>

                    <label className="flex items-center space-x-1">
                        <input
                            type="radio"
                            name="tipoTramite"
                            value="EXTERNO"
                            checked={newDocForm.tipoTramite === "EXTERNO"}
                            onChange={handleNewDocChange}
                        />
                        <span>EXTERNO</span>
                    </label>

                    <label className="flex items-center space-x=1">
                        <input
                            type="radio"
                            name="tipoTramite"
                            value="INTERNO"
                            checked={newDocForm.tipoTramite === "INTERNO"}
                            onChange={handleNewDocChange}
                        />
                        <span>INTERNO</span>
                    </label>

                    <div className="h-5 w-px bg-red-500 mx-3"></div>

                    {/* PTAG */}
                    <label className="flex items-center space-x-1">
                        <input
                            type="checkbox"
                            name="isPtag"
                            checked={newDocForm.isPtag}
                            onChange={handleNewDocChange}
                        />
                        <span>PTAG</span>
                    </label>

                    {/* CUADIS */}
                    <label className="flex items-center space-x-1">
                        <input
                            type="checkbox"
                            name="isCuadis"
                            checked={newDocForm.isCuadis}
                            onChange={handleNewDocChange}
                        />
                        <span>CUADIS</span>
                    </label>
                </div>

                {/* Nro título */}
                <div className="flex items-center">
                    <label className="text-gray-600 w-40">Nro. Título/Res.:</label>

                    <input
                        type="text"
                        name="nroTitulo1"
                        value={newDocForm.nroTitulo1}
                        onChange={handleNewDocChange}
                        className="p-1 border rounded w-16 text-center"
                    />
                    <span className="font-bold mx-1">/</span>
                    <input
                        type="text"
                        name="nroTitulo2"
                        value={newDocForm.nroTitulo2}
                        onChange={handleNewDocChange}
                        className="p-1 border rounded w-16 text-center"
                    />

                    <label className="flex items-center space-x-1 ml-4">
                        <input
                            type="checkbox"
                            name="isTituloSupletorio"
                            checked={newDocForm.isTituloSupletorio}
                            onChange={handleNewDocChange}
                        />
                        <span>Título Supletorio</span>
                    </label>
                </div>

                {/* Control + Reintegro */}
                <div className="flex items-center space-x-4">
                    <label className="text-gray-600 w-40">Nro. Control:</label>
                    <input
                        type="text"
                        name="nroControl"
                        value={newDocForm.nroControl}
                        onChange={handleNewDocChange}
                        className="p-1 border rounded w-full"
                    />

                    <label className="text-gray-600 w-20">Reintegro:</label>
                    <input
                        type="text"
                        name="reintegro"
                        value={newDocForm.reintegro}
                        onChange={handleNewDocChange}
                        className="p-1 border rounded w-full"
                    />
                </div>

                {/* Nro Control Busqueda / Reimpresión */}
                <div className="flex items-center space-x-4">

                    <label className="text-gray-600 w-40">Nro Ctrl Búsqueda:</label>
                    <input
                        type="text"
                        name="nroControlBusqueda"
                        value={newDocForm.nroControlBusqueda}
                        onChange={handleNewDocChange}
                        className="p-1 border rounded w-full"
                    />

                    <label className="text-gray-600 w-40">Nro Ctrl Reimp.:</label>
                    <input
                        type="text"
                        name="nroControlReimpresion"
                        value={newDocForm.nroControlReimpresion}
                        onChange={handleNewDocChange}
                        className="p-1 border rounded w-full"
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                    >
                        + Crear
                    </button>
                </div>
            </form>
        </div>
    );
}

import React from 'react';
import { X } from 'lucide-react';
// Asumiendo que TIPOS_LEGALIZACION está aquí o en src/constants/tramiteDatos
import { TIPOS_LEGALIZACION } from '../../Constants/tramiteDatos'; 

/**
 * Formulario para añadir un nuevo documento al listado.
 */
export default function AddDocumentoForm({
    setIsAddDocumentoFormVisible,
    newDocForm,
    setNewDocForm,
    handleAddDocumento
}) {
    
    // Generic Change Handler for new document form (local logic)
    const handleNewDocChange = (e) => {
         const { name, value, type, checked } = e.target;
         setNewDocForm(prev => ({ 
             ...prev, 
             [name]: type === 'checkbox' ? checked : value    }));
     };

    // 🆕 Nuevo Handler para el Submit:
    const handleSubmit = (e) => {
        e.preventDefault(); // 🛑 CLAVE: Previene el envío del formulario nativo y la recarga de página
        
        // 1. Validar y preparar los datos (combinar nroTitulo1 y nroTitulo2)
        const finalDocData = {
            ...newDocForm,
            // Asumiendo que el campo 'nombre' se mapea desde el 'tipoLegalizacion' o debe definirse.
            // Aquí lo dejamos como 'nombre' (es la convención de tus datos de documento)
            nombre: newDocForm.tipoLegalizacion, // Usamos tipoLegalizacion como nombre
            nroTitulo: `${newDocForm.nroTitulo1 || ''}/${newDocForm.nroTitulo2 || ''}`,
            // También asumimos valores iniciales por defecto para campos no cubiertos en el form
            isObserved: false, 
            isBlocked: false,
            observacion: '',
            // Simulamos el campo de verificación SITRA
            sitraVerificado: true, // O false, dependiendo de tu lógica de negocio
        };
        
        // 2. Llamar al handler del componente padre
        handleAddDocumento(finalDocData); 
        
        // Opcional: Limpiar el formulario después de añadir
        setNewDocForm({
            tipoLegalizacion: TIPOS_LEGALIZACION[0].value, // Valor por defecto
            tipoTramite: 'EXTERNO',
            isPtag: false,
            isCuadis: false,
            nroTitulo1: '',
            nroTitulo2: '',
            isTituloSupletorio: false,
            nroControl: '',
            reintegro: '',
            nroControlBusqueda: '',
            nroControlReimpresion: '',
        });
    };
    
     return (
         <div className="mt-4 p-4 border border-blue-300 rounded-lg bg-blue-50 flex-shrink-0">
             <div className="flex justify-between items-center mb-3">
                 <div className="flex-grow text-center">
                     <h4 className="font-semibold text-gray-700">Añadir Trámite</h4>
                 </div>
                 <button onClick={() => setIsAddDocumentoFormVisible(false)} className="text-red-500 hover:text-red-700 ml-auto">
                     <X size={18} />
                 </button>
             </div>

             {/* 🛑 Actualizar onSubmit para usar el nuevo handler local */}
             <form onSubmit={handleSubmit} className="space-y-2 text-sm">

                 {/* Fila 1: Tipo de Legalización */}
                <div className="flex items-center">
                    <label className="text-gray-600 font-medium whitespace-nowrap text-right mr-2 flex-shrink-0 w-40">Tipo de Legalización:</label>
                    <select
                        name="tipoLegalizacion"
                        value={newDocForm.tipoLegalizacion}
                        onChange={handleNewDocChange}
                        className="p-1 border border-gray-300 rounded bg-white w-full"
                    >
                        {TIPOS_LEGALIZACION.map(tipo => (
                            <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                        ))}
                    </select>
                </div>
                    
                {/* Fila 2: Tipo de Trámite (Radio) y Checkboxes */}
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600 font-medium whitespace-nowrap text-right mr-2 flex-shrink-0 w-40">Tipo de Trámite:</span>
                    
                    <label className="flex items-center space-x-1">
                        <input 
                            type="radio" 
                            name="tipoTramite"
                            value="EXTERNO"
                            checked={newDocForm.tipoTramite === 'EXTERNO'}
                            onChange={handleNewDocChange}
                        />
                        <span>EXTERNO</span>
                    </label>
                    <label className="flex items-center space-x-1">
                        <input 
                            type="radio" 
                            name="tipoTramite"
                            value="INTERNO"
                            checked={newDocForm.tipoTramite === 'INTERNO'}
                            onChange={handleNewDocChange}
                        />
                        <span>INTERNO</span>
                    </label>

                    <div className="h-5 w-px bg-red-500 mx-3"></div>
                    
                    <label className="flex items-center space-x-1">
                        <input 
                            type="checkbox" 
                            name="isPtag"
                            checked={newDocForm.isPtag} 
                            onChange={handleNewDocChange} 
                        />
                        <span>PTAG</span>
                    </label>
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

                {/* Fila 3: Nro Título o Resolución y Supletorio */}
                <div className="flex items-center text-sm">
                    <label className="text-gray-600 font-medium whitespace-nowrap text-right mr-2 flex-shrink-0 w-40">Nro. Título/Res.:</label>
                    <input 
                        type="text" 
                        name="nroTitulo1"
                        value={newDocForm.nroTitulo1}
                        onChange={handleNewDocChange}
                        className="p-1 border border-gray-300 rounded w-16 text-center" 
                    />
                    <span className="font-bold mx-1">/</span>
                    <input 
                        type="text" 
                        name="nroTitulo2"
                        value={newDocForm.nroTitulo2}
                        onChange={handleNewDocChange}
                        className="p-1 border border-gray-300 rounded w-16 text-center" 
                    />
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">(ej. 1999)</span>
                    <label className="flex items-center space-x-1 ml-4">
                        <input 
                            type="checkbox" 
                            name="isTituloSupletorio"
                            checked={newDocForm.isTituloSupletorio} 
                            onChange={handleNewDocChange} 
                        />
                        <span className="whitespace-nowrap">Título Supletorio</span>
                    </label>
                </div>
                
                {/* Fila 4: Nro Control y Reintegro */}
                <div className="flex items-center space-x-4">
                    <label className="text-gray-600 font-medium whitespace-nowrap text-right mr-2 flex-shrink-0 w-40">Nro. Control:</label>
                    <input 
                        type="text" 
                        name="nroControl"
                        placeholder="" 
                        className="p-1 border border-gray-300 rounded w-full" 
                        value={newDocForm.nroControl} 
                        onChange={handleNewDocChange} 
                    />
                    
                    <label className="text-gray-600 font-medium whitespace-nowrap text-right mr-2 flex-shrink-0 w-20">Reintegro:</label>
                    <input 
                        type="text" 
                        name="reintegro"
                        placeholder="" 
                        className="p-1 border border-gray-300 rounded w-full"
                        value={newDocForm.reintegro} 
                        onChange={handleNewDocChange} 
                    />
                </div>

                {/* Fila 5: Nro control Busqueda y Nro control Reimpresion */}
                <div className="flex items-center space-x-4">
                    <label className="text-gray-600 font-medium whitespace-nowrap text-right mr-2 flex-shrink-0 w-40">Nro Control Busqueda:</label>
                    <input 
                        type="text" 
                        name="nroControlBusqueda"
                        placeholder="" 
                        className="p-1 border border-gray-300 rounded w-full"
                         value={newDocForm.nroControlBusqueda} 
                         onChange={handleNewDocChange} 
                    />

                    <label className="text-gray-600 font-medium whitespace-nowrap text-right mr-2 flex-shrink-0 w-40">Nro Control Reimpresión:</label>
                    <input 
                        type="text" 
                        name="nroControlReimpresion"
                        placeholder="" 
                        className="p-1 border border-gray-300 rounded w-full"
                         value={newDocForm.nroControlReimpresion} 
                         onChange={handleNewDocChange} 
                    />
                </div>
                 <div className="flex justify-end pt-2">
                     <button type="submit" className="bg-green-500 text-white py-1 px-4 text-sm rounded font-medium hover:bg-green-600 transition">
                         + Crear
                     </button>
                 </div>
             </form>
         </div>
    );
}
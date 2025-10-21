import React from 'react';
import { 
    X, CircleCheck, CircleMinus, Trash2, Eye, FilePenLine, FileCode 
} from 'lucide-react';
import AddDocumentoForm from '../components/Forms/AddDocumentoForm';

/**
 * Componente individual para la fila de Documentos del Trámite.
 */
const DocumentoRow = ({ doc, index, onToggleDestino, onDelete,onObserve }) => {
    
    const isObserved = doc.isObserved;
    const isBlocked = doc.isBlocked;
    
    const displayNombre = doc.tipoTramite === 'INTERNO' 
        ? <>{doc.nombre} <span className="text-red-600 font-semibold">(Int.)</span></>
        : doc.nombre;
    
    const currentYear = new Date().getFullYear();
    const numeroTramiteDisplay = `${doc.numeroBd}/${currentYear}`;

    // Estilo de la fila condicional (Fondo rojo si está bloqueado)
    const rowClassName = `
        hover:bg-gray-200 
        ${isBlocked ? 'bg-red-200 hover:bg-red-300' : 'bg-white'}
    `;
    const buttons = [
        // 1. Botón Cambiar Destino (SIEMPRE VISIBLE, sin importar el bloqueo)
        <button 
             key="destino"
             onClick={() => onToggleDestino(doc.id)}
             title="Cambiar Destino del Trámite"
             className={`font-bold px-1 rounded text-xs transition duration-150 
                ${doc.tipoTramite === 'EXTERNO' 
                 ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                 : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
        >
             {doc.tipoTramite === 'EXTERNO' ? 'EXT' : 'INT'}
        </button>,

        // 2. Botón Observar (SIEMPRE VISIBLE)
        <button 
            key="observar"
            onClick={() => onObserve(doc)} 
            title={isBlocked ? "Bloqueado" : isObserved ? "Observado" : "Observar"} 
            className={`hover:text-red-800 ${isObserved ? 'text-red-600' : 'text-gray-500'}`}
        >
             <Eye size={16} />
        </button>,

        // 3. Botón Generar Glosa (Oculto si está bloqueado)
        !isBlocked && <button 
            key="glosa"
            title="Generar Glosa (Modal)" 
            className="text-gray-500 hover:text-gray-700"
        >
            <FilePenLine size={16} />
        </button>,
        
        // 4. Botón Ver Documento PDF (Oculto si está bloqueado)
        !isBlocked && <button 
            key="pdf"
            title="Ver Documento PDF (Modal)"
            className="text-blue-600 hover:text-blue-800"
        >
            <FileCode size={16} />
        </button>,
        
        // 5. Botón Eliminar Trámite (Oculto si está bloqueado)
        !isBlocked && <button 
            key="eliminar"
            onClick={() => onDelete(doc.id)} 
            title="Eliminar Trámite" 
            className="text-red-600 hover:text-red-800"
        >
            <Trash2 size={16} />
        </button>
    ].filter(Boolean); // Filtrar elementos nulos (los que se ocultan por isBlocked)

    return (
        <tr className={rowClassName}>
            <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900">{index + 1}</td>
            <td className="px-2 py-1 whitespace-nowrap text-xs">
                {doc.sitraVerificado ? (
                    <CircleCheck size={16} className="text-green-500" title="Verificado SITRA" />
                ) : (
                    <CircleMinus size={16} className="text-red-500" title="No Verificado SITRA" />
                )}
            </td>
            <td className="px-2 py-1 text-xs text-gray-800 font-medium">{displayNombre}</td>
            <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-500">{numeroTramiteDisplay}</td>
            <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-500">{doc.nroTitulo}</td>
            
            <td className="px-2 py-1 whitespace-nowrap text-xs space-x-1">
                {buttons}
            </td>
        </tr>
    );
};

/**
 * Muestra la tabla de documentos y el formulario para añadir nuevos.
 */
export default function DocumentoTable({
    documentos, 
    isAddDocumentoFormVisible, 
    setIsAddDocumentoFormVisible, 
    newDocForm, 
    setNewDocForm, 
    handleToggleDestino, 
    handleDeleteDocumento,
    handleAddDocumento,
    isDatosPersonalesSaved,
    onObserve
}) {

    return (
        <div className="w-full lg:w-8/12">
            <div className="border border-gray-200 p-4 rounded-lg shadow-sm  flex flex-col">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Documentos del Trámite</h3>
                
                <div className="overflow-auto mb-4" style={{ flexGrow: 1, minHeight: '100px', maxHeight: '100%' }}>
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-sm ">
                        <thead className="bg-gray-300 sticky top-0">
                            <tr>
                                {['N°', 'Sitra', 'Nombre', 'Nro. Trámite', 'N° Título', 'Opciones'].map(header => (
                                    <th key={header} className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {documentos.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-gray-500 text-sm">No hay documentos añadidos.</td>
                                </tr>
                            ) : (
                                documentos.map((doc, index) => (
                                    <DocumentoRow 
                                        key={doc.id}
                                        doc={doc}
                                        index={index}
                                        onToggleDestino={handleToggleDestino}
                                        onDelete={handleDeleteDocumento}
                                        onObserve={onObserve}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* 2. Mensaje si Datos Personales NO están guardados */}
                {!isDatosPersonalesSaved && (
                    <div className="p-2 bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm rounded text-center">
                        Debe guardar los **Datos Personales** antes de añadir trámites.
                    </div>
                )}
                
                {/* 2. Contenido de Añadir Trámite VISIBLE si Datos Personales están guardados */}
                {isDatosPersonalesSaved && (
                    <>
                        {/* Botón Añadir Trámite */}
                        {!isAddDocumentoFormVisible && (
                            <div className="flex justify-end mt-2 flex-shrink-0">
                                <button 
                                    onClick={() => setIsAddDocumentoFormVisible(true)}
                                    className="bg-blue-600 text-white py-1 px-4 text-sm rounded font-medium hover:bg-blue-700 transition"
                                >
                                    + Trámite
                                </button>
                            </div>
                        )}

                        {/* Formulario para Añadir Trámite (Oculto/Visible) */}
                        {isAddDocumentoFormVisible && (
                            <AddDocumentoForm
                                setIsAddDocumentoFormVisible={setIsAddDocumentoFormVisible}
                                newDocForm={newDocForm}
                                setNewDocForm={setNewDocForm}
                                handleAddDocumento={handleAddDocumento}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
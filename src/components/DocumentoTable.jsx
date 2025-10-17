import React from 'react';
import { 
    X, CircleCheck, CircleMinus, Trash2, Eye, FilePenLine, FileCode 
} from 'lucide-react';
import AddDocumentoForm from '../Forms/AddDocumentoForm';
import { TIPOS_LEGALIZACION } from '../Constants/tramiteDatos';

// ************************************************************
// ***** DocumentoRow (Componente de Fila) *****
// ************************************************************

/**
 * Componente individual para la fila de Documentos del Trámite.
 */
const DocumentoRow = ({ doc, index, onToggleDestino, onDelete }) => {
    
    const displayNombre = doc.tipoTramite === 'INTERNO' 
        ? <span className="text-red-600 font-semibold">{doc.nombre} (Int.)</span>
        : doc.nombre;
    
    const currentYear = new Date().getFullYear();
    const numeroTramiteDisplay = `${doc.numeroBd}/${currentYear}`;

    return (
        <tr className="hover:bg-gray-50">
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
                <button 
                    onClick={() => onToggleDestino(doc.id)}
                    title="Cambiar Destino del Trámite"
                    className={`font-bold px-1 rounded text-xs transition duration-150 
                        ${doc.tipoTramite === 'EXTERNO' 
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                >
                    {doc.tipoTramite === 'EXTERNO' ? 'EXT' : 'INT'}
                </button>
                <button title="Observado (Modal)" className="text-blue-600 hover:text-blue-800">
                    <Eye size={16} />
                </button>
                <button title="Generar Glosa (Modal)" className="text-gray-500 hover:text-gray-700">
                    <FilePenLine size={16} />
                </button>
                <button title="Ver Documento PDF (Modal)" className="text-blue-600 hover:text-blue-800">
                    <FileCode size={16} />
                </button>
                <button onClick={() => onDelete(doc.id)} title="Eliminar Trámite" className="text-red-600 hover:text-red-800">
                    <Trash2 size={16} />
                </button>
            </td>
        </tr>
    );
};


// ************************************************************
// ***** DocumentosSection (Componente Principal de la Sección) *****
// ************************************************************

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
}) {

    return (
        <div className="w-full lg:w-7/12">
            <div className="border border-gray-200 p-4 rounded-lg shadow-sm h-full flex flex-col">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Documentos del Trámite</h3>
                
                <div className="overflow-auto mb-4" style={{ flexGrow: 1, minHeight: '100px', maxHeight: '100%' }}>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                {['N°', 'Sitra', 'Nombre', 'Nro. Trámite', 'N° Título', 'Opciones'].map(header => (
                                    <th key={header} className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
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
            </div>
        </div>
    );
}
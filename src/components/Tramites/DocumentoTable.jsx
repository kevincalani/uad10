import React from 'react';
import DocumentoRow from './DocumentoRow';
import AddDocumentoForm from '../Forms/AddDocumentoForm';
import useDocleg from '../../hooks/useDocLeg';
import { toast } from '../../utils/toast';

export default function DocumentoTable({
    documentos,
    isAddDocumentoFormVisible,
    setIsAddDocumentoFormVisible,
    tramiteData,
    listaTramites,
    setDocumentos,
    isDatosPersonalesSaved,
    fetchData,
    confrontacion
}) {
    const { createDocumento, cambiarDestino } = useDocleg();

    const handleToggleDestino = async (cod_dtra) => {
        // Optimistic update
        setDocumentos(prevDocs => prevDocs.map(doc =>
            doc.cod_dtra === cod_dtra
                ? { ...doc, dtra_interno: doc.dtra_interno === 'f' ? 't' : 'f' }
                : doc
        ));

        try {
            const res = await cambiarDestino(cod_dtra);

            if (res?.data?.success) {
                const nuevoValor = res.data.data.dtra_interno;

                setDocumentos(prevDocs => prevDocs.map(doc =>
                    doc.cod_dtra === cod_dtra
                        ? { ...doc, dtra_interno: nuevoValor }
                        : doc
                ));

                toast.success(res.data.message || "Destino cambiado correctamente");
            } else {
                throw new Error("Error al cambiar destino");
            }
        } catch (err) {
            console.error(err);
            toast.error("No se pudo cambiar el destino");

            // Revert optimistic update
            setDocumentos(prevDocs => prevDocs.map(doc =>
                doc.cod_dtra === cod_dtra
                    ? { ...doc, dtra_interno: doc.dtra_interno === 'f' ? 't' : 'f' }
                    : doc
            ));
        }
    };

    // 🔥 Headers dinámicos según tipo de trámite
    const esBusqueda = tramiteData.tra_tipo_tramite === 'B';
    const esConfrontacion = tramiteData.tra_tipo_tramite === 'F';
    
    const headers = ['N°', 'Sitra', 'Nombre', 'Nro. Trámite'];
    
    // Añadir columna "Documentos" si es Búsqueda o Confrontación
    if (esBusqueda || esConfrontacion) {
        headers.push('Documentos');
    }
    
    // Siempre incluir estas columnas al final
    headers.push('N° Título', 'Opciones');

    return (
        <div className="w-full lg:w-8/12">
            <div className="border border-gray-200 p-4 rounded-lg shadow-sm flex flex-col">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                    Documentos del Trámite
                </h3>

                <div className="overflow-auto mb-4" style={{ flexGrow: 1, minHeight: '100px', maxHeight: '100%' }}>
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-sm">
                        <thead className="bg-gray-600 sticky top-0">
                            <tr>
                                {headers.map(header => (
                                    <th
                                        key={header}
                                        className="px-2 py-2 text-left text-xs text-white font-semibold uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {documentos.length === 0 ? (
                                <tr>
                                    <td colSpan={headers.length} className="text-center py-4 text-gray-500 text-sm">
                                        No hay documentos añadidos.
                                    </td>
                                </tr>
                            ) : (
                                documentos.map((doc, index) => (
                                    <DocumentoRow
                                        key={doc.cod_dtra}
                                        doc={doc}
                                        index={index}
                                        onCambiarDestino={handleToggleDestino}
                                        confrontacion={confrontacion}
                                        tramiteTipo={tramiteData.tra_tipo_tramite}
                                        fetchData={fetchData}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!isDatosPersonalesSaved ? (
                    <div className="p-2 bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm rounded text-center">
                        Debe guardar los <b>Datos Personales</b> antes de añadir trámites.
                    </div>
                ) : (
                    <>
                        {!isAddDocumentoFormVisible ? (
                            <div className="flex justify-end mt-2 flex-shrink-0">
                                <button
                                    onClick={() => setIsAddDocumentoFormVisible(true)}
                                    className="bg-blue-600 text-white py-1 px-4 text-sm rounded font-medium hover:bg-blue-700 transition cursor-pointer"
                                >
                                    + Trámite
                                </button>
                            </div>
                        ) : (
                            <AddDocumentoForm
                                setIsAddDocumentoFormVisible={setIsAddDocumentoFormVisible}
                                tramiteData={tramiteData}
                                listaTramites={listaTramites}
                                setDocumentos={setDocumentos}
                                createDocumento={createDocumento}
                                fetchData={fetchData}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
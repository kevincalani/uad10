import React from 'react';
import DocumentoRow from './DocumentoRow';
import AddDocumentoForm from '../components/Forms/AddDocumentoForm';
import useDocleg from '../hooks/useDocLeg';
import { toast } from '../utils/toast';

export default function DocumentoTable({
    documentos,
    isAddDocumentoFormVisible,
    setIsAddDocumentoFormVisible,
    tramiteData,
    listaTramites,
    handleDeleteDocumento,
    setDocumentos,
    isDatosPersonalesSaved,
    onObserve,
    fetchData
}) {

    const {createDocumento,cambiarDestino} = useDocleg()

    const handleToggleDestino = async (cod_dtra) => {
        setDocumentos(prevDocs => prevDocs.map(doc =>
            doc.cod_dtra === cod_dtra
                ? { ...doc, dtra_interno: doc.dtra_interno === 'f' ? 't' : 'f' }
                : doc
        ));

        try {
            const res = await cambiarDestino(cod_dtra);

            if (res?.data?.success) {
                const nuevoValor = res.data.data.dtra_interno;

                // Actualizamos el valor real que vino desde el backend
                setDocumentos(prevDocs => prevDocs.map(doc =>
                    doc.cod_dtra === cod_dtra
                        ? { ...doc, dtra_interno: nuevoValor }
                        : doc
                ));

                toast.success(res.data.data.message || "Destino cambiado correctamente");
            } else {
                throw new Error("Error al cambiar destino");
            }
        } catch (err) {
            console.error(err);
            toast.error("No se pudo cambiar el destino");

            setDocumentos(prevDocs => prevDocs.map(doc =>
                doc.cod_dtra === cod_dtra
                    ? { ...doc, dtra_interno: doc.dtra_interno === 'f' ? 't' : 'f' }
                    : doc
            ));
        }
    };

    return (
        <div className="w-full lg:w-8/12">
            <div className="border border-gray-200 p-4 rounded-lg shadow-sm flex flex-col">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                    Documentos del Trámite
                </h3>

                <div className="overflow-auto mb-4" style={{ flexGrow: 1, minHeight: '100px', maxHeight: '100%' }}>
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-sm">
                        <thead className="bg-gray-300 sticky top-0">
                            <tr>
                                {['N°', 'Sitra', 'Nombre', 'Nro. Trámite', 'N° Título', 'Opciones'].map(header => (
                                    <th
                                        key={header}
                                        className="px-2 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {documentos.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-gray-500 text-sm">
                                        No hay documentos añadidos.
                                    </td>
                                </tr>
                            ) : (
                                documentos.map((doc, index) => (
                                    <DocumentoRow
                                        key={doc.cod_dtra || index}
                                        doc={doc}
                                        index={index}
                                        onCambiarDestino={handleToggleDestino}
                                        onDelete={handleDeleteDocumento}
                                        onObserve={onObserve}
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
                                    className="bg-blue-600 text-white py-1 px-4 text-sm rounded font-medium hover:bg-blue-700 transition"
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

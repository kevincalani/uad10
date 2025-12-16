import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Search, CheckCircle, CircleQuestionMark } from 'lucide-react';
import useConfrontacion from '../../../hooks/useConfrontacion';
import { toast } from '../../../utils/toast';
import { TIPO_DOCUMENTO } from '../../../Constants/tramiteDatos';

export default function RegistrarBusquedaModal({ cod_dtra, onClose, onSuccess }) {
    const { cargarBusquedaEncontrado, guardarBusquedaEncontrado } = useConfrontacion();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [procesando, setProcesando] = useState(false);

    // Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await cargarBusquedaEncontrado(cod_dtra);
                console.log(result)
                setData(result);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                toast.error('Error al cargar los datos de búsqueda');
            } finally {
                setLoading(false);
            }
        };

        if (cod_dtra) {
            fetchData();
        }
    }, [cod_dtra]);

    // Manejar registro de documento encontrado
    const handleRegistrar = async () => {
        if (!data) return;

        try {
            setProcesando(true);

            const result = await guardarBusquedaEncontrado(data.docleg.cod_dtra);

            if (result.success) {
                toast.success(result.message || 'Documento registrado correctamente');

                // Ejecutar callback de éxito
                if (onSuccess) {
                    onSuccess(result.data);
                }

                // Cerrar modal
                onClose();
            }
        } catch (error) {
            console.error('Error al registrar:', error);
            toast.error('Error al registrar el documento encontrado');
        } finally {
            setProcesando(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="text-gray-600 font-medium">Cargando datos...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (!data) {
        return (
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl p-6">
                <div className="flex flex-col items-center justify-center h-64 gap-3">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <p className="text-center text-red-600 font-medium">
                        Error al cargar los datos de búsqueda
                    </p>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        );
    }

    const { docleg, tramite, documento } = data;
    const esSoloSello = docleg.dtra_solo_sello === 't';

    return (
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col">
            {/* Header - alert-primary */}
            <div className="bg-blue-100 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Search className="w-6 h-6" />
                    Búsqueda
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-600 hover:text-gray-800 transition"
                >
                    <X className="w-8 h-8 p-1 rounded-full hover:bg-white/80 cursor-pointer" />
                </button>
            </div>

            {/* Body */}
            <div className="p-6">
                {/* Texto de confirmación */}
                <p className="italic text-gray-700 mb-4">
                    {esSoloSello 
                        ? 'Esta seguro de legalizar este documento:' 
                        : 'Esta seguro de haber encontrado el documento:'}
                </p>

                {/* Contenedor principal con ícono */}
                <div className="flex items-start gap-4">
                    {/* Información del documento - alert-primary */}
                    <div className="flex-1 bg-blue-100 rounded-lg shadow p-4 mx-8">
                        <table className="w-full">
                            <tbody>
                                {esSoloSello ? (
                                    // Mostrar para solo sello
                                    <>
                                        <tr>
                                            <th className="text-right pr-4 py-2 text-gray-800 font-semibold">
                                                Trámite:
                                            </th>
                                            <td className="text-left pl-3 py-2 border-b border-gray-800 text-gray-900">
                                                {tramite.tre_nombre}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-right pr-4 py-2 text-gray-800 font-semibold">
                                                Nro. título:
                                            </th>
                                            <td className="text-left pl-3 py-2 border-b border-gray-800 text-gray-900">
                                                {docleg.dtra_numero} / {docleg.dtra_gestion}
                                            </td>
                                        </tr>
                                    </>
                                ) : (
                                    // Mostrar para búsqueda normal
                                    <>
                                        <tr>
                                            <th className="text-right pr-4 py-2 text-gray-800 font-semibold">
                                                Documento:
                                            </th>
                                            <td className="text-left pl-3 py-2 border-b border-gray-800 text-gray-900">
                                                {documento?.dcon_doc || '-'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-right pr-4 py-2 text-gray-800 font-semibold">
                                                Nro. título:
                                            </th>
                                            <td className="text-left pl-3 py-2 border-b border-gray-800 text-gray-900">
                                                {docleg.dtra_numero} / {docleg.dtra_gestion}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-right pr-4 py-2 text-gray-800 font-semibold">
                                                Buscado en:
                                            </th>
                                            <td className="text-left pl-3 py-2 border-b border-gray-800 text-gray-900">
                                                {TIPO_DOCUMENTO[docleg.dtra_buscar_en] || ''}
                                            </td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Ícono de pregunta */}
                    <div className="text-blue-600">
                        <CircleQuestionMark className="w-12 h-12 mt-4" strokeWidth={2} />
                    </div>
                </div>

                {/* Advertencia */}
                <div className="mt-4 border border-blue-500 rounded-lg p-3 text-gray-800 font-bold italic text-xs max-w-2xl">
                    * Esta acción se quedará registrado en el sistema
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3 bg-gray-50">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                    disabled={procesando}
                >
                    Cancelar
                </button>
                <button
                    onClick={handleRegistrar}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={procesando}
                >
                    {procesando ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Procesando...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-4 h-4" />
                            Registrar
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
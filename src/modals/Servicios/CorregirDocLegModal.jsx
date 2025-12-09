import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Edit3, XCircle, CircleQuestionMark } from 'lucide-react';
import useDocLeg from '../../hooks/useDocLeg';
import { toast } from '../../utils/toast';

export default function CorregirDoclegModal({ cod_dtra, onClose, onSuccess }) {
    const { cargarDatosCorreccion, corregirDocumento } = useDocLeg();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [procesando, setProcesando] = useState(false);

    // Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await cargarDatosCorreccion(cod_dtra);
                setData(result);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                toast.error('Error al cargar los datos del trámite');
            } finally {
                setLoading(false);
            }
        };

        if (cod_dtra) {
            fetchData();
        }
    }, [cod_dtra]);

    // Manejar corrección del documento
    const handleCorregir = async () => {
        if (!data) return;

        try {
            setProcesando(true);

            const result = await corregirDocumento(data.docleg.cod_dtra, data.docleg.cod_tra);

            if (result.success) {
                toast.success(result.message || 'Trámite desbloqueado correctamente');

                // Ejecutar callback de éxito
                if (onSuccess) {
                    onSuccess(result.data);
                }

                // Cerrar modal
                onClose();
            }
        } catch (error) {
            console.error('Error al corregir documento:', error);
            toast.error('Error al desbloquear el trámite');
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
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
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
                        Error al cargar los datos del trámite
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

    const { docleg, tramite, persona } = data;

    return (
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col">
            {/* Header - bg-danger */}
            <div className="bg-red-600 text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <XCircle  className="w-6 h-6" />
                    Eliminar trámite
                </h2>
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200 transition"
                >
                    <X className="w-8 h-8 p-1 rounded-full hover:bg-white/25 cursor-pointer" />
                </button>
            </div>

            {/* Body */}
            <div className="p-6">
                {/* Texto de confirmación */}
                <p className="italic text-gray-700 mb-4">
                    Esta seguro de editar el trámite de legalización:
                </p>

                {/* Contenedor principal con ícono */}
                <div className="flex items-start gap-4">
                    {/* Información del trámite - alert-danger */}
                    <div className="flex-1 bg-red-100 border border-red-500 rounded-lg shadow p-4 mx-4">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <th className="text-right pr-4 py-2 text-gray-800 font-semibold">
                                        Nombre trámite:
                                    </th>
                                    <td className="text-left pl-3 py-2 border-b border-red-500 text-gray-900">
                                        {tramite.tre_nombre}
                                    </td>
                                </tr>
                                <tr>
                                    <th className="text-right pr-4 py-2 text-gray-800 font-semibold">
                                        Interesado:
                                    </th>
                                    <td className="text-left pl-3 py-2 border-b border-red-500 text-gray-900">
                                        {persona.per_apellido} {persona.per_nombre}
                                    </td>
                                </tr>
                                <tr>
                                    <th className="text-right pr-4 py-2 text-gray-800 font-semibold">
                                        Nro. título:
                                    </th>
                                    <td className="text-left pl-3 py-2 border-b border-red-500 text-gray-900">
                                        {docleg.dtra_numero} / {docleg.dtra_gestion}
                                    </td>
                                </tr>
                                <tr>
                                    <th className="text-right pr-4 py-2 text-gray-800 font-semibold">
                                        Nro. Trámite:
                                    </th>
                                    <td className="text-left pl-3 py-2 border-b border-red-500 text-gray-900">
                                        {docleg.dtra_numero_tramite} / {docleg.dtra_gestion_tramite}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Ícono de pregunta */}
                    <div className="text-red-500 pt-4">
                        <CircleQuestionMark className="w-12 h-12" strokeWidth={2} />
                    </div>
                </div>

                {/* Advertencia */}
                <div className="mt-4 border border-red-500 rounded-lg p-3 text-red-600 font-bold italic text-xs max-w-2xl">
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
                    onClick={handleCorregir}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={procesando}
                >
                    {procesando ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Procesando...
                        </>
                    ) : (
                        <>
                            <Edit3 className="w-4 h-4" />
                            Editar
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
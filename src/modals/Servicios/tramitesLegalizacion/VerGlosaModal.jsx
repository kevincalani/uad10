import React, { useState, useEffect } from 'react';
import { X, FileText, AlertCircle, Printer } from 'lucide-react';
import useDocLeg from '../../../hooks/useDocLeg';
import { toast } from '../../../utils/toast';

export default function VerGlosaModal({ cod_dtra, onClose, onSuccess }) {
    const { configurarImpresionPDF, cambiarPosicionPDF, generarPDF } = useDocLeg();

    const [docleg, setDocleg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [procesando, setProcesando] = useState(false);

    // Opciones de posición
    const posiciones = [
        { value: '0', label: 'Imprimir glosa al inicio', img:'/src/assets/glosa_pdf_inicio.gif' },
        { value: '1', label: 'Imprimir glosa arriba', img: '/src/assets/glosa_pdf_arriba.gif' },
        { value: '2', label: 'Imprimir glosa al medio', img: '/src/assets/glosa_pdf_medio.gif' },
        { value: '3', label: 'Imprimir glosa abajo', img: '/src/assets/glosa_pdf_abajo.gif' },
        { value: '4', label: 'Imprimir glosa al final', img: '/src/assets/glosa_pdf_final.gif' },
    ];

    // Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await configurarImpresionPDF(cod_dtra);
                setDocleg(result.docleg);
            } catch (error) {
                console.error('Error al cargar configuración:', error);
                toast.error('Error al cargar la configuración de impresión');
            } finally {
                setLoading(false);
            }
        };

        if (cod_dtra) {
            fetchData();
        }
    }, [cod_dtra]);

    // Manejar selección de posición y generar PDF
    const handleSeleccionarPosicion = async (posicion) => {
        try {
            setProcesando(true);

            // Cambiar la posición
            const result = await cambiarPosicionPDF(cod_dtra, posicion);

            if (result.success) {
                toast.success('Posición de impresión actualizada');

                // Actualizar estado local
                setDocleg(prev => ({
                    ...prev,
                    dtra_glosa_posicion: posicion
                }));

                // Generar PDF en nueva ventana
                await generarPDF(cod_dtra);

                // Ejecutar callback y cerrar modal
                if (onSuccess) {
                    onSuccess();
                }

                onClose();
            }
        } catch (error) {
            console.error('Error al cambiar posición:', error);
            toast.error('Error al cambiar la posición de impresión');
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
                        <p className="text-gray-600 font-medium">Cargando configuración...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (!docleg) {
        return (
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl p-6">
                <div className="flex flex-col items-center justify-center h-64 gap-3">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <p className="text-center text-red-600 font-medium">
                        Error al cargar la configuración
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

    return (
        <div className="bg-white rounded-lg shadow-2xl w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header - bg-verde-oscuro */}
            <div className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <FileText className="w-6 h-6" />
                    GLOSA
                </h2>
                <button
                    onClick={onClose}
                    className="text-white transition p-1 rounded-full hover:bg-white/20 cursor-pointer"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
                {/* Título centrado - bg-primary */}
                <div className="bg-blue-600 rounded shadow p-2 mx-auto max-w-sm mb-4">
                    <h6 className="text-white text-center font-semibold">Impresión de glosa</h6>
                </div>

                {/* Separador */}
                <hr className="my-4 border-gray-300" />

                {/* Tabla de opciones */}
                <div className="max-w-3xl mx-auto">
                    <table className="w-full">
                        <tbody>
                            {posiciones.map((pos) => {
                                const isSelected = docleg.dtra_glosa_posicion === parseInt(pos.value);
                                
                                return (
                                    <tr
                                        key={pos.value}
                                        className="bg-white hover:bg-gray-300 transition cursor-pointer"
                                        onClick={() => !procesando && handleSeleccionarPosicion(pos.value)}
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-between">
                                                {/* Texto e indicador */}
                                                <div className="flex-1">
                                                    <div className="font-medium text-blue-600">
                                                        {pos.label}
                                                    </div>
                                                    <div className="mt-2">
                                                        {isSelected && (
                                                            <span className="inline-block bg-red-500 text-white text-xs px-3 py-1 rounded">
                                                                * Actualmente seleccionado
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Imagen */}
                                                <div className="ml-4">
                                                    <img
                                                        src={pos.img}
                                                        alt={pos.label}
                                                        className="w-16 h-16"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Indicador de procesamiento */}
                {procesando && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="text-sm font-medium">Generando PDF...</span>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-3 flex justify-end bg-gray-50">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-sm"
                    disabled={procesando}
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}
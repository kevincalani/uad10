import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { X, FileText, User, Calendar, Save, FileDown, AlertCircle } from 'lucide-react';
import {QRCodeSVG} from 'qrcode.react';
import useDocleg from '../../../hooks/useDocLeg';
import { toast } from '../../../utils/toast';

export default function GlosaLegalizacionModal({ cod_dtra, onClose, onSuccess }) {
    const {
        generarGlosaModal,
        elegirModelo,
        guardarGlosa,
        generarPDF,
    } = useDocleg();

    const [data, setData] = useState(null);
    const [glosaContent, setGlosaContent] = useState('');
    const [posicion, setPosicion] = useState('2'); // Por defecto "medio"
    const [loadingModal, setLoadingModal] = useState(true);
    const [saving, setSaving] = useState(false);

    // Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingModal(true);
                const result = await generarGlosaModal(cod_dtra);
                setData(result);
                setGlosaContent(result.docleg.dtra_glosa || '');
            } catch (error) {
                console.error('Error al cargar glosa:', error);
                toast.error('Error al cargar los datos de la glosa');
            } finally {
                setLoadingModal(false);
            }
        };

        if (cod_dtra) {
            fetchData();
        }
    }, [cod_dtra]);

    // Manejar cambio de modelo de glosa
    const handleElegirModelo = async (cod_glo) => {
        try {
            toast.info('Cargando modelo de glosa...');
            const result = await elegirModelo(cod_glo, cod_dtra);
            
            if (result.success) {
                setGlosaContent(result.data.glosa_actualizada);
                toast.success('Modelo de glosa actualizado');
                
                // Actualizar la glosa seleccionada en el estado
                setData(prev => ({
                    ...prev,
                    docleg: {
                        ...prev.docleg,
                        dtra_cod_glosa: cod_glo,
                        dtra_glosa: result.data.glosa_actualizada
                    }
                }));
            }
        } catch (error) {
            console.error('Error al elegir modelo:', error);
            toast.error('Error al cambiar el modelo de glosa');
        }
    };

    // Guardar glosa y generar PDF
    const handleGuardarYGenerarPDF = async () => {
        try {
            setSaving(true);
            
            const formData = {
                cdtra: cod_dtra,
                ctra: data.docleg.cod_tra,
                glosa: glosaContent,
                posicion: posicion
            };

            const result = await guardarGlosa(formData);

            if (result.success) {
                toast.success('Glosa guardada correctamente');
                
                // Generar PDF en nueva ventana
                await generarPDF(cod_dtra);
                
                // Ejecutar callback de éxito
                if (onSuccess) {
                    onSuccess();
                }
                
                // Cerrar modal
                onClose();
            }
        } catch (error) {
            console.error('Error al guardar glosa:', error);
            toast.error('Error al guardar la glosa');
        } finally {
            setSaving(false);
        }
    };

    if (loadingModal) {
        return (
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="text-gray-600 font-medium">Cargando glosa...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl p-6">
                <div className="flex flex-col items-center justify-center h-64 gap-3">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <p className="text-center text-red-600 font-medium">
                        Error al cargar los datos de la glosa
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

    const { docleg, tramite, persona, apoderado, tramita, glosas, qr_generado } = data;
    
    // Formatear fecha (replica el formato PHP: d/m/Y)
    const formatearFecha = (fecha) => {
        if (!fecha || fecha === '') return '-';
        
        // Dividir la fecha en partes (asumiendo formato YYYY-MM-DD desde la BD)
        const partes = fecha.split(/[-T\s]/); // Divide por guión, T o espacio
        
        if (partes.length < 3) return '-';
        
        const anio = partes[0];
        const mes = partes[1];
        const dia = partes[2];
        
        return `${dia}/${mes}/${anio}`;
    };
    // Si el trámite está bloqueado
    if (docleg.dtra_falso === 't') {
        return (
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
                        <AlertCircle className="w-6 h-6" />
                        Trámite Bloqueado
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="border-2 border-red-500 rounded-lg p-6 text-center bg-red-50">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-3" />
                    <p className="text-red-600 font-bold text-lg">
                        El trámite está bloqueado, no se puede generar una glosa
                    </p>
                </div>
                <div className="flex justify-end mt-4">
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
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl max-h-[95vh]  flex flex-col">
            {/* Header */}
            <div className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <FileText className="w-6 h-6" />
                    Glosa de Legalización
                </h2>
                <button
                    onClick={onClose}
                    className="text-white hover:bg-white/20 rounded-full p-1 transition cursor-pointer"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-blue-100 rounded-lg shadow-sm p-3 mb-4 mx-auto max-w-sm">
                    <h6 className="text-gray-800 font-bold text-center">Glosa de Legalización</h6>
                </div>
                    <hr className="my-4 border-gray-300" /> 
                <div className="grid grid-cols-12 gap-4">
                    {/* Columna izquierda - Datos */}
                    <div className="col-span-12 md:col-span-4 space-y-4 text-sm">
                        {/* Datos Personales */}
                         <div className='rounded-lg p-4 shadow-sm border border-gray-200'>
                            <table className="w-full ">
                                <tbody>
                                    <tr>
                                        <td colSpan="2" className="text-right text-blue-600 font-bold italic pb-2">
                                            * Datos personales
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="text-right italic text-gray-800 pr-2 py-1">Nombre:</th>
                                        <td className="border-b border-gray-800 text-gray-700">
                                            {persona.per_apellido} {persona.per_nombre}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="text-right italic text-gray-800 pr-2 py-1">CI:</th>
                                        <td className="border-b border-gray-800 text-gray-700">{persona.per_ci}</td>
                                    </tr>
                                    <tr>
                                        <th className="text-right italic text-gray-800 pr-2 py-1">Trámite:</th>
                                        <td className="border-b border-gray-800 text-gray-700">{tramite.tre_nombre}</td>
                                    </tr>
                                    <tr>
                                        <th className="text-right italic text-gray-800 pr-2 py-1">Fecha de solicitud:</th>
                                        <td className="border-b border-gray-800 text-gray-700">
                                            {formatearFecha(tramita.tra_fecha_solicitud)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Datos del Apoderado */}
                        {tramita.cod_apo && tramita.cod_apo !== '' && apoderado && (
                            <>
                                <hr className="my-3 border-gray-300" />
                                <div>
                                    <table className="w-full">
                                        <tbody>
                                            <tr>
                                                <td colSpan="2" className="text-right text-blue-600 font-bold italic pb-2">
                                                    * Datos del apoderado
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="text-right italic text-gray-800 pr-2 py-1">
                                                    Nombre apoderado:
                                                </th>
                                                <td className="border-b border-gray-800 text-gray-700">
                                                    {apoderado.apo_apellido} {apoderado.per_nombre}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="text-right italic text-gray-800 pr-2 py-1">CI:</th>
                                                <td className="border-b border-gray-800 text-gray-700">{apoderado.apo_ci}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                        
                        {/* Modelos de Glosa */}
                        {glosas && glosas.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200">
                                <h6 className="text-blue-600 font-bold text-sm mb-3 text-right italic">
                                    * Modelos de glosa
                                </h6>
                                <div className="space-y-1">
                                    {glosas.map((glosa) => {
                                        const isSelected = glosa.cod_glo === docleg.dtra_cod_glosa;
                                        return (
                                            <div
                                                key={glosa.cod_glo}
                                                className={`flex justify-between items-center p-2 rounded border-b border-gray-400 transition ${
                                                    isSelected ? 'bg-red-200' : 'hover:bg-gray-300'
                                                }`}
                                            >
                                                <span className="text-sm text-gray-800">{glosa.glo_titulo}</span>
                                                <button
                                                    onClick={() => handleElegirModelo(glosa.cod_glo)}
                                                    className="text-blue-600 transition p-1 bg-white hover:bg-gray-300 rounded-full cursor-pointer"
                                                    title="Seleccionar modelo"
                                                    disabled={isSelected}
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Columna derecha - Editor de Glosa */}
                    <div className="col-span-8 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-start gap-4 mb-4">
                            {/* QR Code */}
                            <div className="flex-shrink-0">
                                <QRCodeSVG value={qr_generado} size={100} />
                            </div>

                            {/* Título y Número de Trámite */}
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 mb-2">
                                    {docleg.dtra_titulo}
                                </h3>
                                <p className="font-bold italic text-gray-700">
                                    ARCH {docleg.dtra_numero_tramite}/{docleg.dtra_gestion_tramite}
                                </p>
                            </div>
                        </div>

                        {/* Editor TinyMCE */}
                        <div className="mb-4">
                            <Editor
                                tinymceScriptSrc="/tinymce/js/tinymce/tinymce.min.js"
                                value={glosaContent}
                                onEditorChange={(content) => setGlosaContent(content)}
                                init={{
                                     license_key: 'gpl',
                                    // height: 400,
                                    // menubar: false,
                                    // plugins: [
                                    //     'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                    //     'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                    //     'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    // ],
                                    // toolbar: 'undo redo | formatselect | bold italic underline | \
                                    //          alignleft aligncenter alignright alignjustify | \
                                    //          bullist numlist outdent indent | removeformat | help',
                                    // content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}
                            />
                        </div>

                        {/* Fecha literal */}
                        <div className="text-right mb-4">
                            <span className="text-gray-700 italic">{docleg.dtra_fecha_literal}</span>
                        </div>

                        {/* Opciones de posición de impresión */}
                        <div className="w-6/6">
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <th className="text-left pr-2 align-top pt-2">Imprimir en:</th>
                                        <td className="py-2 text-center">
                                            <div className="flex flex-col items-center">
                                                <img src="/src/assets/glosa_pdf_inicio.gif" width="35" height="35" alt="Inicio" className="mb-2" />
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <span className="text-base">Inicio</span>
                                                    <input
                                                        type="radio"
                                                        name="posicion"
                                                        value="0"
                                                        checked={posicion === '0'}
                                                        onChange={(e) => setPosicion(e.target.value)}
                                                    />
                                                </label>
                                            </div>
                                        </td>
                                        <td className="py-2 text-center">
                                            <div className="flex flex-col items-center">
                                                <img src="/src/assets/glosa_pdf_arriba.gif" width="35" height="35" alt="Superior" className="mb-2" />
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <span className="text-base">Superior</span>
                                                    <input
                                                        type="radio"
                                                        name="posicion"
                                                        value="1"
                                                        checked={posicion === '1'}
                                                        onChange={(e) => setPosicion(e.target.value)}
                                                    />
                                                </label>
                                            </div>
                                        </td>
                                        <td className="py-2 text-center">
                                            <div className="flex flex-col items-center">
                                                <img src="/src/assets/glosa_pdf_medio.gif" width="35" height="35" alt="Medio" className="mb-2" />
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <span className="text-base">Medio</span>
                                                    <input
                                                        type="radio"
                                                        name="posicion"
                                                        value="2"
                                                        checked={posicion === '2'}
                                                        onChange={(e) => setPosicion(e.target.value)}
                                                    />
                                                </label>
                                            </div>
                                        </td>
                                        <td className="py-2 text-center">
                                            <div className="flex flex-col items-center">
                                                <img src="/src/assets/glosa_pdf_abajo.gif" width="35" height="35" alt="Inferior" className="mb-2" />
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <span className="text-base">Inferior</span>
                                                    <input
                                                        type="radio"
                                                        name="posicion"
                                                        value="3"
                                                        checked={posicion === '3'}
                                                        onChange={(e) => setPosicion(e.target.value)}
                                                    />
                                                </label>
                                            </div>
                                        </td>
                                        <td className="py-2 text-center">
                                            <div className="flex flex-col items-center">
                                                <img src="/src/assets/glosa_pdf_final.gif" width="35" height="35" alt="Final" className="mb-2" />
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <span className="text-base">Final</span>
                                                    <input
                                                        type="radio"
                                                        name="posicion"
                                                        value="4"
                                                        checked={posicion === '4'}
                                                        onChange={(e) => setPosicion(e.target.value)}
                                                    />
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition flex items-center gap-2"
                    disabled={saving}
                >
                    <X className="w-4 h-4" />
                    Cerrar
                </button>
                <button
                    onClick={handleGuardarYGenerarPDF}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={saving}
                >
                    {saving ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Generando...
                        </>
                    ) : (
                        <>
                            <FileDown className="w-4 h-4" />
                            Generar PDF
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
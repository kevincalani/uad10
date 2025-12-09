import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Save } from 'lucide-react';
import { useTramitesLegalizacion } from '../../../hooks/useTramitesLegalizacion';
import { toast } from '../../../utils/toast';

export default function ConfirmarEntregaModal({ varios, cod_dtra, onClose, onSuccess }) {
    const { cargarConfirmacionEntrega, registrarEntrega } = useTramitesLegalizacion();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [procesando, setProcesando] = useState(false);

    // Estado del radio button
    const [tipoEntrega, setTipoEntrega] = useState('a'); // 'a' = apoderado, 't' = titular

    // Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await cargarConfirmacionEntrega(varios, cod_dtra);

                if (result.ok) {
                    setData(result.data);

                    // Si NO tiene apoderado, por defecto es titular
                    if (!result.data.tramita.cod_apo || result.data.tramita.cod_apo === '') {
                        setTipoEntrega('t');
                    } else {
                        setTipoEntrega('a'); // Por defecto apoderado si existe
                    }
                } else {
                    toast.error(result.error);
                    onClose();
                }
            } catch (error) {
                console.error('Error al cargar datos:', error);
                toast.error('Error al cargar datos de entrega');
                onClose();
            } finally {
                setLoading(false);
            }
        };

        if (cod_dtra) {
            fetchData();
        }
    }, [cod_dtra, varios]);

    // Manejar el registro de entrega
    const handleGuardarEntrega = async () => {
        if (!data) return;

        try {
            setProcesando(true);

            let formData = { tipo: tipoEntrega };

            if (varios === '1') {
                // Entregar un solo documento
                formData.cdtra = data.docleg.cod_dtra;
                formData.ctra = data.docleg.cod_tra;
            } else {
                // Entregar todos los documentos
                formData.ctra = data.tramita.cod_tra;
                formData.todo = 't';
            }

            const result = await registrarEntrega(formData);

            if (result.ok) {
                toast.success(result.message);

                // Ejecutar callback de éxito
                if (onSuccess) {
                    onSuccess(result.data);
                }

                // Cerrar modal
                onClose();
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Error al registrar entrega:', error);
            toast.error('Error al registrar la entrega');
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
                        Error al cargar los datos de entrega
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

    const { tramita, persona, apoderado, docleg } = data;
    const tieneApoderado = tramita.cod_apo && tramita.cod_apo !== '';

    // Si varios='1' es un solo documento, si varios='2' son todos
    const esUnSoloDocumento = varios === '1';

    // Verificar si el documento está bloqueado (solo para varios='1')
    const documentoBloqueado = esUnSoloDocumento && docleg?.dtra_falso === 't';

    return (
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col">
            {/* Header - alert-primary */}
            <div className="bg-blue-100 border-b-4 border-blue-600 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" />
                    </svg>
                    Entregas
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-600 hover:text-gray-800 transition"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Body */}
            <div className="p-6">
                {/* Título */}
                <div className="bg-blue-100 rounded shadow p-2 mx-auto max-w-2xl mb-4">
                    <h6 className="text-gray-800 text-center font-bold">
                        Formulario de entrega de legalizaciones
                    </h6>
                </div>

                <hr className="my-4 border-gray-300" />

                {/* Formulario */}
                <div>
                    <table className="w-11/12 mx-auto text-sm text-gray-800">
                        <tbody>
                            <tr>
                                <th className="text-right pr-4 py-2 italic">Nro. Trámite:</th>
                                <td className="border-b border-gray-800 py-2">{tramita.tra_numero}</td>
                            </tr>
                            <tr>
                                <th className="text-right pr-4 py-2 italic">Trámite:</th>
                                <td className="border-b border-gray-800 py-2">
                                    {esUnSoloDocumento ? (
                                        // Un solo documento
                                        <div>{docleg?.tre_nombre || '-'}</div>
                                    ) : (
                                        // Todos los documentos pendientes
                                        <div>
                                            {Array.isArray(docleg) ? (
                                                docleg
                                                    .filter(d => d.dtra_entregado === '' || d.dtra_entregado === null)
                                                    .map((d, i) => (
                                                        <div key={i}>{d.tre_nombre}</div>
                                                    ))
                                            ) : (
                                                '-'
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th className="text-right pr-4 py-2 italic align-top">
                                    <br />
                                    Entregar A:
                                </th>
                                <td className="border-b border-gray-800 py-2">
                                    <br />
                                    <div className="space-y-2 pl-2">
                                        {tieneApoderado ? (
                                            <>
                                                {/* Opción apoderado */}
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="tipo"
                                                        value="a"
                                                        checked={tipoEntrega === 'a'}
                                                        onChange={(e) => setTipoEntrega(e.target.value)}
                                                    />
                                                    <span>
                                                        {apoderado.apo_apellido} {apoderado.apo_nombre}
                                                        <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                                                            Apo
                                                        </span>
                                                    </span>
                                                </label>

                                                {/* Opción titular */}
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="tipo"
                                                        value="t"
                                                        checked={tipoEntrega === 't'}
                                                        onChange={(e) => setTipoEntrega(e.target.value)}
                                                    />
                                                    <span>
                                                        {persona.per_apellido} {persona.per_nombre}
                                                    </span>
                                                </label>
                                            </>
                                        ) : (
                                            // Sin apoderado, solo titular
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="tipo"
                                                    value="t"
                                                    checked={tipoEntrega === 't'}
                                                    readOnly
                                                />
                                                <span>
                                                    {persona.per_apellido} {persona.per_nombre}
                                                </span>
                                            </label>
                                        )}
                                    </div>
                                    <br />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Advertencias */}
                    <div className="mt-4 text-red-600 font-bold italic text-xs border-2 border-red-500 rounded p-3 max-w-2xl mx-auto">
                        <p>* Esta acción se quedará registrado en el sistema</p>
                        <p>* Si hace la entrega de este trámite, ya no se podrá modificar su estado</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3 bg-gray-50">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-sm"
                    disabled={procesando}
                >
                    Cerrar
                </button>

                {/* Solo mostrar botón guardar si NO está bloqueado */}
                {!documentoBloqueado && (
                    <button
                        onClick={handleGuardarEntrega}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={procesando}
                    >
                        {procesando ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Guardar
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
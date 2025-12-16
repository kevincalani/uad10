import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CircleArrowRight, Edit3, Save, FileText, Minus, FilePen, HandCoins, HandHelping, CircleCheck } from 'lucide-react';
import { useTramitesLegalizacion } from '../../../hooks/useTramitesLegalizacion';
import { toast } from '../../../utils/toast';
import { useModal } from '../../../hooks/useModal';
import ConfirmarEntregaModal from './ConfirmarEntregaModal';
import VerDocumentoPDFModal from '../tramitesLegalizacion/VerDocumentoPDFModal';


export default function PanelEntregaModal({ cod_tra, onClose, onSuccess }) {
    const {
        cargarPanelEntrega,
        guardarApoderado,
        buscarApoderadoPorCI,
        registrarEntrega,
    } = useTramitesLegalizacion();

    const { openModal } = useModal();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editandoApoderado, setEditandoApoderado] = useState(false);
    const [guardandoApoderado, setGuardandoApoderado] = useState(false);

    // Formulario de apoderado
    const [formApoderado, setFormApoderado] = useState({
        ci: '',
        apellido: '',
        nombre: '',
        tipo: 'd',
    });

    // Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await cargarPanelEntrega(cod_tra);

                if (result.ok) {
                    setData(result.data);

                    // Si hay apoderado, cargar sus datos en el formulario
                    if (result.data.apoderado) {
                        setFormApoderado({
                            ci: result.data.apoderado.apo_ci || '',
                            apellido: result.data.apoderado.apo_apellido || '',
                            nombre: result.data.apoderado.apo_nombre || '',
                            tipo: result.data.tramita.tra_tipo_apoderado || 'd',
                        });
                    }
                } else {
                    toast.error(result.error);
                    onClose();
                }
            } catch (error) {
                console.error('Error al cargar datos:', error);
                toast.error('Error al cargar el panel de entrega');
                onClose();
            } finally {
                setLoading(false);
            }
        };

        if (cod_tra) {
            fetchData();
        }
    }, [cod_tra]);

    // Buscar apoderado por CI
    const handleBuscarApoderado = async (ci) => {
        if (!ci || ci.trim() === '') return;

        const result = await buscarApoderadoPorCI(ci);

        if (result.ok && result.found) {
            setFormApoderado(prev => ({
                ...prev,
                apellido: result.apoderado.apo_apellido,
                nombre: result.apoderado.apo_nombre,
            }));
        } else {
            setFormApoderado(prev => ({
                ...prev,
                apellido: '',
                nombre: '',
            }));
        }
    };

    // Guardar datos del apoderado
    const handleGuardarApoderado = async () => {
        if (!formApoderado.ci || !formApoderado.apellido || !formApoderado.nombre) {
            toast.error('Complete todos los campos del apoderado');
            return;
        }

        try {
            setGuardandoApoderado(true);

            const result = await guardarApoderado({
                ctra: cod_tra,
                ci: formApoderado.ci,
                apellido: formApoderado.apellido,
                nombre: formApoderado.nombre,
                tipo: formApoderado.tipo,
            });

            if (result.ok) {
                toast.success(result.message);

                // Actualizar datos locales
                setData(prev => ({
                    ...prev,
                    apoderado: result.data.apoderado,
                    tramita: result.data.tramita,
                }));

                setEditandoApoderado(false);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Error al guardar apoderado:', error);
            toast.error('Error al guardar los datos del apoderado');
        } finally {
            setGuardandoApoderado(false);
        }
    };

    // Recargar panel después de una entrega
    const recargarPanel = async () => {
        const result = await cargarPanelEntrega(cod_tra);
        if (result.ok) {
            setData(result.data);
        }
    };

    // Entregar documento individual (sin apoderado)
    const handleEntregarDirecto = async (cod_dtra) => {
        try {
            const result = await registrarEntrega({
                cdtra: cod_dtra,
                ctra: cod_tra,
                tipo: 't', // Titular
            });

            if (result.ok) {
                toast.success(result.message);
                await recargarPanel();

                if (onSuccess) {
                    onSuccess();
                }
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Error al entregar:', error);
            toast.error('Error al registrar la entrega');
        }
    };

    // Entregar todo directo (sin apoderado)
    const handleEntregarTodoDirecto = async () => {
        try {
            const result = await registrarEntrega({
                ctra: cod_tra,
                tipo: 't', // Titular
                todo: 't',
            });

            if (result.ok) {
                toast.success(result.message);
                await recargarPanel();

                if (onSuccess) {
                    onSuccess();
                }
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Error al entregar:', error);
            toast.error('Error al registrar la entrega');
        }
    };

    // Abrir modal de confirmación de entrega (CON apoderado)
    const handleEntregarConApoderado = (cod_dtra) => {
        openModal(ConfirmarEntregaModal, {
            varios: '1',
            cod_dtra: cod_dtra,
            onSuccess: async () => {
                await recargarPanel();

                if (onSuccess) {
                    onSuccess();
                }
            },
        });
    };

    // Abrir modal de confirmación de entrega TODO (CON apoderado)
    const handleEntregarTodoConApoderado = () => {
        openModal(ConfirmarEntregaModal, {
            varios: '2',
            cod_dtra: cod_tra,
            onSuccess: async () => {
                await recargarPanel();

                if (onSuccess) {
                    onSuccess();
                }
            },
        });
    };

    // Formatear fecha 
   const formatearFecha = (fecha) => {
        if (!fecha) return "";

        const [year, month, day] = fecha.split("-");
        const date = new Date(Number(year), Number(month) - 1, Number(day));

        return date.toLocaleDateString("es-BO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        });
    };
    

    // Loading state
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="text-gray-600 font-medium">Cargando panel de entrega...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (!data) {
        return (
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl p-6">
                <div className="flex flex-col items-center justify-center h-64 gap-3">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <p className="text-center text-red-600 font-medium">
                        Error al cargar los datos del panel
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

    const { tramita, documentos, persona, apoderado } = data;
    const tieneApoderado = tramita.cod_apo && tramita.cod_apo !== '';

    return (
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <HandHelping className="w-6 h-6" />
                    Apoderado
                </h2>
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200 transition"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
                {/* Título */}
                <div className="bg-blue-600 rounded shadow p-2 mx-auto max-w-xl mb-4">
                    <h6 className="text-white text-center font-bold">Entrega de Documentos Legalizacion</h6>
                </div>

                <hr className="my-4 border-gray-300" />

                {/* Grid principal */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Columna izquierda - col-md-4 */}
                    <div className="col-span-12 md:col-span-4 space-y-4">
                        {/* Datos del trámite */}
                        <div>
                            <h3 className="text-blue-600 font-bold italic text-sm mb-3">
                                * Datos del trámite
                            </h3>

                            <table className="w-full text-sm">
                                <tbody>
                                    <tr>
                                        <th className="text-right pr-4 py-2 text-gray-800 font-semibold italic">
                                            Nro Trámite:
                                        </th>
                                        <td className="border-b border-gray-800 py-2">{tramita.tra_numero}</td>
                                    </tr>
                                    <tr>
                                        <th className="text-right pr-4 py-2 text-gray-800 font-semibold italic">
                                            CI:
                                        </th>
                                        <td className="border-b border-gray-800 py-2">{persona?.per_ci || '-'}</td>
                                    </tr>
                                    <tr>
                                        <th className="text-right pr-4 py-2 text-gray-800 font-semibold italic">
                                            Fecha de solicitud:
                                        </th>
                                        <td className="border-b border-gray-800 py-2">
                                            {formatearFecha(tramita.tra_fecha_solicitud)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="text-right pr-4 py-2 text-gray-800 font-semibold italic">
                                            Titular:
                                        </th>
                                        <td className="border-b border-gray-800 py-2">
                                            {persona ? `${persona.per_apellido} ${persona.per_nombre}` : '-'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Datos del apoderado */}
                        <div>
                            <h3 className="text-blue-600 font-bold italic text-sm mb-3">
                                * Datos del apoderado
                            </h3>

                            {!editandoApoderado ? (
                                // Vista de solo lectura
                                <div id="apoderadoEntrega">
                                    {apoderado ? (
                                        <table className="w-full text-sm mb-3">
                                            <tbody>
                                                <tr>
                                                    <th className="text-right pr-4 py-2 text-gray-800 italic">CI:</th>
                                                    <td className="border-b border-gray-800 py-2">
                                                        {apoderado.apo_ci}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="text-right pr-4 py-2 text-gray-800 italic">
                                                        Nombre apoderado:
                                                    </th>
                                                    <td className="border-b border-gray-800 py-2">
                                                        {apoderado.apo_apellido} {apoderado.apo_nombre}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="text-right pr-4 py-2 text-gray-800 italic">
                                                        Tipo de apoderado:
                                                    </th>
                                                    <td className="border-b border-gray-800 py-2">
                                                        {tramita.tra_tipo_apoderado === 'd'
                                                            ? 'Declaración jurada'
                                                            : tramita.tra_tipo_apoderado === 'p'
                                                            ? 'Poder notariado'
                                                            : '-'}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="text-sm mb-3 text-gray-500 italic">
                                            Sin apoderado registrado
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setEditandoApoderado(true)}
                                        className="float-right px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                                    >
                                        Editar datos
                                    </button>
                                    <div className="clear-both"></div>
                                </div>
                            ) : (
                                // Vista de edición
                                <div id="editarApoderadoEntrega" className="border rounded shadow p-3">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-blue-600 font-bold italic text-sm">
                                            * Editar datos del apoderado
                                        </span>
                                        <button
                                            onClick={() => setEditandoApoderado(false)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Cerrar"
                                        >
                                            <Minus size={20} />
                                        </button>
                                    </div>

                                    <table className="w-full text-sm">
                                        <tbody>
                                            <tr>
                                                <th className="text-right pr-4 py-2 italic">CI:</th>
                                                <td className="border-b border-gray-800 py-2">
                                                    <input
                                                        type="text"
                                                        value={formApoderado.ci}
                                                        onChange={(e) => {
                                                            setFormApoderado(prev => ({
                                                                ...prev,
                                                                ci: e.target.value,
                                                            }));
                                                        }}
                                                        onBlur={(e) => handleBuscarApoderado(e.target.value)}
                                                        className="w-full border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 px-2 text-sm"
                                                        placeholder="Ingrese CI"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="text-right pr-4 py-2 italic">Apellidos:</th>
                                                <td className="border-b border-gray-800 py-2">
                                                    <input
                                                        type="text"
                                                        value={formApoderado.apellido}
                                                        onChange={(e) =>
                                                            setFormApoderado(prev => ({
                                                                ...prev,
                                                                apellido: e.target.value,
                                                            }))
                                                        }
                                                        className="w-full border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 px-2 text-sm"
                                                        placeholder="Apellidos"
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="text-right pr-4 py-2 italic">Nombres:</th>
                                                <td className="border-b border-gray-800 py-2">
                                                    <input
                                                        type="text"
                                                        value={formApoderado.nombre}
                                                        onChange={(e) =>
                                                            setFormApoderado(prev => ({
                                                                ...prev,
                                                                nombre: e.target.value,
                                                            }))
                                                        }
                                                        className="w-full border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 px-2 text-sm"
                                                        placeholder="Nombres"
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="text-right pr-4 py-2 italic align-top">
                                                    Tipo de apoderado:
                                                </th>
                                                <td className="border-b border-gray-800 py-2">
                                                    <div className="space-y-1 pl-2">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="tipo"
                                                                value="d"
                                                                checked={formApoderado.tipo === 'd'}
                                                                onChange={(e) =>
                                                                    setFormApoderado(prev => ({
                                                                        ...prev,
                                                                        tipo: e.target.value,
                                                                    }))
                                                                }
                                                            />
                                                            <span className="text-sm">Declaración jurada</span>
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="tipo"
                                                                value="p"
                                                                checked={formApoderado.tipo === 'p'}
                                                                onChange={(e) =>
                                                                    setFormApoderado(prev => ({
                                                                        ...prev,
                                                                        tipo: e.target.value,
                                                                    }))
                                                                }
                                                            />
                                                            <span className="text-sm">Poder notariado</span>
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <button
                                        onClick={handleGuardarApoderado}
                                        disabled={guardandoApoderado}
                                        className="float-right mt-3 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {guardandoApoderado ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Guardando...
                                            </>
                                        ) : (
                                            'Guardar'
                                        )}
                                    </button>
                                    <div className="clear-both"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Columna derecha - col-md-8 */}
                    <div className="col-span-12 md:col-span-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-blue-600 font-bold italic text-sm">
                                * Documentos del trámite
                            </h3>

                            {/* Botón Entregar todo */}
                            <button
                                onClick={tieneApoderado ? handleEntregarTodoConApoderado : handleEntregarTodoDirecto}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition flex items-center gap-2 font-bold shadow border border-red-700"
                            >
                                <CircleArrowRight size={16} />
                                Entregar todo
                            </button>
                        </div>

                        {/* Tabla de documentos */}
                        <div className="overflow-x-auto border border-gray-300 rounded">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-600">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-white uppercase">
                                            N°
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-white uppercase">
                                            Nombre
                                        </th>
                                        {tramita.tra_tipo_tramite === 'B' && (
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-white uppercase">
                                                Documentos
                                            </th>
                                        )}
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-white uppercase">
                                            N° Título
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-white uppercase">
                                            Opciones
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-white uppercase">
                                            Entregar
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {documentos.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={tramita.tra_tipo_tramite === 'B' ? 6 : 5}
                                                className="text-center py-4 text-gray-500 text-sm"
                                            >
                                                No hay documentos generados para entregar
                                            </td>
                                        </tr>
                                    ) : (
                                        documentos.map((doc, index) => {
                                            const yaEntregado =
                                                doc.dtra_entregado === 't' || doc.dtra_entregado === 'a';

                                            return (
                                                <tr key={doc.cod_dtra} className="hover:bg-gray-200 text-xs">
                                                    <td className="px-3 py-2">{index + 1}</td>
                                                    <td className="px-3 py-2 text-left">
                                                        <div>
                                                            <div>{doc.tre_nombre}</div>
                                                            <div className="text-xs text-gray-600 mt-1">
                                                                {doc.dtra_interno === 't' && (
                                                                    <>
                                                                        <span className="font-bold text-gray-800 italic">
                                                                            Trámite:{' '}
                                                                        </span>
                                                                        <span className="text-red-600 font-bold">
                                                                            Interno
                                                                        </span>
                                                                        {' | '}
                                                                    </>
                                                                )}
                                                                <span className="font-bold text-gray-800 italic">
                                                                    Valorado:{' '}
                                                                </span>
                                                                <span>{doc.dtra_valorado}</span>
                                                                {' | '}
                                                                {yaEntregado && (
                                                                    <>
                                                                        <span className="font-bold text-gray-800 italic">
                                                                            Fecha entrega:{' '}
                                                                        </span>
                                                                        <span className="text-blue-600 font-bold">
                                                                            {formatearFecha(
                                                                                doc.dtra_fecha_recojo
                                                                            )}
                                                                        </span>
                                                                        {' | '}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    {tramita.tra_tipo_tramite === 'B' && (
                                                        <td className="px-3 py-2">{doc.dcon_doc || '-'}</td>
                                                    )}
                                                    <td className="px-3 py-2 text-left">
                                                        {doc.dtra_numero}/
                                                        {String(doc.dtra_gestion).slice(-2)}
                                                    </td>
                                                    <td className="px-3 py-2 text-right">
                                                        <div className="flex gap-1">
                                                            {doc.dtra_generado === 't' &&
                                                                doc.dtra_estado_doc === 0 && (
                                                                    <button
                                                                        title="Ver documento PDF"
                                                                        className="p-2 bg-white rounded-full shadow-md text-blue-600 hover:bg-blue-50"
                                                                        onClick={() =>
                                                                            openModal(VerDocumentoPDFModal, {
                                                                                cod_dtra: doc.cod_dtra,
                                                                            })
                                                                        }
                                                                    >
                                                                        <FileText size={14} />
                                                                    </button>
                                                                )}
                                                            {tramita.tra_tipo_tramite === 'C' && (
                                                                <a
                                                                    href={`/generar pdf/${doc.cod_dtra}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="p-2 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-50"
                                                                    title="Generar PDF"
                                                                >
                                                                    <FilePen size={14} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2 text-right">
                                                        {yaEntregado ? (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-green-600 text-xl border border-red-500 rounded">
                                                                    <CircleCheck/>
                                                                </span>
                                                                {doc.dtra_entregado === 'a' && (
                                                                    <span className="text-green-600 font-bold italic text-xs">
                                                                        Apoderado
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() =>
                                                                    tieneApoderado
                                                                        ? handleEntregarConApoderado(doc.cod_dtra)
                                                                        : handleEntregarDirecto(doc.cod_dtra)
                                                                }
                                                                className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition flex items-center gap-1"
                                                                title="Entregar documento"
                                                            >
                                                                <CircleArrowRight size={18} />
                                                                {tieneApoderado ? 'Entregar +' : 'Entregar'}
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-3 flex justify-end bg-gray-50">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-sm"
>
Cerrar
</button>
</div>
</div>
);
}
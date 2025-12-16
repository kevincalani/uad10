// 📁 src/modals/servicios/ModalObservaciones.jsx
import React, { useEffect, useState } from "react";
import { X, Eye, Save } from "lucide-react";
import { toast } from "../../../utils/toast";
import useDocleg from "../../../hooks/useDocLeg";

export default function ObservarTramiteModal({ cod_dtra, onClose, fetchData }) {

    const { getObservaciones, saveObservacion } = useDocleg();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [doc, setDoc] = useState(null);
    const [obs, setObs] = useState("");
    const [falso, setFalso] = useState(false);
    const [initialFalso, setInitialFalso] = useState(false); // 🔥 NUEVO: guardar estado inicial

    // 🔥 Cargar datos iniciales desde el backend
    useEffect(() => {
        const load = async () => {
            try {
                const data = await getObservaciones(cod_dtra);

                setDoc(data);
                setObs(data.dtra_obs ?? "");
                const isFalso = data.dtra_falso === "t";
                setFalso(isFalso);
                setInitialFalso(isFalso); // 🔥 NUEVO: guardar valor inicial
            } catch (err) {
                console.log(err);
                toast.error("Error cargando observaciones");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [cod_dtra]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveObservacion({
                cod_dtra,
                obs,
                falso,
            });

            toast.success("Observación guardada");
            if (fetchData) fetchData(); // refrescar tabla documentos
            onClose();
        } catch (err) {
            console.log(err);
            toast.error("No se pudo guardar la observación");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 text-center">
                Cargando información...
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg w-2xl">

            {/* HEADER */}
            <div className="bg-red-600 text-white flex justify-between items-center px-4 py-3 rounded-t">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Eye /> Observar
                </h3>
                <X size={22} className="cursor-pointer hover:text-gray-300" onClick={onClose} />
            </div>

            {/* BODY */}
            <div className="p-6">
                <div className="bg-red-200 text-center p-2 rounded font-semibold text-gray-800 shadow">
                    Formulario de registro de observaciones
                </div>

                <hr className="my-4 text-gray-300" />

                <table className="w-full text-sm">
                    <tbody>
                        <tr>
                            <th className="text-right text-red-600 font-semibold pr-3">
                                Trámite:
                            </th>
                            <td className="border-b border-gray-400 py-1">
                                {doc?.tre_nombre}
                            </td>
                        </tr>

                        {/* 🔥 CAMBIO: Usar initialFalso para determinar el modo */}
                        <tr>
                            <th className="text-right text-red-600 font-semibold pr-3">
                                Observación:
                            </th>
                            <td className="border-b border-gray-400 py-2">
                                <textarea
                                    value={obs}
                                    onChange={(e) => setObs(e.target.value)}
                                    className="w-full border border-gray-400 rounded p-2 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    disabled={saving || initialFalso}
                                    readOnly={initialFalso}
                                />
                            </td>
                        </tr>

                        <tr>
                            <th className="text-right text-red-600 font-semibold pr-3">
                                Bloquear:
                            </th>
                            <td className="border-b border-gray-400 py-2">
                                <input
                                    type="checkbox"
                                    checked={falso}
                                    onChange={(e) => setFalso(e.target.checked)}
                                    disabled={saving || initialFalso}
                                    className={initialFalso ? "cursor-not-allowed" : "cursor-pointer"}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="mt-4 text-xs text-red-600 border border-red-600 rounded p-2">
                    * Esta acción se quedará registrada en el sistema. <br />
                    * Si bloquea el trámite, ya no se podrá modificar su estado.
                </div>
            </div>

            {/* FOOTER */}
            <div className="bg-gray-100 px-4 py-3 flex justify-end gap-2 rounded-b border-t border-gray-300">
                <button
                    className="px-3 py-1 text-base bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={onClose}
                    disabled={saving}
                >
                    Cerrar
                </button>

                {/* 🔥 CAMBIO: Usar initialFalso para mostrar/ocultar el botón */}
                {!initialFalso && (
                    <button
                        className="px-3 py-1 text-base bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        <Save size={16} />
                        {saving ? "Guardando..." : "Guardar"}
                    </button>
                )}
            </div>
        </div>
    );
}
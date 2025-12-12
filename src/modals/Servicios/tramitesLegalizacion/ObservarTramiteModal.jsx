// 📁 src/modals/servicios/ModalObservaciones.jsx
import React, { useEffect, useState } from "react";
import { X,Eye } from "lucide-react";
import useDocleg from "../../hooks/useDocLeg";
import { toast } from "../../utils/toast";

export default function ObservarTramiteModal({ cod_dtra, onClose, fetchData }) {

    const { getObservaciones, saveObservacion } = useDocleg();

    const [loading, setLoading] = useState(true);
    const [doc, setDoc] = useState(null);
    const [obs, setObs] = useState("");
    const [falso, setFalso] = useState(false);

    // 🔥 Cargar datos iniciales desde el backend
    useEffect(() => {
        const load = async () => {
            try {
                const data = await getObservaciones(cod_dtra);

                setDoc(data);
                setObs(data.dtra_obs ?? "");
                setFalso(data.dtra_falso === "t");
            } catch (err) {
                toast.error("Error cargando observaciones");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [cod_dtra]);

    const handleSave = async () => {
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
            console.log(err)
            toast.error("No se pudo guardar la observación");
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
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">

            {/* HEADER */}
            <div className="bg-red-600 text-white flex justify-between items-center px-4 py-3 rounded-t">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Eye/> Observar
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

                        {falso ? (
                            <>
                                {/* Modo bloqueado */}
                                <tr>
                                    <th className="text-right text-red-600 font-semibold pr-3">
                                        Observación:
                                    </th>
                                    <td className="border-b border-gray-400 py-1">
                                        {doc?.dtra_obs}
                                    </td>
                                </tr>

                                <tr>
                                    <th className="text-right text-red-600 font-semibold pr-3">
                                        Bloqueado:
                                    </th>
                                    <td className="border-b border-gray-400 py-1">
                                        <i className="fas fa-check text-red-600"></i>
                                    </td>
                                </tr>
                            </>
                        ) : (
                            <>
                                {/* Modo editable */}
                                <tr>
                                    <th className="text-right text-red-600 font-semibold pr-3">
                                        Observación:
                                    </th>
                                    <td className="border-b border-gray-400 py-2">
                                        <textarea
                                            value={obs}
                                            onChange={(e) => setObs(e.target.value)}
                                            className="w-full border border-gray-400 rounded p-2 text-sm"
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
                                        />
                                    </td>
                                </tr>
                            </>
                        )}
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
                    className="px-3 py-1 text-base bg-gray-300 rounded hover:bg-gray-400"
                    onClick={onClose}
                >
                    Cerrar
                </button>

                {!falso && (
                    <button
                        className="px-3 py-1 text-base bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={handleSave}
                    >
                        Guardar
                    </button>
                )}
            </div>
        </div>
    );
}

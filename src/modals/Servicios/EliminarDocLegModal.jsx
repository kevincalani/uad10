import React, { useEffect, useState } from "react";
import { X, XCircle } from "lucide-react";
import { toast } from "../../utils/toast";
import api from "../../api/axios";
import useDocleg from "../../hooks/useDocLeg";

export default function EliminarDoclegModal({ cod_dtra, onClose, fetchData }) {
    const { eliminarDocumento } = useDocleg();

    const [loading, setLoading] = useState(true);
    const [docleg, setDocleg] = useState(null);
    const [persona, setPersona] = useState(null);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const res = await api.get(`/api/f-eli-docleg/${cod_dtra}`);
            setDocleg(res.data.docleg);
            setPersona(res.data.persona);
        } catch (err) {
            console.log(err)
            toast.error("Error cargando datos para eliminar");
            onClose();
        }
        setLoading(false);
    };

    const handleEliminar = async () => {
        try {
            const res = await eliminarDocumento(cod_dtra);

            if (res.status === "success") {
                toast.success(res.message);
                if(fetchData)fetchData()
                onClose();
            } else {
                toast.error(res.message || "No se pudo eliminar");
            }
        } catch (err) {
            console.log(err)
            toast.error("Error eliminando documento");
        }
    };

    if (loading || !docleg)
        return (
            <div className="bg-white p-6 rounded-lg shadow w-[500px] text-center">
                Cargando...
            </div>
        );

    const bloqueo = docleg.dtra_falso === "t" || docleg.dtra_obs !== null;

    return (
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">

            {/* HEADER */}
            <div className="bg-red-600 text-white p-4 flex justify-between items-center">
                <h3 className="text-xl  font-semibold flex items-center">
                    <XCircle  className="w-6 mr-2" />
                    Eliminar Trámite
                </h3>
                <X className="cursor-pointer" onClick={onClose} />
            </div>

            {/* BODY */}
            <div className="p-6 text-sm">

                <p className="italic mb-4 text-gray-700 text-base">
                    ¿Está seguro de eliminar el trámite de legalización?
                </p>

                <div className="border border-red-400 bg-red-100 text-red-800 rounded p-4 shadow">

                    {bloqueo ? (
                        <p className="text-center font-bold">
                            No puede eliminar este trámite
                        </p>
                    ) : (
                        <table className="w-full text-base">
                            <tbody>
                                <tr>
                                    <td className="font-bold text-right pr-2">Nombre trámite:</td>
                                    <td className="font-bold border-b border-red-600 text-gray-600 pl-2">
                                        {docleg.tre_nombre}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="font-bold text-right pr-2">Nro. título:</td>
                                    <td className="font-bold border-b border-red-600 text-gray-600 pl-2">
                                        {docleg.dtra_numero} / {docleg.dtra_gestion}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="font-bold text-right pr-2">Interesado:</td>
                                    <td className="font-bold border-b border-red-600 text-gray-600 pl-2">
                                        {persona?.per_apellido} {persona?.per_nombre}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>

                <p className="text-sm text-red-700 italic mt-4 border border-red-400 rounded p-2">
                    * Esta acción quedará registrada en el sistema.
                </p>
            </div>

            {/* FOOTER */}
            <div className="p-4 border-t border-gray-300 flex justify-end gap-3">
                <button
                    className="bg-gray-500 px-4 py-1 rounded text-white hover:bg-gray-600 cursor-pointer"
                    onClick={onClose}
                >
                    Cancelar
                </button>

                {!bloqueo && (
                    <button
                        className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 cursor-pointer"
                        onClick={handleEliminar}
                    >
                        Eliminar
                    </button>
                )}
            </div>
        </div>
    );
}

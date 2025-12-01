import React, { useEffect, useState } from "react";
import { X, BookText } from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";
import { useModal } from "../../hooks/useModal";
import useDocleg from "../../hooks/useDocLeg";
import { toast } from "../../utils/toast";

export default function GlosaLegalizacionModal({ doc }) {
    const { closeModal } = useModal();
    const { getGlosaData, elegirModelo, guardarGlosa, generarPDF } = useDocleg();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [glosa, setGlosa] = useState("");
    const [posicion, setPosicion] = useState("2"); // por defecto "mediano"

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await getGlosaData(doc.cod_dtra);
            if (res.success) {
                setData(res.data);
                setGlosa(res.data.docleg.dtra_glosa);
            }
        } catch (err) {
            toast.error("Error cargando datos de glosa");
        }
        setLoading(false);
    };

    const handleSaveGlosa = async () => {
        const res = await guardarGlosa({
            cdtra: doc.cod_dtra,
            ctra: data.tramita.cod_tra,
            glosa,
            posicion
        });

        if (res.success) {
            toast.success("Glosa guardada");
            closeModal();
        } else {
            toast.error("Error al guardar");
        }
    };

    const handleGenerarPDF = async () => {
        await handleSaveGlosa(); // guarda primero
        generarPDF(doc.cod_dtra); // abre nueva ventana
    };

    const handleElegirModelo = async (cod_glo) => {
        const res = await elegirModelo(cod_glo, doc.cod_dtra);
        if (res.success) {
            setGlosa(res.data);
            toast.success("Modelo aplicado");
        }
    };

    if (loading || !data) return <div className="p-4">Cargando…</div>;

    const { persona, tramite, tramita, apoderado, glosas, docleg } = data;

    return (
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto">
            
            {/* HEADER */}
            <div className="bg-green-700 text-white p-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold flex items-center">
                    <BookText size={26} className="mr-3" /> Glosa de Legalización
                </h3>
                <X size={24} className="cursor-pointer" onClick={closeModal} />
            </div>

            {/* BODY */}
            <div className="p-6">
                {docleg.dtra_falso === "t" ? (
                    <div className="border border-red-500 p-4 text-red-600 font-bold text-center">
                        * El trámite está bloqueado, no se puede generar una glosa
                    </div>
                ) : (
                    <div className="grid grid-cols-12 gap-6">

                        {/* LADO IZQUIERDO */}
                        <div className="col-span-4 text-sm">

                            <div className="border p-3 rounded shadow-sm">
                                <h4 className="text-blue-600 font-bold text-center mb-2">Datos Personales</h4>

                                <table className="w-full text-xs">
                                    <tbody>
                                        <tr>
                                            <td className="font-semibold">Nombre :</td>
                                            <td>{persona.per_apellido} {persona.per_nombre}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">CI :</td>
                                            <td>{persona.per_ci}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">Trámite :</td>
                                            <td>{tramite.tre_nombre}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold">Fecha :</td>
                                            <td>{tramita.tra_fecha_solicitud_literal}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {apoderado && (
                                <div className="border p-3 rounded shadow-sm mt-4">
                                    <h4 className="text-blue-600 font-bold text-center mb-2">Apoderado</h4>

                                    <table className="w-full text-xs">
                                        <tbody>
                                            <tr>
                                                <td className="font-semibold">Nombre :</td>
                                                <td>{apoderado.apo_apellido} {apoderado.apo_nombre}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-semibold">CI :</td>
                                                <td>{apoderado.apo_ci}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {glosas.length > 0 && (
                                <div className="border p-3 rounded shadow-sm mt-4">
                                    <h4 className="text-blue-600 font-bold text-center mb-2">Modelos de Glosa</h4>

                                    <table className="w-full text-xs">
                                        <tbody>
                                            {glosas.map((g) => (
                                                <tr
                                                    key={g.cod_glo}
                                                    className={g.cod_glo === docleg.dtra_cod_glosa ? "bg-red-100" : ""}
                                                >
                                                    <td>{g.glo_titulo}</td>
                                                    <td className="text-right">
                                                        <button
                                                            className="text-blue-600 hover:text-blue-800"
                                                            onClick={() => handleElegirModelo(g.cod_glo)}
                                                        >
                                                            Seleccionar →
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* LADO DERECHO - EDITOR */}
                        <div className="col-span-8 border rounded shadow-sm p-4">

                            <h4 className="font-bold">{docleg.dtra_titulo}</h4>
                            <p className="font-semibold italic">
                                ARCH {docleg.dtra_numero_tramite}/{docleg.dtra_gestion_tramite}
                            </p>

                            <Editor
                            
                                // 🚨 ¡CLAVE PARA SELF-HOSTING! 
                                tinymceScriptSrc="/tinymce/js/tinymce/tinymce.min.js"  
                                value={glosa}
                                init={{
                                    height: 350,
                                    menubar: false,
                                    plugins: "lists link",
                                    toolbar:
                                        "bold italic underline | alignleft aligncenter alignright | bullist numlist",
                                     license_key: 'gpl',
                                }}
                                onEditorChange={setGlosa}
                            />

                            <div className="text-right mt-2 text-gray-600">
                                {docleg.dtra_fecha_literal}
                            </div>

                            <div className="mt-4">
                                <h5 className="font-bold">Imprimir en:</h5>
                                <div className="flex items-center gap-4 mt-1">
                                    {[0,1,2,3,4].map(p => (
                                        <label key={p} className="flex items-center gap-1">
                                            <input
                                                type="radio"
                                                checked={posicion == p}
                                                value={p}
                                                onChange={(e) => setPosicion(e.target.value)}
                                            />
                                            <span>{["Inicio","Superior","Medio","Inferior","Final"][p]}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* FOOTER */}
            <div className="p-4 border-t flex justify-end gap-3">
                <button
                    className="bg-gray-300 px-4 py-1 rounded"
                    onClick={closeModal}
                >
                    Cerrar
                </button>

                {docleg.dtra_falso !== "t" && (
                    <button
                        className="bg-blue-600 text-white px-4 py-1 rounded"
                        onClick={handleGenerarPDF}
                    >
                        Generar PDF
                    </button>
                )}
            </div>
        </div>
    );
}

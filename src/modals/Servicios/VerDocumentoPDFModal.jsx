import React, { useEffect, useState } from "react";
import { X, Eye } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import useDocleg from "../../hooks/useDocLeg";
import { toast } from "../../utils/toast";
import { TIPO_DOCUMENTO } from "../../Constants/tramiteDatos";

// convierte "2022-03-31" → "31/03/2022"
const formatFecha = (f) => {
    if (!f) return "";
    const d = new Date(f);
    return d.toLocaleDateString("es-BO");
};

export default function ModalVerDocumentoPDF({ cod_dtra }) {
    const { closeModal } = useModal();
    const { verDocumentoPDF } = useDocleg();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [showAntecedentes, setShowAntecedentes] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await verDocumentoPDF(cod_dtra);
            console.log(res)
            if (res.statusText=="OK") {
                setData(res.data);
            } else {
                toast.error("No se pudo cargar el documento.");
            }
        } catch (err) {
            console.log(err)
            toast.error("Error en la solicitud.");
        }
        setLoading(false);
    };

    if (loading || !data) return <div className="p-4">Cargando…</div>;

    const { docleg, titulo, diploma_academico, revalida } = data;

    const existeTitulo = docleg.dtra_cod_tit !== 0 && titulo.length > 0;

    // si no existe, mostramos mensaje igual que el Blade
    if (!existeTitulo) {
        return (
            <div className="bg-white rounded-lg p-10 text-center text-red-600 font-bold text-lg shadow-xl">
                No existe el Título registrado en la base de datos
                <div className="mt-6">
                    <button
                        onClick={closeModal}
                        className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        );
    }

    const t = titulo[0]; // único elemento

    return (
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">

            {/* HEADER */}
            <div className="bg-blue-700 text-white p-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold flex items-center">
                    <Eye size={26} className="mr-3" /> Título
                </h3>
                <X size={24} className="cursor-pointer" onClick={closeModal} />
            </div>

            {/* BODY */}
            <div className="p-6">

                {/* Título Detalle */}
                <div className="bg-blue-600 text-white px-4 py-1 rounded shadow w-1/2 mx-auto text-center text-lg">
                    Detalle del título
                </div>

                <hr className="my-4 border-gray-300" />

                <div className="grid grid-cols-12 gap-6">

                    {/* IZQUIERDA – DATOS */}
                    <div className="col-span-4 border border-gray-300 p-2 rounded shadow-sm text-sm">

                        <table className="w-full text-xs">
                            <tbody>

                                {/* Datos personales */}
                                <tr>
                                    <th colSpan={2} className="text-center text-blue-600 font-bold pb-2 text-sm">
                                        DATOS PERSONALES
                                    </th>
                                </tr>

                                <tr>
                                    <td className="font-semibold text-right text-sm text-gray-800">Nombre:</td>
                                    <td className="border-b border-gray-500 text-gray-600 pl-2 text-sm">
                                        {t.per_apellido} {t.per_nombre}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="font-semibold text-right text-sm text-gray-800">CI:</td>
                                    <td className="border-b border-gray-500 text-gray-600 pl-2 text-sm">{t.per_ci}</td>
                                </tr>

                                <tr>
                                    <td className="font-semibold text-right text-sm text-gray-800">Pasaporte:</td>
                                    <td className="border-b border-gray-500 text-gray-600 pl-2 text-sm">{t.per_pasaporte}</td>
                                </tr>

                                <tr>
                                    <td className="font-semibold text-right text-sm text-gray-800">Sexo:</td>
                                    <td className="border-b border-gray-500 text-gray-600 pl-2 text-sm">{t.per_sexo}</td>
                                </tr>

                                <tr>
                                    <td className="font-semibold text-right text-sm text-gray-800">Nacionalidad:</td>
                                    <td className="border-b border-gray-500 text-gray-600 pl-2 text-sm">{t.nac_nombre}</td>
                                </tr>

                                {/* Datos del título */}
                                <tr>
                                    <th colSpan={2} className="text-center text-blue-600 font-bold py-2 text-sm">
                                        DATOS DEL TÍTULO
                                    </th>
                                </tr>

                                <tr>
                                    <td className="font-semibold text-right text-sm text-gray-800">Tipo de documento:</td>
                                    <td className="border-b border-gray-500 text-gray-600 pl-2 text-sm">{TIPO_DOCUMENTO[t.tit_tipo]}</td>
                                </tr>

                                <tr>
                                    <td className="font-semibold text-right text-sm text-gray-800">N° Título:</td>
                                    <td className="border-b border-gray-500 text-gray-600 pl-2 text-sm">{t.tit_nro_titulo}</td>
                                </tr>

                                <tr>
                                    <td className="font-semibold text-right text-sm text-gray-800">Fecha emisión:</td>
                                    <td className="border-b border-gray-500 text-gray-600 pl-2 text-sm">
                                        {formatFecha(t.tit_fecha_emision)}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="font-semibold text-right text-sm text-gray-800">N° Tomo:</td>
                                    <td className="border-b border-gray-500 text-gray-600 pl-2 text-sm">{t.tom_numero}</td>
                                </tr>

                                <tr>
                                    <td className="font-semibold text-right text-sm text-gray-800">N° Folio:</td>
                                    <td className="border-b border-gray-500 text-gray-600 pl-2 text-sm">
                                        {t.tit_nro_folio}
                                        <span className="ml-2 text-blue-700 font-bold ">Fecha:</span>
                                        {formatFecha(t.tit_fecha_folio)}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="font-semibold text-right text-sm text-gray-800">Gestión:</td>
                                    <td className="border-b border-gray-500 text-gray-600 pl-2 text-sm">{t.tom_gestion}</td>
                                </tr>

                                {t.tit_grado && (
                                    <tr>
                                        <td className="font-semibold text-right text-sm text-gray-800">Grado:</td>
                                        <td className="border-b border-gray-500 text-gray-600 pl-2 text-sm">{t.tit_grado}</td>
                                    </tr>
                                )}

                                {/* Diploma Académico */}
                                {diploma_academico.length > 0 && (
                                    <>
                                        <tr>
                                            <td className="font-semibold text-right text-sm text-gray-800">Carrera:</td>
                                            <td className="border-b border-gray-500 text-gray-600 pl-2 text-sm">
                                                {diploma_academico[0].car_nombre}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="font-semibold text-right text-sm text-gray-800">Facultad:</td>
                                            <td className="border-b border-gray-500 text-gray-600 pl-2 text-sm">
                                                {diploma_academico[0].fac_nombre}
                                            </td>
                                        </tr>
                                    </>
                                )}

                                {t.tit_ref && (
                                    <tr>
                                        <td className="font-semibold text-right text-sm text-gray-800">Referencia:</td>
                                        <td className="border-b border-gray-500 text-gray-600 pl-2 text-sm">{t.tit_ref}</td>
                                    </tr>
                                )}

                                {t.tit_titulo && (
                                    <tr>
                                        <td className="font-semibold text-right text-sm text-gray-800">Título:</td>
                                        <td className="border-b border-gray-500 text-gray-600 pl-2 text-sm">{t.tit_titulo}</td>
                                    </tr>
                                )}

                                {t.mod_nombre && (
                                    <tr>
                                        <td className="font-semibold text-right text-sm text-gray-800">Modalidad:</td>
                                        <td className="border-b border-gray-500 text-gray-600 pl-2 text-sm">{t.mod_nombre}</td>
                                    </tr>
                                )}

                                {/* Revalida */}
                                {revalida.length > 0 && (
                                    <>
                                        <tr>
                                            <th colSpan={2} className="text-center text-blue-600 font-bold py-2">
                                                DATOS DEL REVÁLIDA
                                            </th>
                                        </tr>

                                        <tr>
                                            <td className="font-semibold text-right text-sm text-gray-800">Universidad origen:</td>
                                            <td className="border-b border-gray-500 text-gray-600 pl-2 text-sm">
                                                {revalida[0].re_universidad}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="font-semibold text-right text-sm text-gray-800">País:</td>
                                            <td className="border-b border-gray-500 text-gray-600 pl-2 text-sm">{revalida[0].nac_nombre}</td>
                                        </tr>

                                        <tr>
                                            <td className="font-semibold text-right text-sm text-gray-800">Fecha doc.:</td>
                                            <td className="border-b border-gray-500 text-gray-600 pl-2 text-sm">
                                                {formatFecha(revalida[0].re_fecha)}
                                            </td>
                                        </tr>
                                    </>
                                )}

                            </tbody>
                        </table>
                    </div>

                    {/* DERECHA – PDF */}
                    <div className="col-span-8">

                        <h4 className="text-center text-blue-600 font-bold mb-2 text-lg">Título</h4>

                        {t.tit_pdf ? (
                            <embed
                                src={`/api/pdf/${t.cod_tit}#toolbar=0`}
                                className="w-full border rounded"
                                height="600"
                            />
                        ) : (
                            <div className="bg-red-100 text-red-700 p-2 rounded border border-red-400">
                                No existe el archivo digital
                            </div>
                        )}

                        <hr className="my-4 border-blue-500" />

                        {/* Antecedentes */}
                        <h4 className="text-center text-blue-600 font-bold mb-2 text-lg">Antecedentes</h4>

                        {t.tit_antecedentes ? (
                            <>
                                <button
                                    className="bg-gray-200 px-3 py-1 rounded shadow hover:bg-gray-300"
                                    onClick={() => setShowAntecedentes(!showAntecedentes)}
                                >
                                    Antecedentes {showAntecedentes ? "▲" : "▼"}
                                </button>

                                {showAntecedentes && (
                                    <div className="mt-4">
                                        <embed
                                            src={`/api/pdf-a/${t.cod_tit}#toolbar=0`}
                                            className="w-full border rounded"
                                            height="600"
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-red-100 text-red-700 p-2 rounded border border-red-400">
                                No existe el archivo digital
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="p-4 border-t border-gray-300 flex justify-end">
                <button className="bg-gray-500 px-4 py-1 rounded text-white hover:bg-gray-600 cursor-pointer" onClick={closeModal}>
                    Cerrar
                </button>
            </div>
        </div>
    );
}

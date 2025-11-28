import { useEffect, useState } from "react";
import useDocleg from "../../hooks/useDocLeg";
import { CircleCheck, CircleMinus } from "lucide-react";


export default function SitraModal({ cod_dtra, onClose }) {
    const { verificacionSitra } = useDocleg();
    const [data, setData] = useState(null);

    useEffect(() => {
        verificacionSitra(cod_dtra).then((res) => {
            setData(res);
            console.log(res)
        });
    }, [cod_dtra]);

    if (!data)
        return (
            <div className="bg-white p-6 rounded shadow w-full max-w-3xl">
                Cargando verificación...
            </div>
        );

    const { docleg, persona, respuesta } = data;

    const correcta = docleg.dtra_verificacion_sitra == 0;

    return (
        <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full">
            {/* HEADER ========================================================= */}
            <div
                className={`modal-header flex items-center justify-between p-4 rounded-t ${
                    correcta ? "bg-blue-700" : "bg-red-600"
                }`}
            >
                <h5 className="text-white text-lg font-bold flex items-center gap-2">
                    {correcta
                        ? <CircleCheck size={32} className="text-green-500" title="Verificado SITRA" />
                        :<CircleMinus size={32} className="text-red-500" title="No Verificado SITRA" />
                       }
                    Verificación en el SITRA
                </h5>

                <button className="text-white text-2xl cursor-pointer" onClick={onClose}>
                    ×
                </button>
            </div>

            {/* BODY =========================================================== */}
            <div className="modal-body p-6 text-base text-gray-700">
                <span className="italic">Verificación de trámite:</span>
                <br />
                <br />

                <span className="font-bold text-gray-800">Datos:</span>
                <br />

                <span className="italic text-gray-800 text-sm">
                    <span className="font-bold">Nombre :</span>{" "}
                    {persona.per_apellido + " " + persona.per_nombre} |
                    <span className="font-bold"> Nro. Título :</span>{" "}
                    {docleg.dtra_numero} |
                    <span className="font-bold"> Tipo Documento :</span>{" "}
                    {respuesta?.tipo_documento}
                </span>

                <br />
                <br />

                {/* RESULTADO SITRA ======================================= */}
                <div className="grid grid-cols-12 gap-2 items-center">
                    {correcta ? (
                        <>
                            {/* CAJA VERDE */}
                            <div className="col-span-9 bg-green-100 border border-green-600 shadow font-bold text-center p-4 ml-8 rounded">
                                <table className="w-full text-base">
                                    <tbody>
                                        <tr>
                                            <th className="text-right pr-3">Nombre:</th>
                                            <td className="border-b border-gray-400 pl-3 text-left">
                                                {respuesta.nombre}
                                            </td>
                                        </tr>

                                        <tr>
                                            <th className="text-right pr-3">Título:</th>
                                            <td className="border-b border-gray-400 pl-3 text-left">
                                                {respuesta.titulo}
                                            </td>
                                        </tr>

                                        <tr>
                                            <th className="text-right pr-3">Número:</th>
                                            <td className="border-b border-gray-400 pl-3 text-left">
                                                {respuesta.numero}
                                            </td>
                                        </tr>

                                        <tr>
                                            <th className="text-right pr-3">Gestión:</th>
                                            <td className="border-b border-gray-400 pl-3 text-left">
                                                {respuesta.gestion}
                                            </td>
                                        </tr>

                                        <tr>
                                            <th className="text-right pr-3">Tipo documento:</th>
                                            <td className="border-b border-gray-400 pl-3 text-left">
                                                {respuesta.tipo}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* ICONO CHECK */}
                            <div className="col-span-3 text-green-600 text-left">
                                <h1 className="text-6xl">
                                    <CircleCheck size={48} className=""/>
                                </h1>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* CAJA ROJA */}
                            <div className="col-span-9 bg-red-100 border border-red-600 shadow font-bold text-center p-4 rounded">
                                No se encuentra el documento registrado en el Sistema SITRA
                            </div>

                            {/* ICONO ERROR */}
                            <div className="col-span-3 text-red-600">
                                <h1 className="text-6xl">
                                    <i className="fas fa-minus-circle"></i>
                                </h1>
                            </div>
                        </>
                    )}
                </div>

                <br />

                {/* PIE RESULTADO ========================================== */}
                <div
                    className={`font-bold italic border rounded p-1 text-center w-60 ${
                        correcta
                            ? "text-green-700 border-green-700"
                            : "text-red-600 border-red-600"
                    }`}
                    style={{ fontSize: "1.2em" }}
                >
                    {correcta ? "Verificación Correcta" : "INCORRECTO"}
                </div>
            </div>

            {/* FOOTER ======================================================== */}
            <div className="modal-footer bg-gray-100 p-3 flex justify-end rounded-b">
                <button
                    className="px-4 py-2 bg-gray-500 text-white rounded cursor-pointer"
                    onClick={onClose}
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}

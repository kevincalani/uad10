import React from 'react';
import {
    X, CircleCheck, CircleMinus,
    Trash2, Eye, FilePenLine, FileCode,
    ArrowLeftCircle
} from 'lucide-react';
import { useModal } from '../hooks/useModal';
import SitraModal from '../modals/servicios/SitraModal';
import ObservarTramiteModal from '../modals/Servicios/ObservarTramiteModal';
import GlosaLegalizacionModal from '../modals/Servicios/GlosaLegalizacionModal';
import VerDocumentoPDFModal from '../modals/Servicios/VerDocumentoPDFModal';

export default function DocumentoRow({
    doc,
    index,
    onCambiarDestino,
    tramiteTipo,
    confrontacion,
    fetchData
}) {
    const { openModal } = useModal()
    // ---- ESTADO VISUAL EXACTO (Blade compatible) ----
    let rowBg = "bg-white hover:bg-gray-300";
    if (doc.dtra_falso === "t") rowBg = "bg-red-200 hover:bg-gray-300";
    else if (doc.dtra_generado === "t") rowBg = "bg-green-200 hover:bg-gray-300";

    // ---- Nombre + indicador interno ----
    const displayNombre = (
        <>
            {doc.tre_nombre}{" "}
            {doc.dtra_interno === "t" && (
                <span className="text-red-600 font-semibold">(Int.)</span>
            )}
        </>
    );

    // ---- N° tramite ----
    const numeroTramiteDisplay = `${doc.dtra_numero_tramite} / ${doc.dtra_gestion_tramite}`;

    // ---- N° titulo ----
    const numeroTituloDisplay =
        doc.dtra_numero === "0"
            ? `-/ ${String(doc.dtra_gestion).slice(-2)}`
            : `${doc.dtra_numero}/${String(doc.dtra_gestion).slice(-2)}`;

    // ---- CAMPOS SEGÚN TIPO DE TRÁMITE ----
    let campoEspecifico = null;

    if (tramiteTipo === "B") {
        const docsRelacionados = confrontacion.filter(
            (c) => c.cod_dtra === doc.cod_dtra
        );

        campoEspecifico = (
            <td className="px-2 py-1 text-xs text-gray-700">
                {docsRelacionados.length === 0
                    ? "-"
                    : docsRelacionados.map((c, i) => (
                          <div key={i} className="font-semibold italic">
                              {c.dcon_doc}
                          </div>
                      ))}
            </td>
        );
    }

    if (tramiteTipo === "F") {
        campoEspecifico = (
            <td className="px-2 py-1 text-xs text-gray-700">
                {confrontacion.map((c, i) => (
                    <div key={i} className="font-semibold italic">
                        {c.dcon_doc}
                    </div>
                ))}
            </td>
        );
    }

    if (!["B", "F"].includes(tramiteTipo)) {
        campoEspecifico = (
            <td className="px-2 py-1 text-xs">
                {numeroTituloDisplay}
            </td>
        );
    }

    // ---- BOTONES SEGÚN ESTADO ----
    const botones = [
        // ------------------ INT / EXT ------------------
        {
            key: "destino",
            label: doc.dtra_interno === "f" ? "EXT" : "INT",
            className:
                doc.dtra_interno === "f"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700",
            onClick: () => onCambiarDestino(doc.cod_dtra),
            hidden: doc.dtra_generado === "t"
        },
        // ----------------- Corregir Tramite ----------------
        {
            key: "corregir tramite",
            icon: <ArrowLeftCircle size={16} className='text-blue-600'/>,
            onClick: () => openModal("corregir tramite", doc),
            hidden: doc.dtra_generado === ""
        },
        // ------------------ Observaciones ------------------
        {
            key: "observar",
            icon: <Eye size={16} />,
            className:
                doc.dtra_obs || doc.dtra_falso === "t"
                    ? "text-red-600 hover:text-red-800"
                    : "text-blue-500 hover:text-blue-700",
            title: "Observaciones",
            onClick: () =>
                openModal(ObservarTramiteModal, {
                    cod_dtra: doc.cod_dtra,
                    fetchData // 🔥 para refrescar la tabla después de guardar
                }), 
            hidden: doc.dtra_generado === "t"
        },

        // ------------------ Generar glosa ------------------
        {
            key: "glosa",
            icon: <FilePenLine size={16} />,
            title: "Generar glosa",
            onClick: () => 
                openModal(GlosaLegalizacionModal, {
                    doc
                }),
            hidden: doc.dtra_generado === "t"
        },

        // ------------------ Ver PDF ------------------
        {
            key: "pdf",
            icon: <FileCode size={16} className="text-blue-600" />,
            title: "Ver Documento PDF",
            onClick: () => openModal(VerDocumentoPDFModal, {
                cod_dtra:doc.cod_dtra
            }),
            hidden: false
        },

        

        // ------------------ Eliminar ------------------
        {
            key: "eliminar",
            icon: <Trash2 size={16} className="text-red-500" />,
            title: "Eliminar",
            onClick: () => openModal("delete", doc)
        }
    ].filter((b) => !b.hidden);

    return (
        <tr className={`${rowBg} `}>
            <td className="px-2 py-1 text-xs">{index + 1}</td>

            <td className="px-2 py-1 text-xs">
                <button

                        className="px-1 bg-white rounded-full shadow-md hover:bg-gray-300 transition text-xs cursor-pointer"
                        onClick={() =>
                            openModal(SitraModal,{
                                cod_dtra:doc.cod_dtra
                            })
                        }
                    >
                    {doc.dtra_verificacion_sitra==0
                    ? <CircleCheck size={16} className="text-green-500" title="Verificado SITRA" />
                    : doc.dtra_verificacion_sitra==2
                    ?<CircleMinus size={16} className="text-red-500" title="No Verificado SITRA" />
                    :<></>}
                </button>
            </td>

            <td className="px-2 py-1 text-xs">{displayNombre}</td>

            <td className="px-2 py-1 text-xs">{numeroTramiteDisplay}</td>

            {campoEspecifico}

            <td className="px-2 py-1 text-xs space-x-1 ">
                <div className='flex justify-center items-end flex-wrap'>
                {botones.map((b) => (
                    <button
                        key={b.key}
                        className={`p-2 mx-0.5 bg-white rounded-full shadow-md hover:bg-gray-300 transition cursor-pointer ${b.className ?? ""}`}
                        onClick={b.onClick}
                        title={b.title}
                    >
                        {b.icon ?? b.label}
                    </button>
                ))}
                </div>
            </td>
        </tr>
    );
}

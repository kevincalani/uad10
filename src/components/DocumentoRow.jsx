import React from 'react';
import {
    X, CircleCheck, CircleMinus,
    Trash2, Eye, FilePenLine, FileCode
} from 'lucide-react';
import { useModal } from '../hooks/useModal';
import SitraModal from '../modals/servicios/SitraModal';


export default function DocumentoRow({
    doc,
    index,
    onCambiarDestino,
    tramiteTipo,
    confrontacion
}) {
    const { openModal } = useModal()
    // ---- ESTADO VISUAL EXACTO (Blade compatible) ----
    let rowBg = "bg-white";
    if (doc.dtra_falso === "t") rowBg = "bg-red-200";
    else if (doc.dtra_generado === "t") rowBg = "bg-green-200";

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
            <td className="px-2 py-1 text-xs text-gray-500">
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
            onClick: () => onCambiarDestino(doc.cod_dtra)
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
            onClick: () => openModal("observaciones", doc)
        },

        // ------------------ Generar glosa ------------------
        {
            key: "glosa",
            icon: <FilePenLine size={16} />,
            title: "Generar glosa",
            onClick: () => openModal("glosa", doc),
            hidden: doc.dtra_generado === "t"
        },

        // ------------------ Ver PDF ------------------
        {
            key: "pdf",
            icon: <FileCode size={16} className="text-blue-600" />,
            title: "Ver PDF",
            onClick: () => openModal("pdf", doc),
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
        <tr className={`${rowBg} border-b`}>
            <td className="px-2 py-1 text-xs">{index + 1}</td>

            <td className="px-2 py-1 text-xs">
                <button

                        className="px-1 rounded transition text-xs cursor-pointer"
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

            <td className="px-2 py-1 text-xs space-x-1 flex flex-nowrap">
                {botones.map((b) => (
                    <button
                        key={b.key}
                        className={`px-1 rounded transition text-xs ${b.className ?? ""}`}
                        onClick={b.onClick}
                    >
                        {b.icon ?? b.label}
                    </button>
                ))}
            </td>
        </tr>
    );
}

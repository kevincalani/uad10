import React from 'react';
import {
    CircleCheck, CircleMinus, Trash2, Eye, FilePenLine, 
    FileCode, ArrowLeftCircle, FileText
} from 'lucide-react';
import { useModal } from '../hooks/useModal';
import SitraModal from '../modals/servicios/SitraModal';
import ObservarTramiteModal from '../modals/servicios/ObservarTramiteModal';
import GlosaLegalizacionModal from '../modals/servicios/GlosaLegalizacionModal';
import VerDocumentoPDFModal from '../modals/servicios/VerDocumentoPDFModal';
import EliminarDoclegModal from '../modals/servicios/EliminarDocLegModal';
import VerGlosaModal from '../modals/servicios/VerGlosaModal';
import CorregirDoclegModal from '../modals/servicios/CorregirDocLegModal';
import RegistrarBusquedaModal from '../modals/servicios/RegistrarBusquedaModal';

export default function DocumentoRow({
    doc,
    index,
    onCambiarDestino,
    tramiteTipo,
    confrontacion,
    fetchData
}) {
    const { openModal } = useModal();

    // ---- ESTADO VISUAL (Blade compatible) ----
    let rowBg = "bg-white hover:bg-gray-300";
    if (doc.dtra_falso === "t") rowBg = "bg-red-100 hover:bg-red-300";
    else if (doc.dtra_generado === "t") rowBg = "bg-green-100 hover:bg-green-300";

    // ---- Nombre + indicador interno ----
    const displayNombre = (
        <>
            {doc.tre_nombre}{" "}
            {doc.dtra_interno === "t" && (
                <span className="text-red-600 font-bold">(Int.)</span>
            )}
        </>
    );

    // ---- N° tramite ----
    const numeroTramiteDisplay = `${doc.dtra_numero_tramite} / ${doc.dtra_gestion_tramite}`;

    // ---- N° titulo ----
    const numeroTituloDisplay =
        doc.dtra_numero === 0 || doc.dtra_numero === "0"
            ? `-/${String(doc.dtra_gestion).slice(-2)}`
            : `${doc.dtra_numero}/${String(doc.dtra_gestion).slice(-2)}`;

    // ---- Variables de control ----
    const esGenerado = doc.dtra_generado === 't';
    const esBusqueda = tramiteTipo === 'B';
    const esConfrontacion = tramiteTipo === 'F';
    const esLegalizacionOCertificacion = tramiteTipo === 'L' || tramiteTipo === 'C';
    const esSoloSello = doc.dtra_solo_sello === 't';
    const esBloqueado = doc.dtra_falso === 't';
    const tieneObservaciones = doc.dtra_obs && doc.dtra_obs !== '';

    // ---- CONSTRUCCIÓN DE BOTONES SEGÚN LÓGICA DEL BLADE ----
    const botones = [];

    if (esGenerado) {
        // === DOCUMENTO YA GENERADO ===
        
        // 1. Corregir trámite (deshacer generado)
        botones.push({
            key: "corregir",
            title: "Corregir trámite",
            icon: <ArrowLeftCircle size={16} className="text-blue-600" />,
            onClick: () => openModal(CorregirDoclegModal, {
                cod_dtra: doc.cod_dtra,
                onSuccess: fetchData
            })
        });

        // 2. Ver Glosa (PDF) - SOLO si NO es búsqueda
        if (!esBusqueda) {
            botones.push({
                key: "ver-glosa",
                title: "Ver Glosa",
                icon: <FileText size={16} className="text-gray-700" />,
                onClick: () => openModal(VerGlosaModal, {
                    cod_dtra: doc.cod_dtra,
                    onSuccess: fetchData
                })
            });
        }

        // 3. Ver documento PDF
        botones.push({
            key: "ver-pdf",
            title: "Ver documento PDF",
            icon: <FileCode size={16} className="text-blue-600" />,
            onClick: () => openModal(VerDocumentoPDFModal, {
                cod_dtra: doc.cod_dtra
            })
        });

    } else {
        // === DOCUMENTO AÚN NO GENERADO ===

        // 1. Cambiar destino (INT/EXT) - SOLO para L y C
        if (esLegalizacionOCertificacion) {
            botones.push({
                key: "destino",
                label: doc.dtra_interno === "t" ? "INT" : "EXT",
                className: doc.dtra_interno === "t"
                    ? "bg-red-100 text-red-700 font-bold"
                    : "bg-blue-100 text-blue-700 font-bold",
                onClick: () => onCambiarDestino(doc.cod_dtra),
                title: "Cambiar destino de trámite"
            });
        }

        // 2. Observaciones (siempre visible cuando no está generado)
        botones.push({
            key: "observar",
            title: "Observaciones",
            icon: <Eye size={16} />,
            className: (tieneObservaciones || esBloqueado)
                ? "text-red-600 hover:text-red-800"
                : "text-blue-600 hover:text-blue-800",
            onClick: () => openModal(ObservarTramiteModal, {
                cod_dtra: doc.cod_dtra,
                onSuccess: fetchData
            })
        });

        // --- SOLO SI NO ESTÁ BLOQUEADO (dtra_falso != 't') ---
        if (!esBloqueado) {
            // 3. Generar glosa O Registrar verificación
            if (esBusqueda || esSoloSello) {
                // Si es búsqueda o solo sello: Registrar verificación
                botones.push({
                    key: "registrar-verificacion",
                    title: "Registrar verificación",
                    icon: <FilePenLine size={16} className="text-gray-700" />,
                    onClick: () => openModal(RegistrarBusquedaModal, {
                        cod_dtra: doc.cod_dtra,
                        onSuccess: fetchData
                    })
                });
            } else {
                // Caso normal: Generar glosa
                botones.push({
                    key: "generar-glosa",
                    title: "Generar glosa",
                    icon: <FilePenLine size={16} className="text-gray-700" />,
                    onClick: () => openModal(GlosaLegalizacionModal, {
                        cod_dtra: doc.cod_dtra,
                        onSuccess: fetchData
                    })
                });
            }

            // 4. Ver documento PDF - SOLO si dtra_tipo != 'E'
            if (doc.dtra_tipo !== 'E') {
                botones.push({
                    key: "ver-pdf",
                    title: "Ver documento PDF",
                    icon: <FileCode size={16} className="text-blue-600" />,
                    onClick: () => openModal(VerDocumentoPDFModal, {
                        cod_dtra: doc.cod_dtra
                    })
                });
            }

            // 5. Eliminar
            botones.push({
                key: "eliminar",
                title: "Eliminar",
                icon: <Trash2 size={16} className="text-red-500" />,
                onClick: () => openModal(EliminarDoclegModal, {
                    cod_dtra: doc.cod_dtra,
                    onSuccess: fetchData
                })
            });
        }
    }

    return (
        <tr className={rowBg}>
            {/* 1. N° */}
            <td className="px-2 py-1 text-xs text-center">{index + 1}</td>

            {/* 2. SITRA */}
            <td className="px-2 py-1 text-xs text-center">
                {doc.dtra_verificacion_sitra !== null && doc.dtra_verificacion_sitra !== "" && (
                    <button
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-200 transition"
                        onClick={() => openModal(SitraModal, {
                            cod_dtra: doc.cod_dtra
                        })}
                        title={doc.dtra_verificacion_sitra === 0 || doc.dtra_verificacion_sitra === "0" 
                            ? "Verificado en SITRA" 
                            : "No existe en SITRA"}
                    >
                        {doc.dtra_verificacion_sitra === 0 || doc.dtra_verificacion_sitra === "0"
                            ? <CircleCheck size={16} className="text-green-500" />
                            : <CircleMinus size={16} className="text-red-500" />
                        }
                    </button>
                )}
            </td>

            {/* 3. Nombre */}
            <td className="px-2 py-1 text-xs text-left">{displayNombre}</td>

            {/* 4. Nro. Trámite */}
            <td className="px-2 py-1 text-xs text-center">{numeroTramiteDisplay}</td>

            {/* 5. DOCUMENTOS - Solo para Búsqueda (B) o Confrontación (F) */}
            {(esBusqueda || esConfrontacion) && (
                <td className="px-2 py-1 text-xs text-gray-700">
                    {confrontacion
                        .filter(c => c.cod_dtra === doc.cod_dtra)
                        .map((c, i) => (
                            <div key={i} className="font-bold italic">
                                {c.dcon_doc}
                            </div>
                        ))}
                    {confrontacion.filter(c => c.cod_dtra === doc.cod_dtra).length === 0 && "-"}
                </td>
            )}

            {/* 6. N° Título */}
            <td className="px-2 py-1 text-xs text-center">{numeroTituloDisplay}</td>

            {/* 7. Opciones */}
            <td className="px-2 py-1 text-xs">
                <div className="flex justify-center items-center flex-wrap gap-1">
                    {botones.map((b) => (
                        <button
                            key={b.key}
                            className={`p-2 bg-white rounded-full shadow-md hover:bg-gray-200 transition ${b.className ?? ""}`}
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
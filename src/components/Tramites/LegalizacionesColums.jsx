import { CircleArrowRight, Move, Pencil, Trash2 } from "lucide-react";
import { TRAMITE_COLORS, TIPO_TRAMITE } from "../../Constants/tramiteDatos";
import EditLegalizacionModal from "../../modals/EditLegalizacionModal";
import { useModal } from "../../hooks/useModal";
import CambiarTipoTramiteModal from "../../modals/servicios/tramitesLegalizacion/CambiarTipoTramiteModal";
import EntregaModal from "../../modals/servicios/entrega/EntregaModal";
import EliminarTramiteModal from "../../modals/servicios/EliminarTramiteModal";

export default function LegalizacionesColumns({
    setTramites,
    guardarDatosTramite,
    recargarTramites,
}) {
    const { openModal } = useModal();

    return [
        {
            header: "N°",
            accessorKey: "index",
            cell: ({ index }) => (
                <span className="font-bold text-blue-600">{index + 1}</span>
            ),
        },
        {
            header: "Tipo",
            accessorKey: "tra_tipo_tramite",
            cell: ({ row }) => {
                const tipo = TIPO_TRAMITE[row.tra_tipo_tramite];

                return (
                    <div className="flex items-center gap-2">
                        <span
                            className={`px-2 py-1 text-xs font-bold rounded text-white ${TRAMITE_COLORS[tipo]?.base || "bg-gray-500"
                                }`}
                        >
                            {tipo}
                        </span>
                        {row.tra_obs === "t" && (
                            <span className="text-red-500" title="Tiene observaciones">
                                ⚠️
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            header: "Número",
            accessorKey: "tra_numero",
            cell: ({ value }) => <span className="font-medium">{value}</span>,
        },
        {
            header: "CI",
            accessorKey: "per_ci",
            cell: ({ value }) => value || "-",
        },
        {
            header: "Nombre",
            accessorKey: "per_nombre",
            cell: ({ row }) => {
                const nombre = row.per_nombre ?? "";
                const apellido = row.per_apellido ?? "";
                const nombreCompleto = `${apellido} ${nombre}`.trim();

                // Indicador de apoderado
                let badge = null;
                if (row.tra_tipo_apoderado === "p") {
                    badge = (
                        <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                            Pod
                        </span>
                    );
                } else if (row.tra_tipo_apoderado === "d") {
                    badge = (
                        <span className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                            Dec
                        </span>
                    );
                }

                return (
                    <div className="flex items-center">
                        <span>{nombreCompleto || "-"}</span>
                        {badge}
                    </div>
                );
            },
        },
        {
            header: "FechaSolicitud",
            accessorKey: "tra_fecha_solicitud",
            cell: ({ value }) => value || "-",
        },
        {
            header: "Fecha Firma",
            accessorKey: "tra_fecha_firma",
            cell: ({ value }) => value || "-",
        },
        {
            header: "Fecha Recojo",
            accessorKey: "tra_fecha_recojo",
            cell: ({ value }) => value || "-",
        },
        {
            header: "Opciones",
            accessorKey: "acciones",
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {/* Editar trámite */}
                    <button
                        title="Insertar Datos Trámite"
                        className="p-2 bg-white rounded-full shadow-md text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                        onClick={() =>
                            openModal(EditLegalizacionModal, {
                                tramiteData: row,
                                setTramites,
                                guardarDatosTramite,
                                recargarTramites
                            })
                        }
                    >
                        <Pencil size={16} />
                    </button>{/* Cambiar tipo de trámite */}
                    <button
                        title="Cambiar Tipo de Trámite"
                        className="p-2 bg-white rounded-full shadow-md text-purple-600 hover:bg-purple-50 transition cursor-pointer"
                        onClick={() =>
                            openModal(CambiarTipoTramiteModal, {
                                cod_tra: row.cod_tra,
                                onSuccess: recargarTramites,
                            })
                        }
                    >
                        <Move size={16} />
                    </button>

                    {/* Eliminar trámite */}
                    <button
                        title="Eliminar Trámite"
                        className="p-2 bg-white rounded-full shadow-md text-red-600 hover:bg-red-50 transition cursor-pointer"
                        onClick={() => {
                            openModal(EliminarTramiteModal, {
                                cod_tra: row.cod_tra,
                                onSuccess: recargarTramites,
                            })
                        }}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
        {
            header: "Entrega",
            accessorKey: "entrega",
            cell: ({ row }) => {
                // Solo mostrar si tiene persona asociada
                if (!row.id_per) return null;

                return (
                    <button
                        title="Panel de Entrega"
                        className="p-2 bg-white rounded-full shadow-md text-green-600 hover:bg-green-50 transition cursor-pointer"
                        onClick={() => {
                            openModal(EntregaModal, {
                                cod_tra: row.cod_tra,
                                onSuccess: recargarTramites,
                            })
                        }}
                    >
                        <CircleArrowRight size={16} />
                    </button>
                );
            },
        },
    ];
}
import { CircleArrowRight, Move, Pencil, Trash2 } from "lucide-react";
import { TRAMITE_COLORS, TIPO_TRAMITE } from "../../Constants/tramiteDatos";
import EditLegalizacionModal from "../../modals/EditLegalizacionModal";
import { useModal } from "../../hooks/useModal";

export default function LegalizacionesColumns({setTramites,guardarDatosTramite}) {
    const { openModal } = useModal();

    return [
        {
            header: "N°",
            accessorKey: "index",
            cell: ({ index }) => index + 1,
        },
        {
            header: "Tipo",
            accessorKey: "tra_tipo_tramite",
            cell: ({ row }) => {
                const tipo = TIPO_TRAMITE[row.tra_tipo_tramite]; // ← convierte "L" → "Legalizacion"

                return (
                    <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${
                            TRAMITE_COLORS[tipo]?.base || "bg-gray-500"
                        }`}
                    >
                        {tipo}
                    </span>
                );
            },
        },
        {
            header: "Número",
            accessorKey: "tra_numero",
            cell: ({ value }) => value,
        },
        {
            header: "CI",
            accessorKey: "per_ci",
            cell: ({ value }) => value || "",
        },
        {
            header: "Nombre",
            accessorKey: "per_nombre",
            cell: ({ row }) => {
                const nombre = row.per_nombre ?? "";
                const apellido = row.per_apellido ?? "";
                return `${apellido} ${nombre}`.trim();
            }
        },
        {
            header: "Fecha Solicitud",
            accessorKey: "tra_fecha_solicitud",
            cell: ({ value }) => value || "",
        },
        {
            header: "Fecha Firma",
            accessorKey: "tra_fecha_firma",
            cell: ({ value }) => value || "",
        },
        {
            header: "Fecha Recojo",
            accessorKey: "tra_fecha_recojo",
            cell: ({ value }) => value || "",
        },
        {
            header: "Opciones",
            accessorKey: "acciones",
            cell: ({ row }) => (
                <div className="space-x-1 flex flex-nowrap">
                    <button
                        title="Insertar Datos Tramite"
                        className=" p-2 bg-white rounded-full shadow-md text-blue-600 hover:bg-gray-300 cursor-pointer"
                        onClick={() =>
                            openModal(EditLegalizacionModal, { 
                                tramiteData: row, 
                                setTramites,
                                guardarDatosTramite
                            })
                        
                        }
                    >
                        <Pencil size={16} />
                    </button>

                    <button className="p-2 bg-white rounded-full shadow-md text-purple-600 hover:bg-gray-300 cursor-pointer">
                        <Move size={16}/>
                    </button>
                    <button className="p-2 bg-white rounded-full shadow-md text-red-600 hover:bg-gray-300 cursor-pointer">
                        <Trash2 size={16}/>
                    </button>
                </div>
            ),
        },
        {
            header: "Entrega",
            accessorKey: "entrega",
            cell: () => (
                <button className="p-2 bg-white rounded-full shadow-md text-green-600 hover:bg-gray-300 cursor-pointer">
                    <CircleArrowRight size={16} />
                </button>
            ),
        },
    ];
}

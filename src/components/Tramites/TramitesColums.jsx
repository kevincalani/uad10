import React from "react";
import {
  SquarePen,
  TextAlignJustify,
  SquareCheck,
  SquareX,
  Trash2,
} from "lucide-react";
import { useModal } from "../../hooks/useModal";
import AddEditTramiteModal from "../../modals/AddEditTramiteModal";
import GlosaModal from "../../modals/GlosaModal";
import { TRAMITE_COLORS } from "../../Constants/tramiteDatos";
import DeleteTramiteModal from "../../modals/DeleteTramiteModal";

export const getTramiteColumns = ({
  refresh,
  onToggle,
  onDelete,
  glosasData,
  setGlosasData,
  onSubmit
}) => {
  const { openModal } = useModal();

  return [
    {
      accessorKey: "cod_tre",
      header: "N°",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "tre_tipo",
      header: "Tipo",
      cell: ({ getValue }) => {
        const tipo = getValue();
        const color = TRAMITE_COLORS[tipo]?.base || "bg-gray-400";
        return (
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${color}`}
          >
            {tipo.toUpperCase()}
          </span>
        );
      },
    },
    {
      accessorKey: "tre_nombre",
      header: "Nombre",
    },
    {
      accessorKey: "tre_numero_cuenta",
      header: "N° Cuenta",
    },
    {
      accessorKey: "tre_buscar_en",
      header: "Asociado",
      cell: ({ getValue }) => getValue().toUpperCase(),
    },
    {
      accessorKey: "tre_duracion",
      header: "Duración",
    },
    {
      accessorKey: "tre_costo",
      header: "Costo (Bs.)",
       cell: ({ getValue }) => {
        const costo = getValue();
        return `${costo} Bs.`; // Agrega "Bs." al lado del costo
      },
    },
    {
      id: "acciones",
      header: "Opciones",
      cell: ({ row }) => {
        const tramite = row.original;
        return (
          <div className="flex justify-center items-center ">
            <button
              title="Editar"
              className="bg-100 p-1 rounded-lg shadow-md hover:bg-gray-300 cursor-pointer"
              onClick={() =>
                openModal(AddEditTramiteModal, {
                  title: `Editar Trámite: ${tramite.tre_tipo}`,
                  type: tramite.tre_tipo,
                  initialData: tramite,
                  onSubmit: (formData) =>
                    onSubmit(formData, tramite.tre_tipo, tramite.cod_tre),
                  onSuccess: refresh,
                })
              }
            >
              <SquarePen className="w-4 h-4 text-blue-600 hover:text-blue-800 cursor-pointer" />
            </button>

            <button
              title="Glosa"
              className="bg-100 p-1 rounded-lg shadow-md hover:bg-gray-300 cursor-pointer"
              onClick={() =>
                openModal(GlosaModal, {
                  tramite,
                  glosasData,
                  setGlosasData,
                })
              }
            >
              <TextAlignJustify className="w-4 h-4 text-purple-600 hover:text-purple-800" />
            </button>

            <button
              title={tramite.tre_hab ? "Deshabilitar" : "Habilitar"}
              className="bg-100 p-1 rounded-lg shadow-md hover:bg-gray-300 cursor-pointer"
              onClick={() => onToggle(tramite.cod_tre)}
            >
              {tramite.tre_hab ? (
                <SquareCheck className="w-4 h-4 text-green-600 hover:text-green-800" />
              ) : (
                <SquareX className="w-4 h-4 text-red-600 hover:text-red-800" />
              )}
            </button>

            <button
              title="Eliminar"
              className="bg-100 p-1 rounded-lg shadow-md hover:bg-gray-300 cursor-pointer"
              onClick={() =>
                openModal(DeleteTramiteModal, {
                  itemData: tramite,
                  onConfirm: () => onDelete(tramite.cod_tre),
                })
              }
            >
              <Trash2 className="w-4 h-4 text-red-600 hover:text-red-800" />
            </button>
          </div>
        );
      },
    },
  ];
};

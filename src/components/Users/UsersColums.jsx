import { ArrowRight, UserCheck, UserLock } from "lucide-react";
import { useModal } from "../../Hooks/useModal";
import HabilitarUsuarioModal from "../../modals/HabilitarUsuarioModal";
import { useNavigate } from "react-router-dom";


export const getUserColumns = (isBlocked = false, refresh = () => {}) => {
  const {openModal} = useModal()
  const navigate =useNavigate()
    return [
    {
      accessorKey: "id",
      header: () => "N°",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "ci",
      header: () => "CI",
    },
    {
      accessorKey: "foto",
      header: () => "Foto",
      cell: ({ row }) => {
        const foto = row.original.foto;
        if (!foto) return null; // 👈 no renderiza nada si no hay foto
        const src = `http://localhost:8000/img/foto/${foto}`;
        return (
          <img
            src={src}
            alt="foto"
            className="w-10 h-10 rounded-full object-cover mx-auto"
          />
        );
      },
    },
    {
      accessorKey: "name",
      header: () => "Nombre",
      cell: ({ getValue }) => (
        <span className="font-bold">{getValue()}</span>
      ),
    },
    {
      accessorKey: "cargo",
      header: () => "Cargo",
    },
    {
      accessorKey: "email",
      header: () => "Login",
    },
    {
      accessorKey: "rol",
      header: () => "Rol",
      cell: ({ getValue }) => (
        <span className="uppercase font-bold">{getValue()}</span>
      ),
    },
    {
      id: "acciones",
      header: () => "Opciones",
      cell: ({ row }) => {
        const usuario = row.original;
        return (
          <div className="flex items-center justify-center gap-2">
            <button
              size="sm"
              title="Habilitar/Deshabilitar"
              variant="outline"
              className="bg-100 p-1 rounded-lg shadow-md hover:bg-gray-200"
              onClick={() =>
                openModal(HabilitarUsuarioModal, {
                  usuario,
                  onSuccess: refresh,
                })
              }
            >
              {isBlocked ? (
                <UserLock className="h-4 w-4 text-red-500" />
              ) : (
                <UserCheck className="h-4 w-4 text-green-500" />
              )}
            </button>

            <button
              size="sm"
              title="Mostrar Usuario"
              variant="outline"
              className="bg-100 p-1 rounded-lg shadow-md hover:bg-gray-200"
              onClick={() =>
                navigate(`/usuarios/${usuario.id}/mostrar-usuario`, { state: { usuario } }) 
              }
            >
              <ArrowRight className="h-4 w-4 text-blue-500" />
            </button>
          </div>
       );
      },
    },
  ];
};
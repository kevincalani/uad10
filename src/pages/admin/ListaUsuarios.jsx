import React, { useState } from "react";
import { Users, UserPlus } from "lucide-react";
import UsersTable from "../../components/Users/UsersTable";
import { useUsers } from "../../Hooks/useUsers";
import { useModal } from "../../Hooks/useModal";
import NuevoUsuarioModal from "../../modals/NuevoUsuarioModal";


export default function ListaUsuarios() {
  const [isBlocked, setIsBlocked] = useState(false);
  const { data: users, loading, refetch} = useUsers(isBlocked ? "t" : "f");
  const {openModal,closeModal} =useModal()

  const abrirModalNuevoUsuario = () => {
    openModal(NuevoUsuarioModal, { onSuccess: refetch }); // 👈 pasamos refetch
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Título */}
      <div className="flex items-center gap-2 bg-blue-100 p-3 rounded-md mb-4">
        <Users className="text-blue-600" />
        <h1 className="text-lg font-semibold text-blue-700">
          {isBlocked ? "Lista de Usuarios Bloqueados" : "Lista de Usuarios"}
        </h1>
      </div>

      {/* Botones */}
      <div className="flex gap-2 mb-4">
        <button 
        onClick={abrirModalNuevoUsuario}
        className="flex items-center gap-2 border border-blue-500 text-gray-800 px-3 py-2 rounded-md hover:bg-blue-500 hover:text-white transition">
          <UserPlus size={18} />
          Nuevo Usuario
        </button>

        <button
          onClick={() => setIsBlocked(!isBlocked)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md border transition ${
            isBlocked
              ? "border-green-500 text-gray-800 hover:bg-green-500 hover:text-white"
              : "border-red-500 text-gray-800 hover:bg-red-500 hover:text-white"
          }`}
        >
          <UserPlus size={18} />
          {isBlocked ? "Usuarios Habilitados" : "Usuarios Bloqueados"}
        </button>
      </div>

      {/* Tabla */}
      {loading ? (
        <p className="text-center py-10 text-gray-500">Cargando usuarios...</p>
      ) : (
        <UsersTable users={users} isBlocked={isBlocked} refresh={refetch} />
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { toast } from '../../utils/toast';
import { usePermisos } from '../../Hooks/usePermisos';
import { useModal } from '../../Hooks/useModal';
import {
  BookText, List, ClipboardList, Landmark, FileInput, Users, UserLock, UserCheck, Settings, Package2, KeyRound
} from 'lucide-react';
import NuevoObjetoModal from '../../modals/NuevoObjetoModal';
import NuevoPermisoModal from '../../modals/NuevoPermisoModal';


export default function Permisos({ usuario }) {
  const id = usuario?.id;
  const nombre = usuario?.name;
  const [num, setNum] = useState(0);
  const {openModal} = useModal();

  const {
    permisos,
    objetos,
    permisosUsuario,
    listarPermisos,
    asignarPermiso,
    loading,
    error,
    subsistema
  } = usePermisos();

  useEffect(() => {
    if (id) listarPermisos(id, num);
  }, [id, num]);

  const procesarPermiso = async (permisoId, permisoName, isChecked) => {
    const permToastId = toast.info(`Procesando permiso: ${permisoName}...`);
    try {
      await asignarPermiso({ id, val: permisoName, check: isChecked }, id, num);
      toast.success(
        `Permiso ${isChecked ? 'asignado' : 'revocado'} correctamente.`,
        { id: permToastId }
      );
    } catch {
      toast.error('Error al procesar el permiso.', { id: permToastId });
    }
  };

  const subsistemas = [
    { num: 0, label: 'D y T', icon: BookText },
    { num: 1, label: 'RR - RCU', icon: List },
    { num: 6, label: 'RCF - RCC', icon: ClipboardList },
    { num: 2, label: 'SERVICIOS', icon: Landmark },
    { num: 3, label: 'APOSTILLA', icon: FileInput },
    { num: 4, label: 'D y A', icon: Users },
    { num: 7, label: 'NoA', icon: UserLock },
    { num: 8, label: 'CLAUSTROS', icon: UserCheck },
    { num: 5, label: 'ADM', icon: Settings },
  ];

  return (
    <div className="p-4 bg-white min-h-screen">
      {/* 🔹 Selector de subsistemas */}
      <div className="flex flex-wrap items-center justify-center sm:justify-between mb-6 gap-2">
        {subsistemas.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.num}
              onClick={() => setNum(item.num)}
              className={`flex flex-col items-center justify-center p-3 text-center rounded-lg shadow-xl transition duration-150 ease-in-out
                ${item.num === num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}
                flex-1 min-w-[80px] max-w-[120px] hover:scale-105`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <strong className="text-xs font-semibold">{item.label}</strong>
            </button>
          );
        })}
      </div>

      {/* 🔹 Barra de acciones */}
      <div className="flex items-center mb-4 border-b pb-4">
        <button
          className=" flex items-center gap-2 text-sm px-3 py-1 mr-2 text-gray-800 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition duration-150"
          onClick={() => openModal(NuevoObjetoModal, { subsistema })}
        >
            <Package2 className='w-5 h-5'/>
           Nuevo objeto
        </button>
        <button
          className=" flex items-center gap-2 text-sm px-3 py-1 mr-4 text-gray-800 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition duration-150"
          onClick={() => openModal(NuevoPermisoModal, { subsistema, objetos })}
        >
            <KeyRound className='w-5 h-5 ' />
           Nuevo permiso
        </button>

        <div className="h-6 w-px bg-gray-300 mx-3"></div>

        <span className="ml-auto text-sm text-gray-600">
          <span className="font-semibold text-gray-800">Usuario:</span>
          <span className="ml-1 text-blue-600 font-bold">{nombre}</span>
        </span>
      </div>

      {/* 🔹 Contenido principal */}
      {loading ? (
        <div className="text-center py-10 text-blue-600 font-semibold">
          Cargando permisos...
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 font-semibold border border-red-400 rounded-lg">
          {error}
        </div>
      ) : (
        <>
          <div className="bg-blue-600 p-2 w-full sm:w-1/3 md:w-2/4 rounded shadow-md mb-4 mx-auto">
            <h5 className="text-white text-center text-lg font-bold">
              Lista de permisos
            </h5>
          </div>

          {/* 🔹 Mostrar TODOS los permisos, agrupados por objeto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {objetos.map((o) => {
              const permisosDelObjeto = permisos.filter((p) => p.objeto === o.cod_obj);

              return (
                <div key={o.cod_obj} className="p-4 border border-gray-300 rounded-lg shadow-md h-full">
                  <h6 className="text-red-600 text-center font-bold border-b border-red-200 pb-2 mb-3 text-lg">
                    {o.obj_nombre}
                  </h6>

                  <div className="space-y-2">
                    {permisosDelObjeto.map((t) => {
                      const tienePermiso = permisosUsuario.some(pu => pu.permission_id === t.id);

                      return (
                        <div key={t.id} className="flex items-start">
                          <div className="flex-shrink-0 w-6 pt-1">
                            <input
                              id={`permiso-${t.id}`}
                              type="checkbox"
                              checked={tienePermiso}
                              onChange={(e) =>
                                procesarPermiso(t.id, t.name, e.target.checked)
                              }
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </div>
                          <label
                            htmlFor={`permiso-${t.id}`}
                            title={t.leyenda}
                            className="flex-1 text-sm font-light text-gray-700 italic ml-1 cursor-pointer hover:text-gray-900 break-words"
                          >
                            {t.leyenda}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

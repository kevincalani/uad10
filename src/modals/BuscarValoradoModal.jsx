// 📁 modals/BuscarValoradoModal.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "../utils/toast";
import { X } from "lucide-react";


export default function BuscarValoradoModal({ valorado, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!valorado) return;

    const fetchValorado = async () => {
      try {
        const res = await api.get(`/api/buscar-valorado/${valorado}`);
        setData(res.data.valorado);
      } catch (err) {
        toast.error("No se encontró ningún valorado");
        onClose();
      }
    };

    fetchValorado();
  }, [valorado]);

  if (!data) return null;

  // Campos procesados
  const nombreCompleto = `${data.per_apellido ?? ""} ${data.per_nombre ?? ""}`.trim();

  const nroTramite =
    data.dtra_numero_tramite && data.dtra_gestion_tramite
      ? `${data.dtra_numero_tramite} / ${data.dtra_gestion_tramite}`
      : "";

  const nroTitulo =
    data.dtra_numero && data.dtra_gestion
      ? `${data.dtra_numero} / ${data.dtra_gestion}`
      : "";

  return (
    <div className="bg-white rounded-md shadow-lg w-[90%] md:w-[900px]">

      {/* HEADER */}
      <div className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center rounded-t-md">
        <h2 className="text-xl font-semibold">Valorado</h2>

        <X
          className="text-white hover:text-gray-300 text-lg font-bold cursor-pointer"
          onClick={onClose}
        
          
        />
      </div>

      {/* TITULO CENTRAL */}
      <div className="flex justify-center mt-4 mb-3">
        <div className="bg-blue-600 text-white px-8 py-2 rounded">
          Datos de uso del valorado
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="px-10 py-4 text-sm border-y border-gray-300">
        <table className="w-full">

          {/* Nombre */}
          <tr >
            <td className="py-2 font-bold text-gray-700 text-right pr-3">
              Nombre:
            </td>
            <td className="py-2 border-b border-gray-300">{nombreCompleto}</td>
          </tr>

          {/* CI */}
          <tr >
            <td className="py-2 font-bold text-gray-700 text-right pr-3">CI:</td>
            <td className="py-2 border-b border-gray-300">{data.per_ci}</td>
          </tr>

          {/* Nombre trámite */}
          <tr >
            <td className="py-2 font-bold text-gray-700 text-right pr-3">
              Nombre trámite:
            </td>
            <td className="py-2 border-b border-gray-300">{data.tre_nombre}</td>
          </tr>

          {/* Nro. Trámite */}
          <tr >
            <td className="py-2 font-bold text-gray-700 text-right pr-3">
              Nro. Trámite:
            </td>
            <td className="py-2 border-b border-gray-300">{nroTramite}</td>
          </tr>

          {/* Nro. titulo */}
          <tr >
            <td className="py-2 font-bold text-gray-700 text-right pr-3">
              Nro. título:
            </td>
            <td className="py-2 border-b border-gray-300">{nroTitulo}</td>
          </tr>

          {/* Fecha solicitud */}
          <tr >
            <td className="py-2 font-bold text-gray-700 text-right pr-3">
              Fecha solicitud:
            </td>
            <td className="py-2 border-b border-gray-300">{data.tra_fecha_solicitud}</td>
          </tr>

          {/* Fecha recojo */}
          <tr >
            <td className="py-2 font-bold text-gray-700 text-right pr-3">
              Fecha recojo:
            </td>
            <td className="py-2 border-b border-gray-300">{data.dtra_fecha_recojo ?? ""}</td>
          </tr>
        </table>
      </div>

      {/* FOOTER */}
      <div className="flex justify-end px-6 py-3 bg-gray-100 rounded-b-md">
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md cursor-pointer"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

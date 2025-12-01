import React, { useEffect, useState } from "react";
import { BookText } from "lucide-react";
import TramiteActionButton from "../../components/TramiteActionButton";
import { useModal } from "../../hooks/useModal";
import AddEditTramiteModal from "../../modals/AddEditTramiteModal";
import GlosaModal from "../../modals/GlosaModal";
import DeleteConfirmModal from "../../modals/DeleteConfirmModal";
import TramitesTable from "../../components/Tramites/TramitesTable";
import api from "../../api/axios";
import {
  TIPO_TRAMITE,
  TIPO_TRAMITE_INVERTIDO,
} from "../../Constants/tramiteDatos";

export default function ConfigurarTramites() {
  const [tramites, setTramites] = useState([]);
  const { openModal } = useModal();

  const fetchTramites = async () => {
    try {
      const response = await api.get("/api/tramites");
      const dataObj = response.data.data;
      const tramitesArray = Object.values(dataObj);

      const mappedTramites = tramitesArray.map((t) => ({
        cod_tre: t.cod_tre,
        tre_nombre: t.tre_nombre,
        tre_tipo: TIPO_TRAMITE[t.tre_tipo] || "",
        tre_numero_cuenta: t.tre_numero_cuenta || "",
        tre_duracion: t.tre_duracion || "",
        tre_costo: t.tre_costo || "",
        tre_hab: t.tre_hab === "t",
        tre_buscar_en: t.tre_buscar_en || "",
        tre_titulo: t.tre_titulo || "",
        tre_titulo_interno: t.tre_titulo_interno || "",
        tre_glosa: t.tre_glosa || "",
        tre_desc: t.tre_desc || null,
        tre_solo_sello: t.tre_solo_sello || "",
      }));

      setTramites(mappedTramites);
    } catch (error) {
      console.error("Error al cargar trámites:", error);
      setTramites([]);
    }
  };

  useEffect(() => {
    fetchTramites();
  }, []);

  // --- Handlers principales ---
  const handleToggleHabilitar = async (id) => {
    try {
      await api.patch(`/api/tramite/toggle/${id}`);
      setTramites((prev) =>
        prev.map((t) =>
          t.cod_tre === id ? { ...t, tre_hab: !t.tre_hab } : t
        )
      );
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  const handleFormSubmit = async (formData, type, selectedTramiteId) => {
    try {
      const payload = {
        ct: selectedTramiteId || null,
        nombre: formData.tre_nombre,
        cuenta: formData.tre_numero_cuenta,
        costo: formData.tre_costo,
        duracion: formData.tre_duracion,
        buscar_en: formData.tre_buscar_en,
        desc: formData.tre_desc,
        titulo: formData.tre_titulo,
        titulo_interno: formData.tre_titulo_interno,
        sello: formData.tre_solo_sello ? "on" : "",
        tipo: TIPO_TRAMITE_INVERTIDO[type],
      };

      const response = await api.post("/api/tramite", payload);
      if (response.data.success) {
        await fetchTramites();
      } else {
        alert(response.data.message || "Error al guardar el trámite.");
      }
    } catch (error) {
      console.error("Error al guardar trámite:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete("/api/tramite", { data: { ct: id } });
      setTramites((prev) => prev.filter((t) => t.cod_tre !== id));
    } catch (error) {
      console.error("Error al eliminar trámite:", error);
    }
  };

  // --- Render principal ---
  return (
    <div className="p-6 bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        {/* Título */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
          <BookText className="mr-3 text-gray-800" size={32} />
          Configuración de Trámites
        </h1>

        {/* Botones para añadir */}
        <div className="flex flex-wrap gap-4 mb-8 justify-start">
          {Object.values(TIPO_TRAMITE).map((type) => (
            <TramiteActionButton
              key={type}
              type={type}
              onClick={() =>
                openModal(AddEditTramiteModal, {
                  title: `Añadir Trámite: ${type}`,
                  type,
                  onSubmit: (formData) => handleFormSubmit(formData, type),
                  onSuccess: fetchTramites,
                })
              }
            />
          ))}
        </div>

        {/* Tabla de trámites */}
        <TramitesTable
          tramites={tramites}
          refresh={fetchTramites}
          onToggle={handleToggleHabilitar}
          onDelete={handleDelete}
          onSubmit={handleFormSubmit}
        />
      </div>
    </div>
  );
}

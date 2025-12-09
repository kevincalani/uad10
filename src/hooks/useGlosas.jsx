import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

export function useGlosas(cod_tre, { autoFetch = true } = {}) {
  const [glosas, setGlosas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔁 Obtener glosas
  const fetchGlosas = useCallback(async () => {
    if (!cod_tre) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`/api/glosas/${cod_tre}`);
      setGlosas(res.data.data || []);
    } catch (err) {
      console.error("Error al obtener glosas:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [cod_tre]);

  // ➕ Crear glosa
  const addGlosa = async (formData) => {
    try {
      await api.post("/api/glosas", {
        ...formData,
        tramite_id: cod_tre,
        
      });
      await fetchGlosas();
    } catch (err) {
      console.error("Error al crear glosa:", err);
      setError(err);
    }
  };

  // ✏️ Actualizar glosa
  const updateGlosa = async (id, formData) => {
    try {
      await api.put(`/api/glosas/${id}`, formData);
      await fetchGlosas();
    } catch (err) {
      console.error("Error al actualizar glosa:", err);
      setError(err);
    }
  };

  // 🗑️ Eliminar glosa
  const deleteGlosa = async (id) => {
    try {
      await api.delete(`/api/glosas/${id}`);
      await fetchGlosas();
    } catch (err) {
      console.error("Error al eliminar glosa:", err);
      setError(err);
    }
  };

  // 🚀 Cargar al montar si corresponde
  useEffect(() => {
    if (autoFetch && cod_tre) fetchGlosas();
  }, [autoFetch, cod_tre, fetchGlosas]);

  return {
    glosas,
    loading,
    error,
    setGlosas,
    refresh: fetchGlosas,
    addGlosa,
    updateGlosa,
    deleteGlosa,
  };
}

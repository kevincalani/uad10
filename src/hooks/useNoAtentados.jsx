// 📁 hooks/useNoAtentado.jsx
import { useState } from 'react';
import api from '../api/axios';
import { toast } from '../utils/toast';

export const useNoAtentado = () => {
  const [loading, setLoading] = useState(false);
  const [candidatos, setCandidatos] = useState({});

  /**
   * Obtener lista de candidatos de un no-atentado
   */
  const obtenerCandidatos = async (cod_dtra) => {
    // Si ya tenemos los candidatos en cache, retornarlos
    if (candidatos[cod_dtra]) {
      return candidatos[cod_dtra];
    }

    setLoading(true);
    try {
      const response = await api.get(`/api/noatentado/lista-candidatos/${cod_dtra}`);
      
      if (response.data.success) {
        const data = response.data.data.candidatos;
        
        // Guardar en cache
        setCandidatos(prev => ({
          ...prev,
          [cod_dtra]: data
        }));
        
        return data;
      }
      
      return [];
    } catch (error) {
      console.error('Error al obtener candidatos:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formatear candidatos como texto (similar al blade original)
   */
  const formatearCandidatosTexto = (listaCandidatos) => {
    if (!listaCandidatos || listaCandidatos.length === 0) {
      return 'Sin candidatos';
    }

    return listaCandidatos
      .map(c => `${c.nombre_completo} - ${c.carg_nombre || 'Sin cargo'}`)
      .join(' | ');
  };

  /**
   * Limpiar cache de candidatos
   */
  const limpiarCache = () => {
    setCandidatos({});
  };

  return {
    loading,
    candidatos,
    obtenerCandidatos,
    formatearCandidatosTexto,
    limpiarCache
  };
};
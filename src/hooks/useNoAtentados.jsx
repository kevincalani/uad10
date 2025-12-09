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

  /**
   * 📋 ENTREGA: Obtener datos para formulario de entrega
   * GET /api/noatentado/form-entrega/{cod_dtra}
   */
  const obtenerDatosEntrega = async (cod_dtra) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/noatentado/form-entrega/${cod_dtra}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      
      toast.error('Error al cargar datos de entrega');
      return null;
    } catch (error) {
      console.error('Error al obtener datos de entrega:', error);
      toast.error('Error al cargar datos de entrega');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 💾 APODERADO: Guardar datos del apoderado
   * POST /api/noatentado/guardar-apoderado
   */
  const guardarApoderado = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post('/api/noatentado/guardar-apoderado', formData);
      
      if (response.data.success) {
        toast.success(response.data.message);
        return response.data.data;
      }
      
      toast.error('Error al guardar apoderado');
      return null;
    } catch (error) {
      console.error('Error al guardar apoderado:', error);
      const mensaje = error.response?.data?.message || 'Error al guardar apoderado';
      toast.error(mensaje);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ ENTREGA: Registrar entrega del trámite
   * POST /api/noatentado/guardar-entrega
   */
  const registrarEntrega = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post('/api/noatentado/guardar-entrega', formData);
      
      if (response.data.success) {
        toast.success(response.data.message);
        return response.data.data;
      }
      
      toast.error('Error al registrar entrega');
      return null;
    } catch (error) {
      console.error('Error al registrar entrega:', error);
      const mensaje = error.response?.data?.message || 'Error al registrar entrega';
      toast.error(mensaje);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔄 ENTREGA: Actualizar lista de entregas pendientes
   * GET /api/noatentado/actualizar-lista-entrega
   */
  const actualizarListaEntrega = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/noatentado/actualizar-lista-entrega');
      
      if (response.data.success) {
        return response.data.data.noatentado;
      }
      
      return [];
    } catch (error) {
      console.error('Error al actualizar lista:', error);
      toast.error('Error al actualizar lista de entregas');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * 📄 CONFIRMACIÓN: Obtener datos para confirmar entrega
   * GET /api/noatentado/form-confirmar-entrega/{cod_dtra}
   */
  const obtenerConfirmacionEntrega = async (cod_dtra) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/noatentado/form-confirmar-entrega/${cod_dtra}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      
      toast.error('Error al cargar confirmación de entrega');
      return null;
    } catch (error) {
      console.error('Error al obtener confirmación:', error);
      toast.error('Error al cargar confirmación de entrega');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    candidatos,
    obtenerCandidatos,
    formatearCandidatosTexto,
    limpiarCache,
    obtenerDatosEntrega,
    guardarApoderado,
    registrarEntrega,
    actualizarListaEntrega,
    obtenerConfirmacionEntrega,
  };
};
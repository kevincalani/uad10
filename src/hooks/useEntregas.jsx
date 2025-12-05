// 📁 hooks/useEntregas.jsx
import { useState } from 'react';
import api from '../api/axios';
import { toast } from '../utils/toast';

export const useEntregas = () => {
  const [loading, setLoading] = useState(false);
  const [entregas, setEntregas] = useState([]);
  const [noAtentado, setNoAtentado] = useState([]);
  const [panelEntrega, setPanelEntrega] = useState(null);

  /**
   * Obtener lista de entregas
   */
  const obtenerListaEntregas = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/lista-tramite-entrega');
      if (response.data.success) {
        setEntregas(response.data.data.l_entregas || []);
        setNoAtentado(response.data.data.noatentado || []);
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al obtener entregas:', error);
      toast.error('Error al cargar la lista de entregas');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar lista de entregas (AJAX)
   */
  const actualizarListaEntregas = async () => {
    try {
      const response = await api.get('/api/ltl-ajax-entrega');
      if (response.data.success) {
        setEntregas(response.data.data.l_entregas || []);
        return response.data.data.l_entregas;
      }
    } catch (error) {
      console.error('Error al actualizar entregas:', error);
    }
  };

  /**
   * Obtener panel de entrega (formulario)
   */
  const obtenerPanelEntrega = async (cod_tra) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/panel-entrega-legalizacion/${cod_tra}`);
      if (response.data.success) {
        setPanelEntrega(response.data.data);
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al obtener panel de entrega:', error);
      toast.error('Error al cargar datos de entrega');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener datos de confirmación de entrega
   */
  const obtenerDatosConfirmacion = async (varios, cod_dtra) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/datos-legalizado/${varios}/${cod_dtra}`);
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al obtener datos de confirmación:', error);
      toast.error('Error al cargar datos de confirmación');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Guardar entrega
   */
  const guardarEntrega = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post('/api/g-entrega', formData);
      if (response.data.success) {
        toast.success(response.data.message || 'Entrega registrada exitosamente');
        // Actualizar lista después de guardar
        await actualizarListaEntregas();
        return response.data;
      }
    } catch (error) {
      console.error('Error al guardar entrega:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al registrar la entrega');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    entregas,
    noAtentado,
    panelEntrega,
    obtenerListaEntregas,
    actualizarListaEntregas,
    obtenerPanelEntrega,
    obtenerDatosConfirmacion,
    guardarEntrega,
    setEntregas,
    setPanelEntrega
  };
};
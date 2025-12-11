import { useState, useCallback } from 'react';
import api from '../api/axios';

export function usePermisos() {
  const [permisos, setPermisos] = useState([]);
  const [objetos, setObjetos] = useState([]);
  const [permisosUsuario, setPermisosUsuario] = useState([]);
  const [subsistema, setSubsistema] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 📋 Listar permisos de un usuario y subsistema
   */
  const listarPermisos = useCallback(async (userId, num) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/api/permisos/listar/${userId}/${num}`);
      setPermisos(data.totalPermisos || []);
      setObjetos(data.objetos || []);
      setPermisosUsuario(data.permisosUsuario || []);
      setSubsistema(data.subsistema || '');
      return data;
    } catch (err) {
      console.error('❌ Error al listar permisos:', err);
      setError(err.response?.data?.error || 'Error al cargar permisos');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🆕 Crear nuevo permiso
   */
  const crearPermiso = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/api/permisos/guardar', payload);
      console.log('✅ Permiso creado:', data);
      return data;
    } catch (err) {
      console.error('❌ Error al crear permiso:', err);
      setError(err.response?.data?.error || 'Error al crear permiso');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🧱 Crear nuevo objeto
   */
  const crearObjeto = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/api/permisos/objeto', payload);
      console.log('✅ Objeto creado:', data);
      return data;
    } catch (err) {
      console.error('❌ Error al crear objeto:', err);
      setError(err.response?.data?.error || 'Error al crear objeto');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🔄 Asignar o revocar permiso (optimizado con actualización instantánea)
   */
  const asignarPermiso = useCallback(
    async (payload, userId, num) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.post('/api/permisos/asignar', payload);

        // ✅ Actualización instantánea del estado local
        setPermisosUsuario((prev) => {
          const permisoId = data.permission_id || payload.val;
          if (payload.check) {
            // Evita duplicados
            const yaExiste = prev.some((p) => p.permission_id === permisoId);
            return yaExiste ? prev : [...prev, { permission_id: permisoId }];
          } else {
            // Eliminar el permiso revocado
            return prev.filter((p) => p.permission_id !== permisoId);
          }
        });

        // 🔁 Refrescar desde backend para asegurar consistencia total
        await listarPermisos(userId, num);

        console.log('✅ Permiso actualizado correctamente:', data);
        return data;
      } catch (err) {
        console.error('❌ Error al asignar permiso:', err);
        setError(err.response?.data?.error || 'Error al actualizar permiso');
      } finally {
        setLoading(false);
      }
    },
    [listarPermisos]
  );

  return {
    permisos,
    objetos,
    permisosUsuario,
    subsistema,
    loading,
    error,
    listarPermisos,
    crearPermiso,
    crearObjeto,
    asignarPermiso,
  };
}

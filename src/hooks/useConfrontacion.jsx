import { useState } from 'react';
import api from '../api/axios';

export default function useConfrontacion() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Cargar datos de búsqueda - documento encontrado
    const cargarBusquedaEncontrado = async (cod_dtra) => {
        try {
            setLoading(true);
            const res = await api.get(`/api/busqueda_doc_encontrado/${cod_dtra}`);
            return res.data.data;
        } catch (err) {
            console.error("Error al cargar búsqueda encontrado:", err);
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Guardar documento como encontrado
    const guardarBusquedaEncontrado = async (cdtra) => {
        try {
            setLoading(true);
            const res = await api.post('/api/g_busqueda_encontrado', { cdtra });
            setSuccess(res.data.message);
            return res.data;
        } catch (err) {
            console.error("Error al guardar búsqueda encontrado:", err);
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        cargarBusquedaEncontrado,
        guardarBusquedaEncontrado,
        loading,
        error,
        success,
    };
}
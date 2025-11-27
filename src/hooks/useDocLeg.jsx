import { useState } from 'react';
import api from '../api/axios';

export default function useDocleg() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const mapFormToBackend = (form) => {
        const mappedData = {
            tipo: form.tipo,          // corresponde a cod_tre
            ctra: form.ctra,          // código del trámite padre
            numero: form.numero,      // número del título
            control: form.control,    // número de control del valorado
            gestion: form.gestion,    // gestión del trámite
            buscar_en: form.buscar_en, // buscar_en
            reintegro: form.reintegro ?? '',        // siempre enviar
            valorado_bus: form.valorado_bus ?? '',  // siempre enviar
            reimpresion: form.reimpresion ?? '',    // siempre enviar
            ptaang: form.ptaang ? true : false,  
            supletorio: form.supletorio ? true : false,
            tipo_tramite: form.tipo_tramite === 'INTERNO' ? 't' : 'f',
            cuadis: form.cuadis ? "c" : false,
            documentos: form.documentos || '',      // documentos de confrontación
        };

        // Limpiar campos vacíos y solo enviar los que tengan valor
        const finalPayload = Object.fromEntries(
            Object.entries(mappedData).filter(([key, value]) => {
                // Campos que siempre se deben enviar aunque estén vacíos
                if (['reintegro', 'valorado_bus', 'reimpresion'].includes(key)) return true;
                // Checkbox y otros campos: enviar solo si tienen valor
                return value !== undefined && value !== null && value !== '';
            })
        );

        return finalPayload;
    };

    const createDocumento = async (formData) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const payload = mapFormToBackend(formData);
            console.log('Payload enviado:', payload);

            const response = await api.post('/api/g-docleg', payload);

            setSuccess(response.data);
            return response.data;

        } catch (err) {
            console.error('Error al crear documento:', err);
            setError(err.response?.data?.message || err.message || 'Error desconocido');
            return err;
        } finally {
            setLoading(false);
        }
    };

    return { createDocumento, loading, error, success };
}

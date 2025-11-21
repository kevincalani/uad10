import { useState } from 'react';
import api from '../api/axios';

export default function useDocleg() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const mapFormToBackend = (form) => {
        const numeroTitulo = `${form.nroTitulo1 || ''}/${form.nroTitulo2 || ''}`;
        return {
            tipo: form.tipoLegalizacion,                // corresponde a cod_tre
            ctra: form.ctra || '',                       // código del trámite padre (si aplica)
            numero: numeroTitulo,                        // número del título
            control: form.nroControl,                    // número de control del valorado
            gestion: form.gestion || '',                 // gestión del trámite
            buscar_en: form.buscar_en || '',             // buscar_en
            reintegro: form.reintegro || '',             // reintegro
            valorado_bus: form.nroControlBusqueda || '', // control búsqueda
            reimpresion: form.nroControlReimpresion || '', // control reimpresión
            ptaang: form.isPtag ? 't' : 'f',
            supletorio: form.isTituloSupletorio ? 't' : 'f',
            tipo_tramite: form.tipoTramite === 'INTERNO' ? 't' : 'f',
            cuadis: form.isCuadis ? 'c' : '',
            documentos: form.documentos || '',           // documentos de confrontación
        };
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
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { createDocumento, loading, error, success };
}

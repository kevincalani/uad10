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

    // 🔥 NUEVO: Cambiar destino (EXT/INT)
    const cambiarDestino = async (cod_dtra) => {
        try {
            const res = await api.get(`/api/cambiar-interno-docleg/${cod_dtra}`);
            console.log(res,"res")
            return res
            
        } catch (err) {
            console.error("Error al cambiar destino:", err);
            return err;
        }
    };
    // ======================================
    // 📌 VERIFICACIÓN SITRA
    // ======================================
    const verificacionSitra = async (cod_dtra) => {
        try {
            const res = await api.get(`/api/verificacion-sitra/${cod_dtra}`);
            return res.data.data;
        } catch (err) {
            console.error("Error SITRA:", err);
            throw err;
        }
    };
    // ======================================
    // 📌 OBTENER OBSERVACIONES
    // ======================================
    const getObservaciones = async (cod_dtra) => {
        try {
            const res = await api.get(`/api/obs-docleg/${cod_dtra}`);
            return res.data.data;
        } catch (err) {
            console.error("Error obtener observaciones:", err);
            throw err;
        }
    };
    // ======================================
    // 📌 GUARDAR OBSERVACIÓN
    // ======================================
    const saveObservacion = async ({ cod_dtra, obs, falso }) => {
        try {
            const body = {
                cdtra: cod_dtra,
                obs,
                falso: falso ? "on" : ""
            };

            const res = await api.post('/api/g-obs-docleg', body);
            return res.data;
        } catch (err) {
            console.error("Error guardar observación:", err);
            throw err;
        }
    };

    // Generar glosa (abrir modal)
    const generarGlosaModal = async (cod_dtra) => {
        try {
            const res = await api.get(`/api/generar-glosa-leg/${cod_dtra}`);
            return res.data.data;
        } catch (err) {
            console.error("Error generar glosa:", err);
            throw err;
        }
    };

    //  Elegir modelo de glosa
    const elegirModelo = async (cod_glo, cod_dtra) => {
        try {
            const res = await api.post('/api/elegir-modelo-glosa', {
                cod_glo,
                cod_dtra
            });
            return res.data;
        } catch (err) {
            console.error("Error elegir modelo:", err);
            throw err;
        }
    };

    //  Guardar glosa (legalizar título)
    const guardarGlosa = async (formData) => {
        try {
            const res = await api.post('/api/legalizar-titulo', formData);
            return res.data;
        } catch (err) {
            console.error("Error guardar glosa:", err);
            throw err;
        }
    };

    //  Generar PDF
    const generarPDF = async (cod_dtra) => {
        try {
            // Para PDF, abrimos en nueva ventana
            const url = `${api.defaults.baseURL}/api/generar-pdf-legalizacion/${cod_dtra}`;
            window.open(url, '_blank');
        } catch (err) {
            console.error("Error generar PDF:", err);
            throw err;
        }
    };

    // ======================================
    // 📌 VER PDF
    // ======================================
    const verDocumentoPDF = async (cod_dtra) => {
        try {
            const res = await api.get(`/api/ver-documento-pdf-legalizado/${cod_dtra}`);
            return res;
        } catch (err) {
            console.error("Error PDF:", err);
            throw err;
        }
    };
    // Configurar impresión PDF
    const configurarImpresionPDF = async (cod_dtra) => {
        try {
            const res = await api.get(`/api/configurar-impresion-pdf-leg/${cod_dtra}`);
            return res.data.data;
        } catch (err) {
            console.error("Error al cargar configuración:", err);
            throw err;
        }
    };

    // Cambiar posición de PDF
    const cambiarPosicionPDF = async (cdtra, posicion) => {
        try {
            const res = await api.post('/api/cambiar-posicion-pdf', {
                cdtra,
                posicion
            });
            return res.data;
        } catch (err) {
            console.error("Error al cambiar posición:", err);
            throw err;
        }
    };

    // Cargar datos para corregir documento
    const cargarDatosCorreccion = async (cod_dtra) => {
        try {
            const res = await api.get(`/api/fe-corregir-docleg/${cod_dtra}`);
            return res.data.data;
        } catch (err) {
            console.error("Error al cargar datos para corrección:", err);
            throw err;
        }
    };

    // Corregir documento (deshacer generación)
    const corregirDocumento = async (cdtra, ctra) => {
        try {
            const res = await api.post('/api/corregir-docleg', {
                cdtra,
                ctra
            });
            return res.data;
        } catch (err) {
            console.error("Error al corregir documento:", err);
            throw err;
        }
    };

    // ======================================
    // 📌 ELIMINAR DOCUMENTO
    // ======================================
    const eliminarDocumento = async (cod_dtra) => {
        try {
            const res = await api.post(`/api/eli-docleg`, { cdtra: cod_dtra });
            return res.data;
        } catch (err) {
            console.log(err)
            console.error("Error eliminar doc:", err);
            throw err;
        }
    };

    return { 
        createDocumento,
        loading, 
        error, 
        success,
        cambiarDestino,
        verificacionSitra,
        getObservaciones,
        saveObservacion,
        verDocumentoPDF,
        eliminarDocumento,
        generarGlosaModal,
        elegirModelo,
        guardarGlosa,
        generarPDF,
        configurarImpresionPDF,
        cambiarPosicionPDF,
        cargarDatosCorreccion,
        corregirDocumento
    };
}

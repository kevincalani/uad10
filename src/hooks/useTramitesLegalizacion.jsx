import { useState } from 'react';
import api from '../api/axios';
import { TIPO_TRAMITE_INVERTIDO } from '../Constants/tramiteDatos';

// Convierte fecha ISO (YYYY-MM-DD) -> DD/MM/YYYY
const toDMY = (isoDate) => {
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
};

export function useTramitesLegalizacion() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // -------------------------
    // 📋 LISTAR TRÁMITES POR FECHA
    // -------------------------
    const listarTramites = async (date) => {
        if (!date) return { ok: false, error: 'Fecha requerida' };

        setLoading(true);
        setError(null);

        try {
            const fechaDMY = toDMY(date);

            const res = await api.get(`/api/listar-tramite-legalizacion`, {
                params: { fecha: fechaDMY }
            });

            const tramitas = res.data?.data?.tramitas || [];

            return { ok: true, tramites: tramitas };

        } catch (err) {
            console.error("Error cargando trámites:", err);
            const errorMsg = "No se pudieron cargar los trámites.";
            setError(errorMsg);
            return { ok: false, error: errorMsg, tramites: [] };
        } finally {
            setLoading(false);
        }
    };

    // -------------------------
    // 🔍 BUSCAR POR NÚMERO DE TRÁMITE
    // -------------------------
    const buscarPorNumero = async (numero) => {
        try {
            const res = await api.get(`/api/buscar-tramite-legalizacion/${numero}`);

            const lista = res.data?.data?.tramitas || [];

            return {
                ok: true,
                tramites: lista,
                fecha: res.data?.data?.fecha || null
            };

        } catch (err) {
            console.error("Error buscando trámite:", err);

            if (err.response?.status === 422) {
                return { ok: false, error: "Número de trámite inválido" };
            }

            return { ok: false, error: "Error buscando trámite" };
        }
    };

    // -------------------------
    // ➕ GENERAR NUEVO TRÁMITE
    // -------------------------
    const generarTramite = async (tipoTexto, fecha) => {
        try {
            const fechaDMY = toDMY(fecha);
            const tipoCodigo = TIPO_TRAMITE_INVERTIDO[tipoTexto];

            const res = await api.post("/api/generar-numero", {
                fecha: fechaDMY,
                tipo: tipoCodigo,
            });

            return { ok: true, tramite: res.data?.data };

        } catch (error) {
            console.error("Error generando trámite:", error);
            return { ok: false, error: "Error al generar trámite" };
        }
    };

    // -------------------------
    // 💾 GUARDAR DATOS PERSONALES DEL TRÁMITE
    // -------------------------
    const guardarDatosTramite = async (formData) => {
        try {
            const res = await api.post("/api/g-traleg", formData);

            if (res.data.status === "success") {
                const { tramite: t, persona: p } = res.data.data;

                return {
                    ok: true,
                    message: res.data.message,
                    persona: p,
                    tramite: t,
                };
            }

            return { ok: false, error: "No se pudo guardar" };

        } catch (err) {
            console.error("Error guardando datos del trámite:", err);

            return {
                ok: false,
                error: err.response?.data?.message || "Error al guardar"
            };
        }
    };

    // -------------------------
    // 🔄 CAMBIAR TIPO DE TRÁMITE
    // -------------------------
    const cargarFormularioCambioTramite = async (cod_tra) => {
        try {
            const res = await api.get(`/api/f-cambiar-tipo-tramite/${cod_tra}`);
            return { ok: true, data: res.data.data };
        } catch (err) {
            console.error("Error al cargar formulario:", err);
            return { ok: false, error: err.response?.data?.message || "Error al cargar formulario" };
        }
    };

    const cambiarTipoTramite = async (formData) => {
        try {
            const res = await api.post('/api/e-tipo-tramite', formData);
            return { ok: true, message: res.data.message, data: res.data };
        } catch (err) {
            console.error("Error al cambiar tipo de trámite:", err);
            return { ok: false, error: err.response?.data?.message || "Error al cambiar tipo" };
        }
    };

    // -------------------------
    // 🗑️ ELIMINAR TRÁMITE
    // -------------------------
    const cargarFormularioEliminarTramite = async (cod_tra) => {
        try {
            const res = await api.get(`/api/f-eli-tra-legalizacion/${cod_tra}`);
            return { ok: true, data: res.data.data };
        } catch (err) {
            console.error("Error al cargar datos para eliminar:", err);
            return { ok: false, error: err.response?.data?.message || "Error al cargar datos" };
        }
    };

    const eliminarTramite = async (cod_tra) => {
        try {
            const res = await api.post('/api/eli-traleg', { ctra: cod_tra });
            return { ok: true, message: res.data.message, fecha: res.data.data.fecha };
        } catch (err) {
            console.error("Error al eliminar trámite:", err);
            return { ok: false, error: err.response?.data?.message || "Error al eliminar" };
        }
    };

// -------------------------
    // 📦 PANEL DE ENTREGA
    // -------------------------
    const cargarPanelEntrega = async (cod_tra) => {
        try {
            const res = await api.get(`/api/panel-entrega-legalizacion/${cod_tra}`);
            return { ok: true, data: res.data.data };
        } catch (err) {
            console.error("Error al cargar panel de entrega:", err);
            return { ok: false, error: err.response?.data?.message || "Error al cargar panel" };
        }
    };

    const cargarConfirmacionEntrega = async (varios, cod_dtra) => {
        try {
            const res = await api.get(`/api/datos-legalizado/${varios}/${cod_dtra}`);
            return { ok: true, data: res.data.data };
        } catch (err) {
            console.error("Error al cargar confirmación:", err);
            return { ok: false, error: err.response?.data?.message || "Error al cargar" };
        }
    };

    const registrarEntrega = async (formData) => {
        try {
            const res = await api.post('/api/g-entrega', formData);
            return { ok: true, message: res.data.message, data: res.data.data };
        } catch (err) {
            console.error("Error al registrar entrega:", err);
            return { ok: false, error: err.response?.data?.message || "Error al registrar" };
        }
    };

    return {
        loading,
        error,
        // Funciones de API
        listarTramites,
        buscarPorNumero,
        generarTramite,
        guardarDatosTramite,
        cargarFormularioCambioTramite,
        cambiarTipoTramite,
        cargarFormularioEliminarTramite,
        eliminarTramite,
        cargarPanelEntrega,
        cargarConfirmacionEntrega,
        registrarEntrega
    };
}
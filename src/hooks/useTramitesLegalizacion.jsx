import { useEffect, useState } from 'react';
import api from '../api/axios';
import { TIPO_TRAMITE_INVERTIDO } from '../Constants/tramiteDatos';


// Convierte fecha ISO (YYYY-MM-DD) -> DD/MM/YYYY
const toDMY = (isoDate) => {
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
};

export function useTramitesLegalizacion(selectedDate) {
    const [tramites, setTramites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    // -------------------------
    //  🔹 Obtener trámites
    // -------------------------
    const fetchTramites = async (date) => {
        if (!date) return;

        setLoading(true);
        setError(null);

        try {
            const fechaDMY = toDMY(date);

            const res = await api.get(`/api/listar-tramite-legalizacion`, {
                params: { fecha: fechaDMY }
            });

            const tramitas = res.data?.data?.tramitas || [];
            setTramites(tramitas);

        } catch (err) {
            console.error("Error cargando trámites:", err);
            setError("No se pudieron cargar los trámites.");
            setTramites([]);
        } finally {
            setLoading(false);
        }
    };

    // Cargar al cambiar fecha
    useEffect(() => {
        fetchTramites(selectedDate);
    }, [selectedDate]);


    // -------------------------
    //  🔹 Buscar por número de trámite
    // -------------------------
    const buscarPorNumero = async (numero) => {
        try {
            const res = await api.get(`/api/buscar-tramite-legalizacion/${numero}`);

            const lista = res.data?.data?.tramitas || [];

            // 🔹 Actualizar la tabla con el resultado
            setTramites(lista);

            // 🔹 Retornar resultado para que la vista muestre toast
            return {
                ok: true,
                tramites: lista,
                fecha: res.data?.data?.fecha || null
            };

        } catch (err) {
            console.error("Error buscando trámite:", err);

            // Retornar el estado del error a la vista (sin toast aquí)
            if (err.response?.status === 422) {
                return { ok: false, error: "Número de trámite inválido" };
            }

            return { ok: false, error: "Error buscando trámite" };
        }
    };


    // -------------------------
    //  🔹 GENERAR NUEVO TRÁMITE
    // -------------------------
    const generarTramite = async (tipoTexto) => {
        try {
            const fechaDMY = toDMY(selectedDate);
            const tipoCodigo = TIPO_TRAMITE_INVERTIDO[tipoTexto]; // "Legalizacion" → "L"

            const res = await api.post("/api/generar-numero", {
                fecha: fechaDMY,
                tipo: tipoCodigo,
            });

            const nuevo = res.data?.data;

            // Agregar al estado sin refetch
            setTramites((prev) => [...prev, nuevo]);

            return nuevo;

        } catch (error) {
            console.error("Error generando trámite:", error);
            throw error;
        }
    };
        // -------------------------
    // 🔹 GUARDAR DATOS PERSONALES DEL TRÁMITE
    // -------------------------
    const guardarDatosTramite = async (formData) => {
        try {
            const res = await api.post("/api/g-traleg", formData);

            if (res.data.status === "success") {
                const { tramite: t, persona: p } = res.data.data;

                // 🔹 Actualizar la lista fusionando datos de persona y tramite
                setTramites(prev =>
                    prev.map(x =>
                        x.cod_tra === t.cod_tra
                            ? { ...x, ...t, per_nombre: p.per_nombre, per_apellido: p.per_apellido, per_ci: p.per_ci }
                            : x
                    )
                );

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
    // Cargar formulario cambiar tipo de trámite
    const cargarFormularioCambioTramite = async (cod_tra) => {
        try {
            setLoading(true);
            const res = await api.get(`/api/f-cambiar-tipo-tramite/${cod_tra}`);
            return res.data.data;
        } catch (err) {
            console.error("Error al cargar formulario:", err);
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Cambiar tipo de trámite
    const cambiarTipoTramite = async (formData) => {
        try {
            setLoading(true);
            const res = await api.post('/api/e-tipo-tramite', formData);
            setSuccess(res.data.message);
            return res.data;
        } catch (err) {
            console.error("Error al cambiar tipo de trámite:", err);
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };



    return {
        tramites,
        setTramites,
        loading,
        error,
        reload: () => fetchTramites(selectedDate),

        // 🆕 Nuevas funciones
        buscarPorNumero,
        generarTramite,
        guardarDatosTramite,
        cargarFormularioCambioTramite,
        cambiarTipoTramite,
    };
}

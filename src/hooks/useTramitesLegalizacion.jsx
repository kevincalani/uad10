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

    return {
        tramites,
        setTramites,
        loading,
        error,
        reload: () => fetchTramites(selectedDate),

        // 🆕 Nuevas funciones
        buscarPorNumero,
        generarTramite,
    };
}

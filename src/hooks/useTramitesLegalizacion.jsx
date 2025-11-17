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

            return nuevo; // útil para abrir modal

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

        // 🆕 Función para generar trámites
        generarTramite,
    };
}

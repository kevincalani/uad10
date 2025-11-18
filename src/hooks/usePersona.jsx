import { useState } from "react";
import api from "../api/axios";

export function usePersona() {
    const [persona, setPersona] = useState(null);
    const [apoderado, setApoderado] = useState(null);
    const [loading, setLoading] = useState(false);

    // ----------------------------
    // 🔹 Obtener persona por CI
    // ----------------------------
    const cargarPersona = async (ci) => {
        if (!ci) return;

        setLoading(true);
        try {
            const res = await api.get(`/api/personas/datos-per/${ci}`);

            if (res.data.success) {
                setPersona(res.data.data);
                return res.data.data;
            } else {
                setPersona(null);
                return null;
            }
        } catch (err) {
            console.error("Error cargando persona:", err);
            setPersona(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // ----------------------------
    // 🔹 Obtener apoderado por CI
    // ----------------------------
    const cargarApoderado = async (ci) => {
        if (!ci) return;

        setLoading(true);
        try {
            const res = await api.get(`/api/personas/datos-apo/${ci}`);

            if (res.data.success) {
                setApoderado(res.data.data);
                return res.data.data;
            } else {
                setApoderado(null);
                return null;
            }
        } catch (err) {
            console.error("Error cargando apoderado:", err);
            setApoderado(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        persona,
        apoderado,
        loading,
        cargarPersona,
        cargarApoderado
    };
}

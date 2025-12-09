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
    const cargarApoderadoPorCi = async (ci) => {
        if (!ci) return;

        setLoading(true);
        try {
            const res = await api.get(`/api/personas/datos-apo/${ci}`);

            if (res.data.success) {
                setApoderado(res.data.data);
                return res.data.data;
            }
        } catch (err) {
            console.error("Error cargando apoderado:", err);
            setApoderado(null);
            return null;
        } finally {
            setLoading(false);
        }
    };
    const cargarApoderadoPorTramite = async (cod_tra) => {
        if (!cod_tra) return null;
        setLoading(true);
        try {
        const res = await api.get(`/api/datos-apoderado/${cod_tra}`);
            
            const apo = res.data.apoderado ?? null;
            setApoderado(apo);
            console.log(apo)
            return apo;
        } catch (err) {
        console.error("Error cargando apoderado por trámite:", err);
        setApoderado(null);
        return null;
        } finally {
        setLoading(false);
        }
    };

  const guardarApoderado = async (formData) => {
        try {
            const res = await api.post("/api/guardar-apoderado", formData);
            return { ok: true, data: res.data };
        } catch (err) {
            return { ok: false, error: err.response?.data?.message || "Error al guardar" };
        }
    };

    return {
        persona,
        apoderado,
        loading,
        cargarPersona,
        cargarApoderadoPorCi,
        cargarApoderadoPorTramite,
        guardarApoderado
    };
}

import React, { useMemo, useState, useEffect } from "react";
import { BookText } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import { useTramitesLegalizacion } from "../../hooks/useTramitesLegalizacion";

import TramiteActionButton from "../../components/TramiteActionButton";
import LegalizacionesTable from "../../components/Tramites/LegalizacionesTable";
import { toastTramite } from "../../utils/toastTramite";
import BuscarValoradoModal from "../../modals/BuscarValoradoModal";
import { toast } from "../../utils/toast";

const formatDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export default function Tramites() {
    const today = useMemo(() => formatDate(new Date()), []);
    const [selectedDate, setSelectedDate] = useState(today);
    const [valoradoInput, setValoradoInput] = useState("");
    const [tramiteInput, setTramiteInput] = useState("");

    // 🔥 Estado local de trámites
    const [tramites, setTramites] = useState([]);

    const {
        loading,
        error,
        listarTramites,
        generarTramite,
        buscarPorNumero,
        guardarDatosTramite,
    } = useTramitesLegalizacion();

    const { openModal } = useModal();

    const ADD_TYPES = [
        "Legalizacion",
        "Certificacion",
        "Confrontacion",
        "Busqueda",
        "Consejo",
        // "Importar Legalizacion" // 🔥 Comentado hasta implementar
    ];
    const isToday = today === selectedDate;

    // -------------------------
    // 📋 CARGAR TRÁMITES AL CAMBIAR FECHA
    // -------------------------
    useEffect(() => {
        const cargarDatos = async () => {
            const res = await listarTramites(selectedDate);
            if (res.ok) {
                setTramites(res.tramites);
            } else {
                toast.error(res.error);
                setTramites([]);
            }
        };

        cargarDatos();
    }, [selectedDate]);

    // -------------------------
    // ➕ AÑADIR NUEVO TRÁMITE
    // -------------------------
    const handleAddTramite = async (type) => {
        if (!isToday) {
            toast.warning("No se pueden realizar acciones en fechas pasadas");
            return;
        }

        const res = await generarTramite(type, selectedDate);

        if (res.ok) {
            // Agregar al estado local
            setTramites((prev) => [...prev, res.tramite]);

            toastTramite({
                type,
                tramiteNumber: res.tramite.tra_numero,
                date: selectedDate,
            });
        } else {
            toast.error(res.error || "Error al generar trámite");
        }
    };

    // -------------------------
    // 🔍 BUSCAR POR NÚMERO DE TRÁMITE
    // -------------------------
    const handleBuscarTramite = async () => {
        if (!tramiteInput.trim()) {
            toast.error("Ingrese un Número de Trámite");
            return;
        }

        const res = await buscarPorNumero(tramiteInput.trim());

        if (!res.ok) {
            toast.error(res.error);
            return;
        }

        if (res.tramites.length === 0) {
            toast.error("No existe registros con este Número de trámite");
            return;
        }

        // Actualizar la lista con los resultados
        setTramites(res.tramites);
        setTramiteInput("");
        toast.success("Trámite encontrado");
    };

    // -------------------------
    // 🔄 RECARGAR TRÁMITES
    // -------------------------
    const recargarTramites = async () => {
        const res = await listarTramites(selectedDate);
        if (res.ok) {
            setTramites(res.tramites);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="p-8 bg-white rounded-lg shadow-md">
                {/* Título */}
                <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2 flex items-center">
                    <BookText className="mr-3" size={32} /> LEGALIZACIONES
                </h1>

                {/* Controles principales */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-4 border-b pb-6">
                    {/* PARTE IZQUIERDA: Búsqueda de Fecha y Botones de Acción */}
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                        {/* Buscar fecha */}
                        <div className="flex items-center gap-2">
                            <label className="text-gray-700 font-bold whitespace-nowrap">
                                Buscar fecha:
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-wrap gap-2">
                            {ADD_TYPES.map((type) => (
                                <TramiteActionButton
                                    key={type}
                                    type={type}
                                    disabled={!isToday}
                                    onClick={() => handleAddTramite(type)}
                                >
                                    +
                                </TramiteActionButton>
                            ))}
                        </div>
                    </div>

                    {/* PARTE DERECHA: Buscadores */}
                    <div className="flex flex-col gap-2">
                        {/* Buscar por valorado */}
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Nro Valorado"
                                value={valoradoInput}
                                onChange={(e) => setValoradoInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && valoradoInput.trim()) {
                                        openModal(BuscarValoradoModal, { valorado: valoradoInput });
                                        setValoradoInput("");
                                    }
                                }}
                                className="border border-gray-300 rounded-l px-3 py-2 w-36 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                                className="bg-blue-600 text-white px-3 py-2 rounded-r hover:bg-blue-700 transition"
                                onClick={() => {
                                    if (!valoradoInput.trim()) {
                                        toast.error("Ingrese un número de valorado");
                                        return;
                                    }
                                    openModal(BuscarValoradoModal, { valorado: valoradoInput });
                                    setValoradoInput("");
                                }}
                            >
                                🔍
                            </button>
                        </div>

                        {/* Buscar por número de trámite */}
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Nro Trámite"
                                value={tramiteInput}
                                onChange={(e) => setTramiteInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleBuscarTramite()}
                                className="border border-gray-300 rounded-l px-3 py-2 w-36 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                                className="bg-blue-600 text-white px-3 py-2 rounded-r hover:bg-blue-700 transition"
                                onClick={handleBuscarTramite}
                            >
                                🔍
                            </button>
                        </div>

                        <span className="text-xs font-bold text-red-600 text-center">
                            Ejm: 123-2022
                        </span>
                    </div>
                </div>

                {/* Tabla de trámites */}
                <LegalizacionesTable
                    tramites={tramites}
                    setTramites={setTramites}
                    guardarDatosTramite={guardarDatosTramite}
                    recargarTramites={recargarTramites}
                    loading={loading}
                    error={error}
                    selectedDate={selectedDate}
                />
            </div>
        </div>
    );
}
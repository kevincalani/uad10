import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { BookText } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import { useTramitesLegalizacion } from "../../hooks/useTramitesLegalizacion";

import TramiteActionButton from "../../components/TramiteActionButton";
import LegalizacionesTable from "../../components/Tramites/LegalizacionesTable";
import { toastTramite } from "../../utils/toastTramite";
import BuscarValoradoModal from "../../modals/BuscarValoradoModal";
import { toast } from "../../utils/toast";

const formatDate = (input) => {
    if (!input) return "";

    // Si el input es string: YYYY-MM-DD → devolver tal cual
    if (typeof input === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
        return input;
    }

    // Si es Date, formatearlo normal
    const d = new Date(input);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

// Función para validar formato de fecha
const isValidDate = (dateString) => {
    if (!dateString) return false;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
};

export default function Tramites() {
    const { fecha: fechaUrl, numero: numeroUrl } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const today = useMemo(() => formatDate(new Date()), []);
    
    // Inicializar fecha desde URL o usar fecha actual
    const getInitialDate = () => {
        if (fechaUrl && isValidDate(fechaUrl)) {
            return fechaUrl;
        }
        return today;
    };
    
    const [selectedDate, setSelectedDate] = useState(getInitialDate());
    const [valoradoInput, setValoradoInput] = useState("");
    const [tramiteInput, setTramiteInput] = useState("");
    const [modoBusqueda, setModoBusqueda] = useState(false);

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
    ];
    const isToday = today === selectedDate;

    // Sincronizar fecha de URL con estado
    useEffect(() => {
        if (fechaUrl && isValidDate(fechaUrl)) {
            setSelectedDate(fechaUrl);
        }
    }, [fechaUrl]);

    // -------------------------
    // 🔍 BUSCAR POR NÚMERO DESDE URL
    // -------------------------
    useEffect(() => {
        // Detectar si estamos en modo búsqueda
        if (location.pathname.includes('/buscar-tramite-legalizacion/') && numeroUrl) {
            buscarTramiteDesdeURL(numeroUrl);
        }
    }, [numeroUrl, location.pathname]);

    const buscarTramiteDesdeURL = async (numero) => {
        setModoBusqueda(true);
        const res = await buscarPorNumero(numero);

        if (!res.ok) {
            toast.error(res.error || "Error al buscar trámite");
            setTramites([]);
            return;
        }

        if (res.tramites.length === 0) {
            toast.warning(`No se encontró el trámite ${numero}`);
            setTramites([]);
        } else {
            setTramites(res.tramites);
            toast.success(`Trámite ${numero} encontrado`);
        }
    };

    // -------------------------
    // 📋 CARGAR TRÁMITES AL CAMBIAR FECHA
    // -------------------------
    useEffect(() => {
        // Solo cargar por fecha si NO estamos en modo búsqueda
        if (!location.pathname.includes('/buscar-tramite-legalizacion/')) {
            cargarDatos();
            setModoBusqueda(false);
        }
    }, [selectedDate, location.pathname]);

    const cargarDatos = async () => {
        const res = await listarTramites(selectedDate);
        if (res.ok) {
            setTramites(res.tramites);
        } else {
            toast.error(res.error);
            setTramites([]);
        }
    };

    // -------------------------
    // ➕ AÑADIR NUEVO TRÁMITE
    // -------------------------
    const handleAddTramite = async (type) => {
        if (!isToday) {
            toast.warning("No se puede Agregar Tramites en fechas pasadas");
            return;
        }

        const res = await generarTramite(type, selectedDate);

        if (res.ok) {
            // Recargar datos
            cargarDatos();

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

        // Navegar a la ruta de búsqueda
        navigate(`/servicios/buscar-tramite-legalizacion/${tramiteInput.trim()}`);
        setTramiteInput("");
    };

    // -------------------------
    // 🔄 RECARGAR TRÁMITES
    // -------------------------
    const recargarTramites = async () => {
        if (modoBusqueda && numeroUrl) {
            // Si estamos en modo búsqueda, volver a buscar
            await buscarTramiteDesdeURL(numeroUrl);
        } else {
            // Si no, recargar por fecha
            const res = await listarTramites(selectedDate);
            if (res.ok) {
                setTramites(res.tramites);
            }
        }
    };

    // -------------------------
    // 📅 MANEJAR CAMBIO DE FECHA
    // -------------------------
    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        // Salir del modo búsqueda y actualizar URL
        setModoBusqueda(false);
        navigate(`/servicios/tramites/${newDate}`, { replace: true });
    };

    // -------------------------
    // 🔙 VOLVER A LISTA POR FECHA
    // -------------------------
    const volverAListaFecha = () => {
        setModoBusqueda(false);
        navigate(`/servicios/tramites/${selectedDate}`, { replace: true });
        cargarDatos();
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-lg shadow-md">
                {/* Título */}
                <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">    
                    <h1 className="text-xl font-semibold flex items-center">
                        <BookText className="mr-2" size={32} /> LEGALIZACIONES
                    </h1>
                </div>
                <div className="p-6">
                    {/* Banner de modo búsqueda */}
                    {modoBusqueda && (
                        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-600 rounded flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-blue-700 font-semibold">
                                    📋 Mostrando resultados de búsqueda: {numeroUrl}
                                </span>
                            </div>
                            <button
                                onClick={volverAListaFecha}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
                            >
                                Volver a lista por fecha
                            </button>
                        </div>
                    )}

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
                                    onChange={handleDateChange}
                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Botones de acción */}
                            <div className="flex flex-wrap gap-2">
                                {ADD_TYPES.map((type) => (
                                    <TramiteActionButton
                                        key={type}
                                        type={type}
                                        disabled={!isToday || modoBusqueda}
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
        </div>
    );
}
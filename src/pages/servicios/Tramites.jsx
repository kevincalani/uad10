import React, { useMemo, useState } from "react";
import { BookText } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import { useTramitesLegalizacion } from "../../hooks/useTramitesLegalizacion";

import TramiteActionButton from "../../components/TramiteActionButton";
import ConfirmModal from "../../modals/ConfirmModal";
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

    const { tramites, setTramites, loading, error, generarTramite, buscarPorNumero } =
        useTramitesLegalizacion(selectedDate);

    const { openModal } = useModal();

    const ADD_TYPES = ["Legalizacion", "Certificacion","Confrontacion", "Busqueda", "Consejo","Importar Legalizacion"];
    const isToday = today === selectedDate;

    const handleAddTramite = async (type) => {
        if (!isToday)
            return alert("No se pueden realizar acciones en fechas pasadas");

        try {
            const nuevo = await generarTramite(type);

            toastTramite({
            type,
            tramiteNumber: nuevo.tra_numero,
            date: selectedDate,
        });

        } catch {
            toast.error("Error al generar trámite");
        }
    };
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
        setTramiteInput("")
        toast.success("Trámite encontrado");
    };

    return (
        <div className="p-6 bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md">

                {/* Título */}
                <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2 flex items-center">
                    <BookText className="mr-3" size={32} /> LEGALIZACIONES
                </h1>

                {/* Controles principales */}
                <div className="flex flex-row justify-between items-start gap-y-4 mb-4 border-b pb-6">
                {/* PARTE IZQUIERDA: Búsqueda de Fecha y Botones de Acción */}
                    <div className="flex  md:flex-row md:items-start gap-4">
                    {/* Buscar fecha */}
                    <div className="flex items-center flex-shrink-0">
                        <label className="text-gray-600 font-bold whitespace-nowrap">Buscar fecha:</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex flex-wrap gap-1 md:gap-2">
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
                    {/* Buscadores de Nro Valorado y Nro Trámite */}
                    <div className="flex flex-col items-center gap-2 sm:gap-1 ml-4">
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Nro Valorado"
                                value={valoradoInput}
                                onChange={(e) => setValoradoInput(e.target.value)}
                                className="border border-gray-300 rounded-l py-2 px-3 w-30 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button className="bg-blue-600 text-white p-2 rounded-r hover:bg-blue-700"
                            onClick={() => {
                                if (!valoradoInput.trim()) {
                                toast.error("Ingrese un número de valorado");
                                return;
                                }
                                openModal(BuscarValoradoModal, { valorado: valoradoInput });
                                setValoradoInput("")
                            }}
                            >
                                🔍
                            </button>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Nro Trámite"
                                value={tramiteInput}
                                onChange={(e) => setTramiteInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleBuscarTramite()}
                                className="border border-gray-300 rounded-l py-2 px-3 w-30 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button className="bg-blue-600 text-white p-2 rounded-r hover:bg-blue-700"
                                    onClick={handleBuscarTramite}
                            >
                                🔍
                            </button>
                        </div>

                        <span className="text-sm font-bold text-red-600">Ejm: 123-2022</span>
                    </div>
                </div>

                {/* Tabla completa (delegada) */}
                <LegalizacionesTable
                    tramites={tramites}
                    setTramites={setTramites}
                    loading={loading}
                    error={error}
                    selectedDate={selectedDate}
                />

            </div>
        </div>
    );
}

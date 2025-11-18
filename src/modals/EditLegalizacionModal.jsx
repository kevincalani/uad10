import React, { useState, useEffect } from "react";
import { X, BookText } from "lucide-react";
import DatosPersonalesForm from "../components/Forms/DatosPersonalesForm";
import DatosApoderadoForm from "../components/forms/DatosApoderadoForm";
import DocumentoTable from "../components/DocumentoTable";
import { useModal } from "../hooks/useModal";
import { usePersona } from "../hooks/usePersona";
import { useTramitesLegalizacion } from "../hooks/useTramitesLegalizacion";
import api from "../api/axios";
import { toast } from "../utils/toast";

export default function EditLegalizacionModal({
    tramiteData,
    setTramites
}) {
    const { closeModal } = useModal();
    if (!tramiteData) return null;

    const { cargarPersona, cargarApoderado } = usePersona();
    const { guardarDatosTramite} = useTramitesLegalizacion();

    // ---------------------------------------
    //  ESTADOS
    // ---------------------------------------
    const [isDatosPersonalesSaved, setIsDatosPersonalesSaved] = useState(
        !!tramiteData.per_nombre
    );
    const [documentos, setDocumentos] = useState([]);
    const [isApoderadoFormVisible, setIsApoderadoFormVisible] = useState(false);
    const [isAddDocumentoFormVisible, setIsAddDocumentoFormVisible] = useState(false);
    const [newDocForm, setNewDocForm] = useState({
        tipoLegalizacion: "",
        tipoTramite: "EXTERNO",
        isPtag: false,
        isCuadis: false,
        nroTitulo1: "",
        nroTitulo2: "",
        nroControl: "",
        reintegro: "",
        nroControlBusqueda: "",
        nroControlReimpresion: "",
        isTituloSupletorio: false,
        archivo: null
    });
    const [datosPersonales, setDatosPersonales] = useState({
        ci: tramiteData.per_ci || "",
        pasaporte: tramiteData.per_pasaporte || "",
        apellidos: tramiteData.per_apellido || "",
        nombres: tramiteData.per_nombre || ""
    });

    const [datosApoderado, setDatosApoderado] = useState({
        ci: "",
        apellidos: "",
        nombres: "",
        tipoApoderado: ""
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const res = await api.get(`/api/datos-tramite-legalizacion/${tramiteData.cod_tra}`);

                if (res.data.status === "success") {
                    const data = res.data.data;

                    // DATOS PERSONALES
                    if (data.tramite) {
                        setDatosPersonales({
                            ci: data.tramite.per_ci || "",
                            pasaporte: data.tramite.per_pasaporte || "",
                            apellidos: data.tramite.per_apellido || "",
                            nombres: data.tramite.per_nombre || "",
                        });
                        setIsDatosPersonalesSaved(!!data.tramite.per_nombre);
                    }

                    // DOCUMENTOS
                    setDocumentos(data.documentos || []);

                    // APODERADO
                    if (data.apoderado) {
                        setDatosApoderado({
                            ci: data.apoderado.ap_ci || "",
                            apellidos: data.apoderado.ap_apellido || "",
                            nombres: data.apoderado.ap_nombre || "",
                            tipoApoderado: data.apoderado.ap_tipo || "",
                        });
                        setIsApoderadoFormVisible(true);
                    }
                }
            } catch (err) {
                console.error(err);
                toast.error("Error al cargar los datos del trámite");
            }
        };

        fetchInitialData();
    }, [tramiteData]);

    // ---------------------------------------
    //  AUTOCOMPLETADO DE PERSONA
    // ---------------------------------------
    const handleCiChange = async (e) => {
        const ci = e.target.value;

        setDatosPersonales(p => ({ ...p, ci }));

        if (ci.length < 3) return;

        const persona = await cargarPersona(ci);

        if (persona) {
            setDatosPersonales(p => ({
                ...p,
                apellidos: persona.per_apellido,
                nombres: persona.per_nombre,
                pasaporte: persona.per_pasaporte || p.pasaporte
            }));
        } else {
            setDatosPersonales(p => ({
                ...p,
                apellidos: "",
                nombres: ""
            }));
        }
    };

    const handleDatosPersonalesChange = (e) => {
        const { name, value } = e.target;
        setDatosPersonales(prev => ({ ...prev, [name]: value }));
    };

    // ---------------------------------------
    //  GUARDAR DATOS PERSONALES (HOOK)
    // ---------------------------------------
    const handleDatosPersonalesSubmit = async () => {
        try {
            const form = new FormData();
            form.append("ctra", tramiteData.cod_tra);
            form.append("ci", datosPersonales.ci);
            form.append("nombre", datosPersonales.nombres);
            form.append("apellido", datosPersonales.apellidos);
            form.append("pasaporte", datosPersonales.pasaporte);

            const res = await guardarDatosTramite(form);

            if (res.ok) {
                setIsDatosPersonalesSaved(true);

                // Actualiza la tabla principal usando setTramites del padre
                setTramites(prev =>
                    prev.map(t => (t.cod_tra === tramiteData.cod_tra ? res.tramite : t))
                );

                toast.success(res.message);
            } else {
                toast.error(res.error);
            }
        } catch (err) {
            console.error(err);
            toast.error("Error inesperado al guardar los datos del trámite");
        }
};

    // ---------------------------------------
    //  AUTOCOMPLETADO DE APODERADO
    // ---------------------------------------
    const handleApoderadoCiChange = async (e) => {
        const ci = e.target.value;

        setDatosApoderado(p => ({ ...p, ci }));

        if (ci.length < 3) return;

        const ap = await cargarApoderado(ci);

        if (ap) {
            setDatosApoderado(p => ({
                ...p,
                apellidos: ap.ap_apellido,
                nombres: ap.ap_nombre,
                tipoApoderado: ap.ap_tipo || ""
            }));
        }
    };

    // ---------------------------------------
    //  AGREGAR DOCUMENTO
    // ---------------------------------------
    const handleAddDocumento = async (formValues) => {
        try {
            const fd = new FormData();

            fd.append("ctra", tramiteData.id_tra);
            fd.append("tipoLegalizacion", formValues.tipoLegalizacion);
            fd.append("tipoTramite", formValues.tipoTramite);
            fd.append("isPtag", formValues.isPtag);
            fd.append("isCuadis", formValues.isCuadis);
            fd.append("isTituloSupletorio", formValues.isTituloSupletorio);
            fd.append("nroControl", formValues.nroControl);
            fd.append("reintegro", formValues.reintegro);
            fd.append("nroControlBusqueda", formValues.nroControlBusqueda);
            fd.append("nroControlReimpresion", formValues.nroControlReimpresion);
            fd.append("nroTitulo", formValues.nroTitulo);
            fd.append("archivo", formValues.archivo || "");

            const res = await api.post("/api/g-docleg", fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const nuevo = res.data.data;
            setDocumentos(prev => [...prev, nuevo]);

            toast.success("Documento agregado correctamente");
            setIsAddDocumentoFormVisible(false);

        } catch (err) {
            console.error(err);
            toast.error("Error al agregar documento");
        }
    };
    // ---------------------------------------
    //  RENDER
    // ---------------------------------------
    return (
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[95vh] overflow-y-auto">

            {/* HEADER */}
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold flex items-center">
                    <BookText size={32} className="mr-3" /> LEGALIZACIÓN
                </h3>
                <X size={24} className="cursor-pointer" onClick={closeModal} />
            </div>

            {/* BODY */}
            <div className="p-6 flex-grow overflow-y-auto">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Formulario Para Editar Legalización
                </h2>

                <div className="flex flex-col lg:flex-row gap-6">

                    {/* IZQUIERDA */}
                    <div className="w-full lg:w-4/12 space-y-6">

                        <DatosPersonalesForm
                            tramiteData={tramiteData}
                            datosPersonales={datosPersonales}
                            handleCiChange={handleCiChange}
                            handleDatosPersonalesChange={handleDatosPersonalesChange}
                            onSave={handleDatosPersonalesSubmit}
                            isDatosPersonalesSaved={isDatosPersonalesSaved}
                        />

                        <DatosApoderadoForm
                            isApoderadoFormVisible={isApoderadoFormVisible}
                            setIsApoderadoFormVisible={setIsApoderadoFormVisible}
                            datosApoderado={datosApoderado}
                            handleApoderadoCiChange={handleApoderadoCiChange}
                            handleDatosApoderadoChange={(e) => {
                                const { name, value } = e.target;
                                setDatosApoderado(prev => ({ ...prev, [name]: value }));
                            }}
                            onSave={() => {}}
                        />

                    </div>

                    {/* DERECHA */}
                    <DocumentoTable
                        documentos={documentos}
                        isAddDocumentoFormVisible={isAddDocumentoFormVisible}
                        setIsAddDocumentoFormVisible={setIsAddDocumentoFormVisible}
                        newDocForm={newDocForm}
                        setNewDocForm={setNewDocForm}
                        handleAddDocumento={handleAddDocumento}
                        isDatosPersonalesSaved={isDatosPersonalesSaved}
                        handleDeleteDocumento={() => {}}
                        handleToggleDestino={() => {}}
                        onObserve={() => {}}
                    />

                </div>
            </div>
        </div>
    );
}

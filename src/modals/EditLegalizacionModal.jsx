import React, { useState, useEffect } from "react";
import { X, BookText } from "lucide-react";
import DatosPersonalesForm from "../components/Forms/DatosPersonalesForm";
import DatosApoderadoForm from "../components/forms/DatosApoderadoForm";
import DocumentoTable from "../components/DocumentoTable";
import { useModal } from "../hooks/useModal";
import { usePersona } from "../hooks/usePersona";
import api from "../api/axios";
import { toast } from "../utils/toast";

export default function EditLegalizacionModal({ tramiteData, guardarDatosTramite }) {
    const { closeModal } = useModal();
    if (!tramiteData) return null;

    const { cargarPersona, cargarApoderadoPorCi, cargarApoderadoPorTramite, guardarApoderado } = usePersona();

    // ---------------------------------------
    //  ESTADOS
    // ---------------------------------------
    const [isDatosPersonalesSaved, setIsDatosPersonalesSaved] = useState(!!tramiteData.per_nombre);
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

    // ---------------------------------------
    //  CARGAR DATOS INICIALES
    // ---------------------------------------
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1️⃣ Datos del trámite y documentos
                const res = await api.get(`/api/datos-tramite-legalizacion/${tramiteData.cod_tra}`);
                if (res.data.status === "success") {
                    const data = res.data.data;
                    console.log(res.data)
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

                    // APODERADO (si ya viene en la respuesta)
                    if (data.apoderado) {
                        setDatosApoderado({
                            ci: data.apoderado.apo_ci || "",
                            apellidos: data.apoderado.apo_apellido || "",
                            nombres: data.apoderado.apo_nombre || "",
                            tipoApoderado: data.tramite.tra_tipo_apoderado || "",
                        });
                        setIsApoderadoFormVisible(true);
                    }
                }

                // 2️⃣ Si hay cod_apo pero no vino apoderado en la respuesta
                if (tramiteData.cod_apo && (!res.data.data.apoderado || Object.keys(res.data.data.apoderado).length === 0)) {
                    const ap = await cargarApoderadoPorTramite(tramiteData.cod_tra);
                    console.log(ap,"edit")
                    if (ap) {
                        setDatosApoderado({
                            ci: ap.ap_ci,
                            apellidos: ap.ap_apellido,
                            nombres: ap.ap_nombre,
                            tipoApoderado: ap.ap_tipo || "",
                        });
                        setIsApoderadoFormVisible(true);
                    }
                }

            } catch (err) {
                console.error(err);
                toast.error("Error al cargar los datos del trámite");
            }
        };

        fetchData();
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
            setDatosPersonales(p => ({ ...p, apellidos: "", nombres: "" }));
        }
    };

    const handleDatosPersonalesChange = (e) => {
        const { name, value } = e.target;
        setDatosPersonales(prev => ({ ...prev, [name]: value }));
    };

    // ---------------------------------------
    //  GUARDAR DATOS PERSONALES
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
    {/* --- SOLO LA PARTE CORREGIDA --- */}

    const handleApoderadoCiChange = async (ci) => {
        setDatosApoderado(prev => ({ ...prev, ci }));

        if (ci.length < 3) return null;

        const ap = await cargarApoderadoPorCi(ci);

        if (ap) {
            const datos = {
            ci: ci,
            apellidos: ap.apo_apellido,
            nombres: ap.apo_nombre,
            tipoApoderado: "",
            };
            setDatosApoderado(datos);
            console.log(ap)
            return datos;
        } else {
            const datos = {
            ci,
            apellidos: "",
            nombres: "",
            tipoApoderado: "",
            };

            setDatosApoderado(datos);
            return null;
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
                            datosApoderado={datosApoderado}
                            handleApoderadoCiChange={handleApoderadoCiChange}
                            handleDatosApoderadoChange={(e) => {
                                const { name, value } = e.target;
                                setDatosApoderado(prev => ({ ...prev, [name]: value }));
                            }}
                            onSave={async (nuevoApoderado) => {
                                try {
                                    const form = new FormData();
                                    form.append("ctra", tramiteData.cod_tra);
                                    form.append("ci", nuevoApoderado.ci);
                                    form.append("nombre", nuevoApoderado.nombres);
                                    form.append("apellido", nuevoApoderado.apellidos);
                                    form.append("tipo", nuevoApoderado.tipoApoderado);  // 🔥 CORRECTO

                                    const res = await guardarApoderado(form);

                                    if (res.ok) {
                                    const apo = res.data.apoderado;

                                    setDatosApoderado({
                                        ci: apo.apo_ci,
                                        apellidos: apo.apo_apellido,
                                        nombres: apo.apo_nombre,
                                        tipoApoderado: apo.apo_tipo,
                                    });

                                    toast.success("Apoderado guardado correctamente");
                                    } else {
                                    toast.error(res.error);
                                    }
                                } catch (err) {
                                    toast.error("Error guardando apoderado");
                                }
                                }}
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
                        tramiteData={tramiteData}
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

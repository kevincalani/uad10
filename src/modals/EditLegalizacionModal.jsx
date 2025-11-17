import React, { useState, useEffect } from "react";
import { X, BookText } from "lucide-react";
import DatosPersonalesForm from "../components/forms/DatosPersonalesForm";
import DatosApoderadoForm from "../components/forms/DatosApoderadoForm";
import DocumentoTable from "../components/DocumentoTable";
import { useModal } from "../hooks/useModal";
import api from "../api/axios";

export default function EditLegalizacionModal({
    tramiteData,
    tramites,
    setTramites,
    showToast
}) {
    const { closeModal } = useModal();
    if (!tramiteData) return null;

    // ---------------------------------------
    //  ESTADOS
    // ---------------------------------------
    const [isDatosPersonalesSaved, setIsDatosPersonalesSaved] = useState(
        !!tramiteData.per_nombre
    );
    const [documentos, setDocumentos] = useState([]);
    const [isApoderadoFormVisible, setIsApoderadoFormVisible] = useState(false);
    const [datosPersonales, setDatosPersonales] = useState({
        ci: tramiteData.per_ci || "",
        pasaporte: "",
        apellidos: tramiteData.per_apellido || "",
        nombres: tramiteData.per_nombre || ""
    });
    const [datosApoderado, setDatosApoderado] = useState({
        ci: "",
        apellidos: "",
        nombres: "",
        tipoApoderado: ""
    });
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

    // ---------------------------------------
    //  CARGA INICIAL DE DATOS
    // ---------------------------------------
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const res = await api.get(`/api/datos-tramite-legalizacion/${tramiteData.cod_tra}`);
                if (res.data.status === "success") {
                    const data = res.data.data;
                  console.log(data)
                    // Datos personales
                    if (data.tramite) {
                        setDatosPersonales({
                            ci: data.tramite.per_ci || "",
                            pasaporte: data.tramite.per_pasaporte || "",
                            apellidos: data.tramite.per_apellido || "",
                            nombres: data.tramite.per_nombre || "",
                        });
                        setIsDatosPersonalesSaved(!!data.tramite.per_nombre);
                    }

                    // Documentos
                    setDocumentos(data.documentos || []);

                    // Apoderado
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
                showToast("error", "Error al cargar los datos del trámite");
            }
        };

        fetchInitialData();
    }, [tramiteData]);

    // ---------------------------------------
    //  DATOS PERSONALES
    // ---------------------------------------
    const handleCiChange = (e) => {
        setDatosPersonales(prev => ({ ...prev, ci: e.target.value }));
    };

    const handleDatosPersonalesChange = (e) => {
        const { name, value } = e.target;
        setDatosPersonales(prev => ({ ...prev, [name]: value }));
    };

    const handleDatosPersonalesSubmit = async () => {
        try {
            const res = await api.post("/api/g-traleg", {
                ci: datosPersonales.ci,
                nombre: datosPersonales.nombres,
                apellido: datosPersonales.apellidos,
                pasaporte: datosPersonales.pasaporte,
                ctra: tramiteData.id_tra,
            });

            const persona = res.data.data.persona;

            const merged = {
                ...tramiteData,
                per_ci: persona.per_ci,
                per_nombre: persona.per_nombre,
                per_apellido: persona.per_apellido,
            };

            setTramites(prev =>
                prev.map(t => t.id_tra === merged.id_tra ? merged : t)
            );

            setIsDatosPersonalesSaved(true);
            showToast("success", res.data.message);

        } catch (err) {
            console.error(err);
            showToast("error", "Error al guardar los datos personales");
        }
    };

    // ---------------------------------------
    //  APODERADO
    // ---------------------------------------
    const handleApoderadoCiChange = (e) => {
        setDatosApoderado(prev => ({ ...prev, ci: e.target.value }));
    };

    const handleDatosApoderadoChange = (e) => {
        const { name, value } = e.target;
        setDatosApoderado(prev => ({ ...prev, [name]: value }));
    };

    const handleGuardarApoderado = async () => {
        try {
            const res = await api.post("/api/guardar-apoderado", {
                ctra: tramiteData.id_tra,
                ci: datosApoderado.ci,
                apellido: datosApoderado.apellidos,
                nombre: datosApoderado.nombres,
                tipo: datosApoderado.tipoApoderado,
            });

            showToast("success", res.data.mensaje);
            setIsApoderadoFormVisible(false);

        } catch (err) {
            console.error(err);
            showToast("error", "Error al guardar apoderado");
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

            showToast("success", "Documento agregado correctamente");
            setIsAddDocumentoFormVisible(false);

        } catch (err) {
            console.error(err);
            showToast("error", "Error al agregar documento");
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
                            handleDatosPersonalesSubmit={handleDatosPersonalesSubmit}
                            isDatosPersonalesSaved={isDatosPersonalesSaved}
                        />

                        <DatosApoderadoForm
                            isApoderadoFormVisible={isApoderadoFormVisible}
                            setIsApoderadoFormVisible={setIsApoderadoFormVisible}
                            datosApoderado={datosApoderado}
                            handleApoderadoCiChange={handleApoderadoCiChange}
                            handleDatosApoderadoChange={handleDatosApoderadoChange}
                            onSave={handleGuardarApoderado}
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

import React, { useState,useEffect,useMemo } from 'react';
import {X,BookText, Eye,Info } from 'lucide-react';
import { TIPOS_LEGALIZACION } from '../Constants/tramiteDatos';
import DatosPersonalesForm from '../components/forms/DatosPersonalesForm';
import DatosApoderadoForm from '../components/forms/DatosApoderadoForm';
import DocumentoTable from '../components/DocumentoTable';
import ObservarTramiteModal from './ObservarTramiteModal';



// Simulación: Número de trámites en la BD para generar el Nro. Trámite consecutivo
const BASE_TRAMITES_COUNT = 250; 

// Componente principal del Modal
export default function EditLegalizacionModal({ 
    isOpen, 
    onClose, 
    tramiteData, 
    onUpdateTramite,
    isObserveModalOpen,
    openObserveModal,
    closeObserveModal,
    tramiteToObserve, // Trámite completo (solo usado para el Modal de Observación)
    docToObserve,
 }) {
    if (!isOpen || !tramiteData) return null;

    // --- ESTADOS ---
    const [isDatosPersonalesSaved, setIsDatosPersonalesSaved] = useState(!!tramiteData.nombre);
    const [documentos, setDocumentos] = useState(tramiteData.documentos || []);
    const [isApoderadoFormVisible, setIsApoderadoFormVisible] = useState(false);
    const [isAddDocumentoFormVisible, setIsAddDocumentoFormVisible] = useState(false);

    // Formulario de Documento
    const [newDocForm, setNewDocForm] = useState({
        tipoLegalizacion: TIPOS_LEGALIZACION[0].value,
        tipoTramite: 'EXTERNO',
        isPtag: false,
        isCuadis: false,
        nroTitulo1: '',
        nroTitulo2: '',
        isTituloSupletorio: false,
        nroControl: '',
        reintegro: '',
        nroControlBusqueda: '',
        nroControlReimpresion: '',
    });

    // --- Lógica de inicialización de Apellidos y Nombres (simplificada) ---
    const initialName = tramiteData.nombre || '';
    const initialNameParts = initialName.trim().split(/\s+/);
    // Asume que la última palabra es el nombre, el resto son apellidos
    const initialNombres = initialNameParts.length > 0 ? initialNameParts.slice(-1).join(' ') : '';
    const initialApellidos = initialNameParts.length > 1 ? initialNameParts.slice(0, -1).join(' ') : initialName;

    // Formulario de Datos Personales (Simulación de autocompletado)
    const [datosPersonales, setDatosPersonales] = useState({
        ci: tramiteData.ci || '', 
        pasaporte: tramiteData.pasaporte || '',
        apellidos: initialApellidos,
        nombres: initialNombres,
    });
    
    // Formulario de Apoderado
    const [datosApoderado, setDatosApoderado] = useState({
        ci: '',
        apellidos: '',
        nombres: '',
        tipoApoderado: '',
    });

    // 2. LÓGICA DE CÁLCULO DE ESTADO CONSOLIDADO DEL TRÁMITE
    const isTramiteBlocked = useMemo(() => 
        documentos.some(doc => doc.isBlocked)
    , [documentos]);
    
    const isTramiteObserved = useMemo(() => 
        documentos.some(doc => doc.isObserved)
    , [documentos]);
    
    const observacionConsolidada = useMemo(() => 
        documentos.filter(doc => doc.isObserved)
                  .map(doc => doc.observacion)
                  .join(' | ')
    , [documentos]);
    // Sincronizar documentos al abrir el modal
    useEffect(() => {
        if (isOpen && tramiteData) {
            setDocumentos(tramiteData.documentos || []);
            setIsDatosPersonalesSaved(!!tramiteData.nombre);
        }
    }, [isOpen, tramiteData]);
    
    // --- HANDLERS ---
    
    const handleDatosPersonalesSubmit = () => {

        const { ci, apellidos, nombres } = datosPersonales;

        // Concatenar Apellidos y Nombres
        const newNombre = `${apellidos.trim()} ${nombres.trim()}`.replace(/\s+/g, ' ');

        // Simular la actualización de los datos del trámite en la tabla padre
        if (onUpdateTramite) {
            onUpdateTramite(tramiteData.id, {
                ci: ci.trim(),
                nombre: newNombre, // El campo nombre actualizado
            });
        }
        
        // Bloquear el formulario
        setIsDatosPersonalesSaved(true);
        // Opcional: alert(`Datos personales guardados: ${newNombre} (${ci.trim()}).`);
    };
    // Simulación de Autocompletado de CI (Datos Personales)
    const handleCiChange = (e) => {
        const ci = e.target.value;
        setDatosPersonales(prev => ({ ...prev, ci }));
        
        // Simulación: Si CI = 123, autocompleta.
        if (ci === '123') {
            setDatosPersonales(prev => ({ 
                ...prev, 
                apellidos: 'García López', 
                nombres: 'María' 
            }));
            //
        }
    };
    
    // Simulación de Autocompletado de CI (Apoderado)
    const handleApoderadoCiChange = (e) => {
        const ci = e.target.value;
        setDatosApoderado(prev => ({ ...prev, ci }));
        
        // Simulación: Si CI = 456, autocompleta.
        if (ci === '456') {
            setDatosApoderado(prev => ({ 
                ...prev, 
                apellidos: 'Mamani Quispe', 
                nombres: 'Carlos' 
            }));
        } 
    };
    // Generic Change Handler para Datos Personales
    const handleDatosPersonalesChange = (e) => {
        const { name, value } = e.target;
        setDatosPersonales(prev => ({ ...prev, [name]: value }));
    };
    // Generic Change Handler para Apoderado
    const handleDatosApoderadoChange = (e) => {
        const { name, value } = e.target;
        setDatosApoderado(prev => ({ ...prev, [name]: value }));
    };

    const handleBackdropClick = (e) => {
        // Si el clic ocurrió directamente sobre el DIV principal (el backdrop),
        // y no sobre un hijo, cerramos el modal.
        if (e.target === e.currentTarget) {
        onClose();
        }
    };
    
    /** * MANEJADOR DE AGREGAR DOCUMENTO (Solo guarda y bloquea)
     * Lo llamará el componente hijo *después* de que la validación sea exitosa.
     */
    const handleAddDocumento = (newDocData) => {
        // ... (Tu lógica existente para añadir documento) ...
        const newId = Date.now();
        const newDoc = {
            id: newId, 
            nombre: newDocData.nombre, 
            numeroBd: BASE_TRAMITES_COUNT + documentos.length + 1, 
            nroTitulo: newDocData.nroTitulo,
            sitraVerificado: newDocData.sitraVerificado, 
            tipoTramite: 'EXTERNO', // Valor inicial
            isObserved: false, // Valor inicial
            isBlocked: false, // Valor inicial
            observacion: '',
        };

        const updatedDocs = [...documentos, newDoc];
        setDocumentos(updatedDocs);
        setIsAddDocumentoFormVisible(false);

        // 🆕 Actualizar el estado consolidado del trámite principal
        // Usamos la nueva lista de documentos para forzar el recálculo y guardado
        onUpdateTramite(tramiteData.id, { 
            documentos: updatedDocs,
            isObserved: updatedDocs.some(doc => doc.isObserved),
            isBlocked: updatedDocs.some(doc => doc.isBlocked),
            observacion: updatedDocs.filter(doc => doc.isObserved).map(doc => doc.nombre + ': ' + doc.observacion).join(' | '),
        });
    };
    
    // Toggle para EXTERNO/INTERNO
    const handleToggleDestino = (id) => {
        // No hay bloqueo aquí, se ejecuta normalmente
        const updatedDocs = documentos.map(doc => {
            if (doc.id === id) {
                 return {
                     ...doc,
                     tipoTramite: doc.tipoTramite === 'EXTERNO' ? 'INTERNO' : 'EXTERNO'
                    };
            }
            return doc;
        });
        setDocumentos(updatedDocs);

        // 🆕 Actualizar el estado consolidado del trámite principal (aunque no cambie)
        onUpdateTramite(tramiteData.id, { 
            documentos: updatedDocs,
            isObserved: updatedDocs.some(doc => doc.isObserved),
            isBlocked: updatedDocs.some(doc => doc.isBlocked),
            observacion: updatedDocs.filter(doc => doc.isObserved).map(doc => doc.nombre + ': ' + doc.observacion).join(' | '),
        });
    };
    
    // Eliminar fila de la tabla
    const handleDeleteDocumento = (id) => {
        const updatedDocs = documentos.filter(doc => doc.id !== id);
        setDocumentos(updatedDocs);

        // 🆕 Actualizar el estado consolidado del trámite principal
        onUpdateTramite(tramiteData.id, { 
            documentos: updatedDocs,
            isObserved: updatedDocs.some(doc => doc.isObserved),
            isBlocked: updatedDocs.some(doc => doc.isBlocked),
            observacion: updatedDocs.filter(doc => doc.isObserved).map(doc => doc.nombre + ': ' + doc.observacion).join(' | '),
        });
    };
    const handleObserveDocumento = (documento) => {
        // Abrir el modal de observación global, pero pasándole el documento específico
        openObserveModal(tramiteData, documento);
    };
    // HANDLER PARA GUARDAR OBSERVACIÓN DEL DOCUMENTO
    const handleSaveObservation = (data) => {
        // data contiene { observacion: string, bloquear: boolean }
        if (!docToObserve) return;
        
        const isObserved = !!data.observacion;
        
        // 1. Actualizar el documento en el estado local 'documentos'
        const updatedDocs = documentos.map(doc => 
            doc.id === docToObserve.id 
                ? { 
                    ...doc, 
                    isObserved: isObserved,
                    isBlocked: data.bloquear,
                    observacion: data.observacion,
                  } 
                : doc
        );
        setDocumentos(updatedDocs);

        // 2. 🆕 Actualizar el estado consolidado del trámite principal
        onUpdateTramite(tramiteData.id, { 
            documentos: updatedDocs,
            isObserved: updatedDocs.some(doc => doc.isObserved),
            isBlocked: updatedDocs.some(doc => doc.isBlocked),
            observacion: updatedDocs.filter(doc => doc.isObserved).map(doc => doc.nombre + ': ' + doc.observacion).join(' | '),
        });
        
        // 3. Cerrar el modal de observación
        closeObserveModal();
    };

    const handleSaveDatosPersonales = (datos) => {
        setIsDatosPersonalesSaved(true);
        // Cuando se guardan datos, también actualizamos el estado del trámite principal
        onUpdateTramite(tramiteData.id, { 
            nombre: datos.nombre, 
            ci: datos.ci,
        });
    };
    
    const handleSaveDocumentos = () => {
        // Si el usuario guarda el modal de edición, enviamos el estado de documentos y el estado consolidado
        onUpdateTramite(tramiteData.id, {
            documentos: documentos,
            isObserved: isTramiteObserved,
            isBlocked: isTramiteBlocked,
            observacion: observacionConsolidada,
        });
        onClose();
    };

    return (
    <>
        <div className="fixed inset-0 bg-gray-500/50 bg-opacity-50 flex justify-center items-center z-50 p-4"
            onClick={handleBackdropClick}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[95vh] overflow-y-auto">
        
                {/* 1. Header */}
                <div className="bg-blue-600 text-white p-4 flex justify-between items-center ">
                    <h3 className="text-xl font-semibold flex items-center">
                        <BookText className="mr-3 " size={32} />LEGALIZACIÓN
                        </h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>

                {/* Contenido del Modal (Cuerpo) */}
                <div className="p-6 flex-grow overflow-y-auto">
                    
                    {/* 2. Título del Formulario */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Formulario para editar Legalización</h2>

                    {/* 3. Cuerpo en Dos Partes */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        
                        {/* PARTE IZQUIERDA: Datos Personales y Apoderado */}
                        <div className="w-full lg:w-4/12 space-y-6">
                            
                            {/* Datos Personales Componente */}
                            <DatosPersonalesForm
                                tramiteData={tramiteData}
                                datosPersonales={datosPersonales}
                                handleCiChange={handleCiChange}
                                handleDatosPersonalesChange={handleDatosPersonalesChange}
                                handleDatosPersonalesSubmit={handleDatosPersonalesSubmit} // <-- Nuevo Handler
                                isDatosPersonalesSaved={isDatosPersonalesSaved} // <-- Nuevo Estado
                            />
                            
                            {/* Datos del Apoderado Componente */}
                            <DatosApoderadoForm
                                isApoderadoFormVisible={isApoderadoFormVisible}
                                setIsApoderadoFormVisible={setIsApoderadoFormVisible}
                                datosApoderado={datosApoderado}
                                handleApoderadoCiChange={handleApoderadoCiChange}
                                handleDatosApoderadoChange={handleDatosApoderadoChange}
                            />
                        </div>

                        {/* PARTE DERECHA: Documentos del Trámite (Sección Combinada) */}
                        <DocumentoTable
                            documentos={documentos}
                            isAddDocumentoFormVisible={isAddDocumentoFormVisible}
                            setIsAddDocumentoFormVisible={setIsAddDocumentoFormVisible}
                            newDocForm={newDocForm}
                            setNewDocForm={setNewDocForm}
                            handleToggleDestino={handleToggleDestino}
                            handleDeleteDocumento={handleDeleteDocumento}
                            handleAddDocumento={handleAddDocumento}
                            isDatosPersonalesSaved={isDatosPersonalesSaved}
                            onObserve={handleObserveDocumento}
                             isTramiteBlocked={isTramiteBlocked}
                        />

                    </div>
                    </div>
                </div>
            </div>
            <ObservarTramiteModal
                isOpen={isObserveModalOpen}
                onClose={closeObserveModal}
                // Se pasa el documento específico que se va a observar
                tramiteData={docToObserve} 
                onSave={handleSaveObservation}
            />
        </>
    );
}
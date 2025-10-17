import React, { useState, useMemo } from 'react';
import {X, CircleCheck, CircleMinus, Trash2, Eye, FilePenLine, FileCode,BookText } from 'lucide-react';
import { TIPOS_LEGALIZACION } from '../Constants/tramiteDatos';
import DatosPersonalesForm from '../components/forms/DatosPersonalesForm';
import DatosApoderadoForm from '../components/forms/DatosApoderadoForm';
import DocumentoTable from '../components/DocumentoTable';


// Simulación: Número de trámites en la BD para generar el Nro. Trámite consecutivo
const BASE_TRAMITES_COUNT = 250; 

// Componente principal del Modal
export default function EditLegalizacionModal({ isOpen, onClose, tramiteData }) {
    if (!isOpen || !tramiteData) return null;

    // --- ESTADOS ---
    const [isApoderadoFormVisible, setIsApoderadoFormVisible] = useState(false);
    const [isAddDocumentoFormVisible, setIsAddDocumentoFormVisible] = useState(false);
    const [documentos, setDocumentos] = useState([]); // Tabla de documentos

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

    // Formulario de Datos Personales (Simulación de autocompletado)
    const [datosPersonales, setDatosPersonales] = useState({
        ci: '',
        pasaporte: '',
        apellidos: '',
        nombres: '',
    });
    
    // Formulario de Apoderado
    const [datosApoderado, setDatosApoderado] = useState({
        ci: '',
        apellidos: '',
        nombres: '',
        tipoApoderado: '',
    });
    
    // --- HANDLERS ---
    
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
    // Agregar nuevo documento a la tabla
    const handleAddDocumento = (e) => {
        e.preventDefault();

        // Obtener el label de Tipo de Legalización
        const nombreTipo = TIPOS_LEGALIZACION.find(t => t.value === newDocForm.tipoLegalizacion)?.label || 'Desconocido';
        
        // Simulación del número consecutivo de la BD
        const newNumeroBd = BASE_TRAMITES_COUNT + documentos.length + 1;

        const newDocumento = {
            id: Date.now(),
            sitraVerificado: false, // Por defecto no verificado
            nombre: nombreTipo,
            tipoTramite: newDocForm.tipoTramite,
            numeroBd: newNumeroBd, 
            nroTitulo: `${newDocForm.nroTitulo1}/${newDocForm.nroTitulo2}`,
            // ... otros datos del formulario si fueran necesarios
        };

        setDocumentos(prev => [...prev, newDocumento]);
        setIsAddDocumentoFormVisible(false); // Ocultar formulario de adición
        
        // Opcional: Resetear formulario (mantendremos el estado para simplificar)
        // setNewDocForm({...});
    };
    
    // Toggle para EXTERNO/INTERNO
    const handleToggleDestino = (id) => {
        setDocumentos(prev => prev.map(doc => {
            if (doc.id === id) {
                return {
                    ...doc,
                    tipoTramite: doc.tipoTramite === 'EXTERNO' ? 'INTERNO' : 'EXTERNO'
                };
            }
            return doc;
        }));
    };
    
    // Eliminar fila de la tabla
    const handleDeleteDocumento = (id) => {
        if (window.confirm('¿Está seguro de eliminar este documento del trámite?')) {
            setDocumentos(prev => prev.filter(doc => doc.id !== id));
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-500/60 bg-opacity-50 flex justify-center items-center z-50 p-4"
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
                        <div className="w-full lg:w-5/12 space-y-6">
                            
                            {/* Datos Personales Componente */}
                            <DatosPersonalesForm
                                tramiteData={tramiteData}
                                datosPersonales={datosPersonales}
                                handleCiChange={handleCiChange}
                                handleDatosPersonalesChange={handleDatosPersonalesChange}
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
                        <DocumentosSection
                            documentos={documentos}
                            isAddDocumentoFormVisible={isAddDocumentoFormVisible}
                            setIsAddDocumentoFormVisible={setIsAddDocumentoFormVisible}
                            newDocForm={newDocForm}
                            setNewDocForm={setNewDocForm}
                            handleToggleDestino={handleToggleDestino}
                            handleDeleteDocumento={handleDeleteDocumento}
                            handleAddDocumento={handleAddDocumento}
                            tiposLegalizacion={TIPOS_LEGALIZACION} // Pasamos la constante
                        />

                    </div>
                    </div>
                </div>
            </div>
    );
}
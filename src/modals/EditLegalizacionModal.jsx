import React, { useState, useMemo } from 'react';
import {X, CircleCheck, CircleMinus, Trash2, Eye, FilePenLine, FileCode,BookText } from 'lucide-react';
import { TIPOS_LEGALIZACION } from '../Constants/tramiteDatos';

// Simulación: Número de trámites en la BD para generar el Nro. Trámite consecutivo
const BASE_TRAMITES_COUNT = 250; 

// Componente individual para la fila de Documentos del Trámite
const DocumentoRow = ({ doc, index, onToggleDestino, onDelete }) => {
    // Lógica para cambiar el estilo del nombre si es INTERNO
    const displayNombre = doc.tipoTramite === 'INTERNO' 
        ? <span className="text-red-600 font-semibold">{doc.nombre} (Int.)</span>
        : doc.nombre;
    
    // El formato del Nro. Trámite es consecutivo + año
    const currentYear = new Date().getFullYear();
    const numeroTramiteDisplay = `${doc.numeroBd}/${currentYear}`;

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900">{index + 1}</td>
            <td className="px-2 py-1 whitespace-nowrap text-xs">
                {/* Sitra (Simulación de Verificado) */}
                {doc.sitraVerificado ? (
                    <CircleCheck size={16} className="text-green-500" title="Verificado SITRA" />
                ) : (
                    <CircleMinus size={16} className="text-red-500" title="No Verificado SITRA" />
                )}
            </td>
            <td className="px-2 py-1 text-xs text-gray-800 font-medium">{displayNombre}</td>
            <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-500">{numeroTramiteDisplay}</td>
            <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-500">{doc.nroTitulo}</td>
            
            {/* Opciones */}
            <td className="px-2 py-1 whitespace-nowrap text-xs space-x-1">
                {/* Cambiar Destino (EXT/INT) */}
                <button 
                    onClick={() => onToggleDestino(doc.id)}
                    title="Cambiar Destino del Trámite"
                    className={`font-bold px-1 rounded text-xs transition duration-150 
                        ${doc.tipoTramite === 'EXTERNO' 
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                >
                    {doc.tipoTramite === 'EXTERNO' ? 'EXT' : 'INT'}
                </button>
                {/* Observado */}
                <button title="Observado (Modal)" className="text-blue-600 hover:text-blue-800">
                    <Eye size={16} />
                </button>
                {/* Generar Glosa */}
                <button title="Generar Glosa (Modal)" className="text-gray-500 hover:text-gray-700">
                    <FilePenLine size={16} />
                </button>
                {/* Ver Documento PDF */}
                <button title="Ver Documento PDF (Modal)" className="text-blue-600 hover:text-blue-800">
                    <FileCode size={16} />
                </button>
                {/* Eliminar */}
                <button onClick={() => onDelete(doc.id)} title="Eliminar Trámite" className="text-red-600 hover:text-red-800">
                    <Trash2 size={16} />
                </button>
            </td>
        </tr>
    );
};


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
        tipoApoderado: 'Declaracion Jurada',
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
        } else if (ci.length > 3) {
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
        } else if (ci.length > 3) {
            //
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
    
    // Fecha formateada para la tarjeta
    const cardDate = new Date(tramiteData.fechaSolicitud).toLocaleDateString('es-ES', { 
        day: '2-digit', month: '2-digit', year: 'numeric' 
    });
    
    // Componente auxiliar para campos con etiqueta fija (Corrección 1)
    const LabeledInput = ({ label, value, onChange, placeholder, readOnly = false, name }) => (
        <div className="flex items-center text-sm">
            <label className="w-20 text-gray-600 font-medium whitespace-nowrap">{label}</label>
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                readOnly={readOnly && !value} // Permitir edición si hay datos, forzar solo lectura si readOnly es true y NO hay valor (para autocompletado vacío)
                className={`w-full p-1 border border-gray-300 rounded ${readOnly ? 'bg-gray-50' : ''}`}
            />
        </div>
    );
    
    // Componente auxiliar para SELECT con etiqueta fija
    const LabeledSelect = ({ label, value, onChange, options, name }) => (
        <div className="flex items-center text-sm">
            <label className="w-20 text-gray-600 font-medium whitespace-nowrap">{label}</label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full p-1 border border-gray-300 rounded bg-white"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );

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
                            
                            {/* Datos Personales */}
                            <div className="border border-gray-200 p-4 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Datos Personales</h3>
                                
                                {/* Card de Número de Trámite */}
                                <div className="h-20 w-20 flex flex-col mb-3 text-center mx-auto border border-gray-200 rounded-lg shadow-sm ">
                                    <p className="text-4xl font-extrabold text-red-600">{tramiteData.numero}</p>
                                    <p className="text-sm text-gray-600">{cardDate}</p>
                                </div>
                                
                                {/* Formulario de Datos Personales */}
                                <form className="space-y-3 pb-3">
                                    <LabeledInput label="CI:" name="ci" value={datosPersonales.ci} onChange={handleCiChange} />
                                    <LabeledInput label="Pasaporte:" name="pasaporte" value={datosPersonales.pasaporte} onChange={handleDatosPersonalesChange} />
                                    {/* 🚨 Corrección 1: Campos de autocompletado editables */}
                                    <LabeledInput label="Apellidos:" name="apellidos" value={datosPersonales.apellidos} onChange={handleDatosPersonalesChange} />
                                    <LabeledInput label="Nombres:" name="nombres" value={datosPersonales.nombres} onChange={handleDatosPersonalesChange} />

                                    {/* 🚨 Corrección 2: Botón pequeño y a la derecha */}
                                    <div className="flex justify-end pt-2">
                                        <button type="submit" className="bg-green-500 text-white py-1 px-4 text-sm rounded font-medium hover:bg-green-600 transition">Guardar</button>
                                    </div>
                                </form>
                            </div>
                            
                            {/* Datos del Apoderado (Oculto/Visible) */}
                            <div className="border border-gray-200 p-4 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Datos del Apoderado</h3>
                                
                                {!isApoderadoFormVisible ? (
                                    <div className="flex justify-end">
                                        <button 
                                            onClick={() => setIsApoderadoFormVisible(true)}
                                            className="bg-blue-500 text-white py-1 px-4 text-sm rounded font-medium hover:bg-blue-600 transition"
                                        >
                                            Editar Datos
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                                            <h4 className="font-semibold text-gray-700">Editar Datos del Apoderado</h4>
                                            <button onClick={() => setIsApoderadoFormVisible(false)} className="text-red-500 hover:text-red-700">
                                                <X size={18} />
                                            </button>
                                        </div>
                                        
                                        {/* Formulario de Apoderado */}
                                        <form className="space-y-3 text-sm pb-3">
                                            <LabeledInput label="CI:" name="ci" value={datosApoderado.ci} onChange={handleApoderadoCiChange} />
                                            {/* 🚨 Corrección 1: Campos de autocompletado editables */}
                                            <LabeledInput label="Apellidos:" name="apellidos" value={datosApoderado.apellidos} onChange={handleDatosApoderadoChange} />
                                            <LabeledInput label="Nombres:" name="nombres" value={datosApoderado.nombres} onChange={handleDatosApoderadoChange} />
                                            
                                            <div className="flex items-center text-sm">
                                                <label className="w-20 text-gray-600 font-medium whitespace-nowrap">Tipo Apoderado:</label>
                                                <select 
                                                    name="tipoApoderado"
                                                    value={datosApoderado.tipoApoderado}
                                                    onChange={handleDatosApoderadoChange}
                                                    className="w-full p-1 border border-gray-300 rounded bg-white"
                                                >
                                                    {['Declaracion Jurada', 'Poder Notariado'].map(tipo => (
                                                        <option key={tipo} value={tipo}>{tipo}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            
                                            {/* 🚨 Corrección 2: Botón pequeño y a la derecha */}
                                            <div className="flex justify-end pt-2">
                                                <button type="submit" className="bg-green-500 text-white py-1 px-4 text-sm rounded font-medium hover:bg-green-600 transition">Guardar</button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PARTE DERECHA: Documentos del Trámite */}
                        <div className="w-full lg:w-7/12">
                            <div className="border border-gray-200 p-4 rounded-lg shadow-sm h-full flex flex-col">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Documentos del Trámite</h3>
                                
                                {/* Tabla de Documentos */}
                                <div className="overflow-auto mb-4" style={{ flexGrow: 1, minHeight: '100px', maxHeight: '100%' }}>
                                      <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                {['N°', 'Sitra', 'Nombre', 'Nro. Trámite', 'N° Título', 'Opciones'].map(header => (
                                                    <th key={header} className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {documentos.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-4 text-gray-500 text-sm">No hay documentos añadidos.</td>
                                                </tr>
                                            ) : (
                                                documentos.map((doc, index) => (
                                                    <DocumentoRow 
                                                        key={doc.id}
                                                        doc={doc}
                                                        index={index}
                                                        onToggleDestino={handleToggleDestino}
                                                        onDelete={handleDeleteDocumento}
                                                    />
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* Botón Añadir Trámite */}
                                {!isAddDocumentoFormVisible && (
                                    <div className="flex justify-end mt-2 flex-shrink-0">
                                        <button 
                                            onClick={() => setIsAddDocumentoFormVisible(true)}
                                            className="bg-blue-600 text-white py-1 px-4 text-sm rounded font-medium hover:bg-blue-700 transition"
                                        >
                                            + Trámite
                                        </button>
                                    </div>
                                )}

                                {/* Formulario para Añadir Trámite (Oculto/Visible) */}
                                {isAddDocumentoFormVisible && (
                                    <div className="mt-4 p-4 border border-blue-300 rounded-lg bg-blue-50 flex-shrink-0">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-semibold text-gray-700">Añadir Trámite</h4>
                                            <button onClick={() => setIsAddDocumentoFormVisible(false)} className="text-red-500 hover:text-red-700">
                                                <X size={18} />
                                            </button>
                                        </div>
                                        
                                        <form onSubmit={handleAddDocumento} className="space-y-3 text-sm">
                                            
                                            {/* Tipo de Legalización */}
                                            <LabeledSelect 
                                                label="Tipo Leg.:"
                                                name="tipoLegalizacion"
                                                value={newDocForm.tipoLegalizacion}
                                                onChange={(e) => setNewDocForm(prev => ({...prev, tipoLegalizacion: e.target.value}))}
                                                options={TIPOS_LEGALIZACION.map(t => ({value: t.value, label: t.label}))}
                                            />
                                                
                                            {/* Tipo de Trámite (Radio Buttons) y Checkboxes (Corrección 3) */}
                                            <div className="flex items-center space-x-4">
                                                <span className="w-20 text-gray-600 font-medium whitespace-nowrap flex-shrink-0">Tipo Trámite:</span>
                                                <label className="flex items-center space-x-1">
                                                    <input 
                                                        type="radio" 
                                                        name="tipoTramite"
                                                        value="EXTERNO"
                                                        checked={newDocForm.tipoTramite === 'EXTERNO'}
                                                        onChange={(e) => setNewDocForm(prev => ({...prev, tipoTramite: e.target.value}))}
                                                    />
                                                    <span>EXTERNO</span>
                                                </label>
                                                <label className="flex items-center space-x-1">
                                                    <input 
                                                        type="radio" 
                                                        name="tipoTramite"
                                                        value="INTERNO"
                                                        checked={newDocForm.tipoTramite === 'INTERNO'}
                                                        onChange={(e) => setNewDocForm(prev => ({...prev, tipoTramite: e.target.value}))}
                                                    />
                                                    <span>INTERNO</span>
                                                </label>

                                                <div className="h-5 w-px bg-red-500 mx-2"></div>
                                                
                                                <label className="flex items-center space-x-1">
                                                    <input type="checkbox" checked={newDocForm.isPtag} onChange={(e) => setNewDocForm(prev => ({...prev, isPtag: e.target.checked}))} />
                                                    <span>PTAG</span>
                                                </label>
                                                <label className="flex items-center space-x-1">
                                                    <input type="checkbox" checked={newDocForm.isCuadis} onChange={(e) => setNewDocForm(prev => ({...prev, isCuadis: e.target.checked}))} />
                                                    <span>CUADIS</span>
                                                </label>
                                            </div>

                                            {/* Nro Título o Resolución */}
                                            <div className="flex items-center text-sm">
                                                <label className="w-20 text-gray-600 font-medium whitespace-nowrap">Nro Título/Res.:</label>
                                                <input 
                                                    type="text" 
                                                    value={newDocForm.nroTitulo1}
                                                    onChange={(e) => setNewDocForm(prev => ({...prev, nroTitulo1: e.target.value}))}
                                                    className="p-1 border border-gray-300 rounded w-16 text-center" 
                                                />
                                                <span className="font-bold mx-1">/</span>
                                                <input 
                                                    type="text" 
                                                    value={newDocForm.nroTitulo2}
                                                    onChange={(e) => setNewDocForm(prev => ({...prev, nroTitulo2: e.target.value}))}
                                                    className="p-1 border border-gray-300 rounded w-16 text-center" 
                                                />
                                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">(ej. 1999)</span>
                                                <label className="flex items-center space-x-1 ml-auto">
                                                    <input type="checkbox" checked={newDocForm.isTituloSupletorio} onChange={(e) => setNewDocForm(prev => ({...prev, isTituloSupletorio: e.target.checked}))} />
                                                    <span className="whitespace-nowrap">Supletorio</span>
                                                </label>
                                            </div>
                                            
                                            {/* Inputs de Control */}
                                            <LabeledInput label="Nro Control:" name="nroControl" value={newDocForm.nroControl} onChange={(e) => setNewDocForm(prev => ({...prev, nroControl: e.target.value}))} />
                                            <LabeledInput label="Reintegro:" name="reintegro" value={newDocForm.reintegro} onChange={(e) => setNewDocForm(prev => ({...prev, reintegro: e.target.value}))} />
                                            <LabeledInput label="Nro Control Busqueda:" name="nroControlBusqueda" value={newDocForm.nroControlBusqueda} onChange={(e) => setNewDocForm(prev => ({...prev, nroControlBusqueda: e.target.value}))} />
                                            <LabeledInput label="Nro Control Reimpresión:" name="nroControlReimpresion" value={newDocForm.nroControlReimpresion} onChange={(e) => setNewDocForm(prev => ({...prev, nroControlReimpresion: e.target.value}))} />

                                            {/* Botón Crear */}
                                            {/* 🚨 Corrección 4: Botón pequeño y a la derecha */}
                                            <div className="flex justify-end pt-2">
                                                <button type="submit" className="bg-green-500 text-white py-1 px-4 text-sm rounded font-medium hover:bg-green-600 transition">
                                                    + Crear
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
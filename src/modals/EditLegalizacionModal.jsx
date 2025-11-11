import React, { useState, useEffect, useMemo } from 'react';
import { X, BookText } from 'lucide-react';
import { TIPOS_LEGALIZACION } from '../Constants/tramiteDatos';
import DatosPersonalesForm from '../components/forms/DatosPersonalesForm';
import DatosApoderadoForm from '../components/forms/DatosApoderadoForm';
import DocumentoTable from '../components/DocumentoTable';
import ObservarTramiteModal from './ObservarTramiteModal';
import { useModal } from '../hooks/useModal';

// Simulación: Número de trámites en la BD
const BASE_TRAMITES_COUNT = 250; 

export default function EditLegalizacionModal({ tramiteData, onUpdateTramite }) {
  const { openModal, closeModal } = useModal();

  if (!tramiteData) return null;

  // --- ESTADOS ---
  const [isDatosPersonalesSaved, setIsDatosPersonalesSaved] = useState(!!tramiteData.nombre);
  const [documentos, setDocumentos] = useState(tramiteData.documentos || []);
  const [isApoderadoFormVisible, setIsApoderadoFormVisible] = useState(false);
  const [isAddDocumentoFormVisible, setIsAddDocumentoFormVisible] = useState(false);

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

  const initialName = tramiteData.nombre || '';
  const initialNameParts = initialName.trim().split(/\s+/);
  const initialNombres = initialNameParts.length > 0 ? initialNameParts.slice(-1).join(' ') : '';
  const initialApellidos = initialNameParts.length > 1 ? initialNameParts.slice(0, -1).join(' ') : initialName;

  const [datosPersonales, setDatosPersonales] = useState({
    ci: tramiteData.ci || '', 
    pasaporte: tramiteData.pasaporte || '',
    apellidos: initialApellidos,
    nombres: initialNombres,
  });
  
  const [datosApoderado, setDatosApoderado] = useState({
    ci: '',
    apellidos: '',
    nombres: '',
    tipoApoderado: '',
  });

  // --- MEMO PARA ESTADOS CONSOLIDADOS ---
  const isTramiteBlocked = useMemo(() => documentos.some(doc => doc.isBlocked), [documentos]);
  const isTramiteObserved = useMemo(() => documentos.some(doc => doc.isObserved), [documentos]);
  const observacionConsolidada = useMemo(
    () => documentos.filter(doc => doc.isObserved).map(doc => doc.observacion).join(' | '),
    [documentos]
  );

  useEffect(() => {
    setDocumentos(tramiteData.documentos || []);
    setIsDatosPersonalesSaved(!!tramiteData.nombre);
  }, [tramiteData]);

  // --- HANDLERS ---
  const handleDatosPersonalesSubmit = () => {
    const { ci, apellidos, nombres } = datosPersonales;
    const newNombre = `${apellidos.trim()} ${nombres.trim()}`.replace(/\s+/g, ' ');
    onUpdateTramite(tramiteData.id, { ci: ci.trim(), nombre: newNombre });
    setIsDatosPersonalesSaved(true);
  };

  const handleCiChange = (e) => {
    const ci = e.target.value;
    setDatosPersonales(prev => ({ ...prev, ci }));
    if (ci === '123') setDatosPersonales(prev => ({ ...prev, apellidos: 'García López', nombres: 'María' }));
  };

  const handleApoderadoCiChange = (e) => {
    const ci = e.target.value;
    setDatosApoderado(prev => ({ ...prev, ci }));
    if (ci === '456') setDatosApoderado(prev => ({ ...prev, apellidos: 'Mamani Quispe', nombres: 'Carlos' }));
  };

  const handleDatosPersonalesChange = (e) => {
    const { name, value } = e.target;
    setDatosPersonales(prev => ({ ...prev, [name]: value }));
  };

  const handleDatosApoderadoChange = (e) => {
    const { name, value } = e.target;
    setDatosApoderado(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDocumento = (newDocData) => {
    const newId = Date.now();
    const newDoc = {
      id: newId, 
      nombre: newDocData.nombre, 
      numeroBd: BASE_TRAMITES_COUNT + documentos.length + 1, 
      nroTitulo: newDocData.nroTitulo,
      sitraVerificado: newDocData.sitraVerificado, 
      tipoTramite: 'EXTERNO', 
      isObserved: false, 
      isBlocked: false, 
      observacion: '',
    };
    const updatedDocs = [...documentos, newDoc];
    setDocumentos(updatedDocs);
    setIsAddDocumentoFormVisible(false);
    onUpdateTramite(tramiteData.id, { 
      documentos: updatedDocs,
      isObserved: updatedDocs.some(doc => doc.isObserved),
      isBlocked: updatedDocs.some(doc => doc.isBlocked),
      observacion: updatedDocs.filter(doc => doc.isObserved).map(doc => doc.nombre + ': ' + doc.observacion).join(' | '),
    });
  };

  const handleObserveDocumento = (documento) => {
    openModal(ObservarTramiteModal, {
      tramiteData: documento,
      onSave: (data) => {
        const updatedDocs = documentos.map(doc => 
          doc.id === documento.id 
            ? { ...doc, isObserved: !!data.observacion, isBlocked: data.bloquear, observacion: data.observacion }
            : doc
        );
        setDocumentos(updatedDocs);
        onUpdateTramite(tramiteData.id, { 
          documentos: updatedDocs,
          isObserved: updatedDocs.some(doc => doc.isObserved),
          isBlocked: updatedDocs.some(doc => doc.isBlocked),
          observacion: updatedDocs.filter(doc => doc.isObserved).map(doc => doc.nombre + ': ' + doc.observacion).join(' | '),
        });
        closeModal();
      }
    });
  };

  const handleToggleDestino = (id) => {
    const updatedDocs = documentos.map(doc => {
      if (doc.id === id) return { ...doc, tipoTramite: doc.tipoTramite === 'EXTERNO' ? 'INTERNO' : 'EXTERNO' };
      return doc;
    });
    setDocumentos(updatedDocs);
    onUpdateTramite(tramiteData.id, { 
      documentos: updatedDocs,
      isObserved: updatedDocs.some(doc => doc.isObserved),
      isBlocked: updatedDocs.some(doc => doc.isBlocked),
      observacion: updatedDocs.filter(doc => doc.isObserved).map(doc => doc.nombre + ': ' + doc.observacion).join(' | '),
    });
  };

  const handleDeleteDocumento = (id) => {
    const updatedDocs = documentos.filter(doc => doc.id !== id);
    setDocumentos(updatedDocs);
    onUpdateTramite(tramiteData.id, { 
      documentos: updatedDocs,
      isObserved: updatedDocs.some(doc => doc.isObserved),
      isBlocked: updatedDocs.some(doc => doc.isBlocked),
      observacion: updatedDocs.filter(doc => doc.isObserved).map(doc => doc.nombre + ': ' + doc.observacion).join(' | '),
    });
  };

  // --- RENDER ---
  return (
    <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[95vh] overflow-y-auto">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold flex items-center">
          <BookText className="mr-3" size={32} />LEGALIZACIÓN
        </h3>
        <button onClick={closeModal} className="text-white hover:text-gray-200">
          <X size={24} />
        </button>
      </div>

      {/* Cuerpo */}
      <div className="p-6 flex-grow overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Formulario para editar Legalización</h2>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Parte Izquierda */}
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
            />
          </div>

          {/* Parte Derecha */}
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
  );
}

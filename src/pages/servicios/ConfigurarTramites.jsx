import React, { useState } from 'react';
import TramiteActionButton from '../../components/TramiteActionButton'
import {TRAMITE_COLORS, GLOSAS_MOCK_DATA} from '../../Constants/tramiteDatos'
import AddEditTramiteModal from '../../modals/AddEditTramiteModal';
import GlosaModal from '../../modals/GlosaModal';
import DeleteConfirmModal from '../../modals/DeleteConfirmModal';


// Datos de ejemplo para la tabla (Estado 'habilitado' controla el color de la fila)
const initialTramites = [
  { id: 1, tipo: 'Legalizacion', nombre: 'Legalización de Título', cuenta: '001', asociado: 'Dra. María', duracion: '24h', costo: '150 Bs.', habilitado: true },
  { id: 2, tipo: 'Certificacion', nombre: 'Certificado de Notas', cuenta: '002', asociado: 'Ing. Juan', duracion: '48h', costo: '50 Bs.', habilitado: true },
  { id: 3, tipo: 'Confrontacion', nombre: 'Confrontación de Documento', cuenta: '003', asociado: 'Lic. Ana', duracion: '12h', costo: '20 Bs.', habilitado: false },
  { id: 4, tipo: 'Busqueda', nombre: 'Búsqueda de Archivo', cuenta: '004', asociado: 'Dr. Lopez', duracion: '72h', costo: '10 Bs.', habilitado: true },
  { id: 5, tipo: 'No atentado', nombre: 'Trámite No Atentado', cuenta: '005', asociado: 'Sra. Rosa', duracion: '24h', costo: '0 Bs.', habilitado: false },
  { id: 6, tipo: 'Certificacion', nombre: 'Certificado de Notas', cuenta: '002', asociado: 'Ing. Juan', duracion: '48h', costo: '50 Bs.', habilitado: true },
  { id: 7, tipo: 'Confrontacion', nombre: 'Confrontación de Documento', cuenta: '003', asociado: 'Lic. Ana', duracion: '12h', costo: '20 Bs.', habilitado: false },
  { id: 8, tipo: 'Busqueda', nombre: 'Búsqueda de Archivo', cuenta: '004', asociado: 'Dr. Lopez', duracion: '72h', costo: '10 Bs.', habilitado: true },
  { id: 9, tipo: 'No atentado', nombre: 'Trámite No Atentado', cuenta: '005', asociado: 'Sra. Rosa', duracion: '24h', costo: '0 Bs.', habilitado: false },
  { id: 10, tipo: 'Busqueda', nombre: 'Búsqueda de Archivo', cuenta: '004', asociado: 'Dr. Lopez', duracion: '72h', costo: '10 Bs.', habilitado: true },
  { id: 11, tipo: 'No atentado', nombre: 'Trámite No Atentado', cuenta: '005', asociado: 'Sra. Rosa', duracion: '24h', costo: '0 Bs.', habilitado: false },
  { id: 12, tipo: 'Certificacion', nombre: 'Certificado de Notas', cuenta: '002', asociado: 'Ing. Juan', duracion: '48h', costo: '50 Bs.', habilitado: true },
  { id: 13, tipo: 'Confrontacion', nombre: 'Confrontación de Documento', cuenta: '003', asociado: 'Lic. Ana', duracion: '12h', costo: '20 Bs.', habilitado: false },
  { id: 14, tipo: 'Busqueda', nombre: 'Búsqueda de Archivo', cuenta: '004', asociado: 'Dr. Lopez', duracion: '72h', costo: '10 Bs.', habilitado: true },
  { id: 15, tipo: 'No atentado', nombre: 'Trámite No Atentado', cuenta: '005', asociado: 'Sra. Rosa', duracion: '24h', costo: '0 Bs.', habilitado: false },
];

export default function ConfigurarTramites() {
  const [tramites, setTramites] = useState(initialTramites);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedTramiteId, setSelectedTramiteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [glosasData, setGlosasData] = useState(GLOSAS_MOCK_DATA);

  const selectedTramite = tramites.find(t => t.id === selectedTramiteId);
  
   // 🚨 SIMULACIÓN DE LÓGICA DE PROTECCIÓN (Se verifica al renderizar el modal)
  // Usaremos un ID fijo para la prueba, pero esto vendría de una verificación de datos real.
  const isTramiteProtected = selectedTramiteId === 1; 

  // Logica de Modales y Acciones
  const openModal = (type, id = null) => {
    setModalType(type);
    setSelectedTramiteId(id);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedTramiteId(null);
  };

  const handleToggleHabilitar = (id) => {
    setTramites(tramites.map(tramite => 
      tramite.id === id ? { ...tramite, habilitado: !tramite.habilitado } : tramite
    ));
  };
  
  const handleFormSubmit = (formData) => {
      console.log('Datos enviados:', formData, 'Tipo de modal:', modalType, 'ID seleccionado:', selectedTramiteId);
      // Aquí iría la lógica para guardar/actualizar el trámite
      // Si modalType es 'add-Legalizacion', añades un nuevo trámite
      // Si modalType es 'editar-Legalizacion', actualizas el trámite con selectedTramiteId
      
      if (modalType.startsWith('add-')) {
          const newId = Math.max(...tramites.map(t => t.id)) + 1; // Genera un nuevo ID
          const newTramite = { id: newId, tipo: modalType.substring(4), ...formData, habilitado: true };
          setTramites(prev => [...prev, newTramite]);
      } else if (modalType.startsWith('editar-')) {
          setTramites(prev => prev.map(t => t.id === selectedTramiteId ? { ...t, ...formData } : t));
      }
      closeModal();
  };

  // 🚨 FUNCIÓN FALTANTE: Confirma la eliminación de un Trámite
    const handleConfirmDeleteTramite = () => {
        if (!selectedTramiteId) return;

        // 1. Lógica de Eliminación (simulación de actualización de estado)
        setTramites(prev => prev.filter(t => t.id !== selectedTramiteId));

        // 2. Cierra el modal
        closeModal();
        
        // Aquí iría tu llamada a la API o cualquier otra acción de limpieza
        console.log(`Trámite ID: ${selectedTramiteId} eliminado del estado.`);
    };

  // Lógica de filtrado y paginación
  const filteredTramites = tramites.filter(tramite => 
    tramite.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTramites.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentTramites = filteredTramites.slice(startIndex, startIndex + rowsPerPage);
  const totalEntries = tramites.length;


  // ----------------------------------------------------------------------
  // RENDERIZADO PRINCIPAL
  // ----------------------------------------------------------------------
  return (
    <div className='p-6 bg-gray-100'>  
      <div className="p-8 bg-white rounded-lg shadow-md">
        
        {/* 1. Título de la Página */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Configuración de Trámites</h1>
        
        {/* 2. Botones de Acción (Añadir Trámites) */}
        <div className="flex flex-wrap gap-4 mb-8 justify-start">
        {['Legalizacion', 'Certificacion', 'Confrontacion', 'Busqueda', 'No atentado', 'Consejero'].map(type => (
            // PASAMOS LA FUNCIÓN 'openModal' COMO PROP 'onClick'
            <TramiteActionButton 
                key={type} 
                type={type} 
                onClick={(clickedType) => openModal('add-' + clickedType)} 
            />))}
      </div>

        {/* 3. y 4. Cabecera y Controles de la Tabla */}
        <h2 className="text-center text-2xl font-semibold mb-4 text-gray-700">Lista de Trámites</h2>
        
        <div className="flex justify-between items-center mb-4 flex-wrap">
          
          {/* Límite de Entradas */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2 sm:mb-0">
            <label htmlFor="rowsPerPage">Mostrando</label>
            <select 
              id="rowsPerPage" 
              value={rowsPerPage} 
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded p-1"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="500">500</option>
            </select>
            <span>entradas</span>
          </div>
          
          {/* Filtro de Búsqueda */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded py-2 px-4 pl-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {/* Icono de búsqueda */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>
        </div>
        
        {/* Tabla de Datos */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['N°', 'Tipo', 'Nombre', 'N° Cuenta', 'Asociado', 'Duración', 'Costo', 'Opciones'].map(header => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTramites.length > 0 ? (
                  currentTramites.map((tramite) => (
                      <tr 
                        key={tramite.id} 
                        // Aplica la clase de fondo rojo si no está habilitado
                        className={tramite.habilitado ? 'hover:bg-gray-100' : 'bg-red-100 hover:bg-red-200 transition duration-150'} 
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tramite.id}</td>
                        
                        {/* Columna Tipo con TAG de color */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${TRAMITE_COLORS[tramite.tipo].base} text-white`}
                          >
                            {tramite.tipo}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tramite.nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tramite.cuenta}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tramite.asociado}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tramite.duracion}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{tramite.costo}</td>
                        
                        {/* Columna Opciones */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                          
                          {/* 1. Editar Trámite */}
                          <button 
                              onClick={() => openModal('editar-' + tramite.tipo, tramite.id)}
                              className="text-blue-600 hover:text-blue-900" 
                              title="Editar Trámite"
                          >
                              ✏️
                          </button>
                          
                          {/* 2. Glosa */}
                          <button 
                              onClick={() => openModal('glosa', tramite.id)}
                              className="text-purple-600 hover:text-purple-900"
                              title="Glosa"
                          >
                              📜
                          </button>
                          
                          {/* 3. Habilitar/Deshabilitar Tramite */}
                          <button 
                              onClick={() => handleToggleHabilitar(tramite.id)}
                              className={tramite.habilitado ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'}
                              title={tramite.habilitado ? 'Deshabilitar' : 'Habilitar'}
                          >
                              {/* Íconos según el estado */}
                              {tramite.habilitado ? '✅' : '❌'} 
                          </button>
                          
                          {/* 4. Eliminar Trámite */}
                          <button 
                              onClick={() => openModal('eliminar', tramite.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Eliminar Trámite"
                          >
                              🗑️
                          </button>
                        </td>
                      </tr>
                  ))
              ) : (
                  <tr>
                      <td colSpan="8" className="text-center py-4 text-gray-500">No se encontraron trámites.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* 5. Paginación y Resumen de Entradas */}
        <div className="flex justify-between items-center mt-4 flex-wrap">
          
          {/* Resumen de Entradas */}
          <div className="text-sm text-gray-600 mb-2 sm:mb-0">
              Mostrando {Math.min(startIndex + 1, filteredTramites.length)} a {Math.min(startIndex + rowsPerPage, filteredTramites.length)} de {filteredTramites.length} entradas ({totalEntries} en total).
          </div>
          
          {/* Controles de Paginación */}
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            
            {/* Numeración simple, puedes ampliar esto para más páginas */}
            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-500 text-sm font-medium text-white">
                {currentPage}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
            </button>
            
          </nav>
        </div>

{/* Modal de Añadir o Editar Trámite (AddEditTramiteModal) */}
        {isModalOpen && (modalType.startsWith('add-') || modalType.startsWith('editar-')) && (
            <AddEditTramiteModal
              isOpen={isModalOpen}
              onClose={closeModal}
              // El tipo de trámite se extrae del modalType (e.g., 'add-Legalizacion' -> 'Legalizacion')
              type={modalType.startsWith('add-') ? modalType.substring(4) : modalType.substring(7)}
              // Determina el título
              title={modalType.startsWith('add-') ? `Añadir Trámite: ${modalType.substring(4)}` : `Editar Trámite: ${modalType.substring(7)}`}
              // Si es edición, se le pasan los datos del trámite seleccionado
              initialData={selectedTramiteId ? tramites.find(t => t.id === selectedTramiteId) : {}}
              onSubmit={handleFormSubmit}
            />
        )}
        
        {/* Renderizado del AddEditTramiteModal (Añadir/Editar Trámite) */}
        {isModalOpen && (modalType.startsWith('add-') || modalType.startsWith('editar-')) && (
            <AddEditTramiteModal
              // ... (Props de Añadir/Editar Trámite) ...
            />
        )}
        
        {/* Renderizado del GlosaMainModal (Configuración de Glosas) */}
        {isModalOpen && modalType === 'glosa' && selectedTramite && (
            <GlosaModal
                isOpen={isModalOpen}
                onClose={closeModal}
                tramite={selectedTramite} // Le pasamos el objeto completo del trámite
                glosasData={glosasData}    // Datos actuales de las glosas
                setGlosasData={setGlosasData} // Función para actualizar los datos de glosa
            />
        )}
        
        {/* Placeholder para Modal de Eliminar */}
        {isModalOpen && modalType === 'eliminar' && selectedTramite && (
            <DeleteConfirmModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleConfirmDeleteTramite}
                itemType="tramite"
                // 🚨 Pasar los datos del trámite
                itemData={selectedTramite}
                // 🚨 Pasar el estado de protección. El modal se encarga de cambiar el contenido.
                isProtected={isTramiteProtected} 
            />
        )}        
      </div>
  </div>
  );
}
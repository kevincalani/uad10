import React, { useState, useEffect } from 'react';
import TramiteActionButton from '../../components/TramiteActionButton'
import {TRAMITE_COLORS, GLOSAS_MOCK_DATA, TIPO_TRAMITE} from '../../Constants/tramiteDatos'
import AddEditTramiteModal from '../../modals/AddEditTramiteModal';
import GlosaModal from '../../modals/GlosaModal';
import DeleteConfirmModal from '../../modals/DeleteConfirmModal';
import api from '../../api/axios';

export default function ConfigurarTramites() {
  const [tramites, setTramites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedTramiteId, setSelectedTramiteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [glosasData, setGlosasData] = useState(GLOSAS_MOCK_DATA);

useEffect(() => {
    fetchTramites();
  }, []);

  const fetchTramites = async () => {
  try {
    const response = await api.get('/api/tramites'); 
    console.log('response.data:', response.data);

    const dataObj = response.data.data;

    // Convertimos el objeto en un array
    const tramitesArray = Object.values(dataObj);

    if (tramitesArray.length > 0) {
      const mappedTramites = tramitesArray.map(t => ({
        id: t.cod_tre,
        nombre: t.tre_nombre,
        tipo: TIPO_TRAMITE[t.tre_tipo] || "",
        cuenta: t.tre_numero_cuenta || '',
        duracion: t.tre_duracion || '',
        costo: t.tre_costo || 0,
        habilitado: t.tre_hab === 't',
        asociado: t.tre_glosa || '',
      }));

      setTramites(mappedTramites);
      console.log(mappedTramites, "tramites mapeados");
    } else {
      setTramites([]);
      console.log("No se encontraron trámites");
    }

  } catch (error) {
    console.error('Error al cargar trámites:', error);
    setTramites([]);
  }
};


  const selectedTramite = Array.isArray(tramites)
  ? tramites.find(t => t.id === selectedTramiteId)
  : null;

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

   const handleToggleHabilitar = async (id) => {
    const tramite = tramites.find(t => t.id === id);
    if (!tramite) return;

    try {
      // Llamada PATCH a la API para habilitar/deshabilitar
      await api.patch(`/api/tramite/toggle/${id}`);
      
      // Actualizamos localmente
      setTramites(prev => prev.map(t => 
        t.id === id ? { ...t, habilitado: !t.habilitado } : t
      ));
    } catch (error) {
      console.error('Error al actualizar el estado del trámite:', error);
    }
  };
  
  const handleFormSubmit = async (formData) => {
    try {
      if (modalType.startsWith('add-')) {
        const tipo = modalType.substring(4);
        const response = await api.post('/api/tramite', { tipo, ...formData });
        setTramites(prev => [...prev, response.data]); // Suponemos que la API devuelve el trámite creado
      } else if (modalType.startsWith('editar-')) {
        const tipo = modalType.substring(7);
        const response = await api.post('/api/tramite', { id: selectedTramiteId, tipo, ...formData });
        setTramites(prev => prev.map(t => t.id === selectedTramiteId ? response.data : t));
      }
      closeModal();
    } catch (error) {
      console.error('Error al guardar trámite:', error);
    }
  };

    const handleConfirmDeleteTramite = async () => {
      if (!selectedTramiteId) return;
      try {
        await api.delete(`/api/tramite?id=${selectedTramiteId}`);
        setTramites(prev => prev.filter(t => t.id !== selectedTramiteId));
        closeModal();
      } catch (error) {
        console.error('Error al eliminar trámite:', error);
      }
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
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${TRAMITE_COLORS[tramite.tipo]?.base} text-white`}
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
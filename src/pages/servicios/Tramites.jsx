import React, { useState, useMemo } from 'react';
import ConfirmModal from '../../modals/ConfirmModal';
import { TRAMITE_COLORS } from '../../Constants/tramiteDatos'; 
import { BookText, CircleArrowRight } from 'lucide-react';
import EditLegalizacionModal from '../../modals/EditLegalizacionModal';

// Función auxiliar para formatear la fecha a 'YYYY-MM-DD'
const formatDate = (date) => date.toISOString().split('T')[0];


export default function Tramites() {
    
    const today = useMemo(() => formatDate(new Date()), []);
    
    // 2. Campo Buscar Fecha (Por defecto en la fecha actual)
    const [selectedDate, setSelectedDate] = useState(today);
    const [tramites, setTramites] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Estado para el modal de confirmación rápida
    const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);
    const [quickModalData, setQuickModalData] = useState({});
    //  estado para el Modal de Edición
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [tramiteToEdit, setTramiteToEdit] = useState(null);
    // 3. Condición para habilitar botones
    const isToday = selectedDate === today;

    // Tipos de trámites que añaden un elemento y abren el modal de confirmación
    const ADD_TRAMITE_TYPES = ['Legalizacion', 'Certificacion', 'Busqueda', 'Consejo'];

    // Tipos de trámites que abren otro modal (no desarrollado aquí)
    const OTHER_MODAL_TYPES = ['Confrontacion', 'Importar Legalización'];

    // Simula la adición de un trámite
    const handleAddTramite = (type) => {
        if (!isToday){ 
          alert("No se pueden realizar acciones en fechas pasadas")
          return;
        }
        // Si es Confrontacion o Importar, abrimos el modal genérico (placeholder)
        if (OTHER_MODAL_TYPES.includes(type)) {
            alert(`Modal para ${type} (a desarrollar)`);
            return;
        }

        // Lógica para tipos que añaden un elemento
        const newTramiteNumber = tramites.length + 1;
        const newTramite = {
            id: Date.now(), // ID único
            tipo: type,
            numero: newTramiteNumber,
            ci: '', // Datos placeholder
            nombre: ``,
            fechaSolicitud: selectedDate,
            fechaFirma: '',
            fechaRecojo: '',
        };

        setTramites(prev => [...prev, newTramite]);

        // Abrir modal de confirmación rápida
        setQuickModalData({
            type: type,
            tramiteNumber: newTramiteNumber,
            date: selectedDate,
        });
        setIsQuickModalOpen(true);
    };
    // Handler para abrir el modal de edición
    const handleEditTramite = (tramite) => {
        setTramiteToEdit(tramite);
        setIsEditModalOpen(true);
    };

    // Handler para cerrar el modal de edición
    const closeEditModal = () => {
        setTramiteToEdit(null);
        setIsEditModalOpen(false);
    };

    // Lógica de filtrado de la tabla (solo para la fecha seleccionada)
    const filteredTramites = useMemo(() => {
        return tramites
            .filter(t => t.fechaSolicitud === selectedDate) // Filtro por fecha
            .filter(t => 
                t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.ci.includes(searchTerm)
            );
    }, [tramites, selectedDate, searchTerm]);

    // Lógica de paginación
    const totalTramites = filteredTramites.length;
    const currentTramites = filteredTramites.slice(0, rowsPerPage);
    const rowsPerPageNum = Number(rowsPerPage);
    const startIndex = 0;
    return (
        <div className='p-6 bg-gray-100'>
            <div className="p-8 bg-white rounded-lg shadow-md">
                
                {/* 1. Título de la Página */}
                <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2 flex items-center">
                  <BookText className="mr-3 text-gray-800" size={32} /> LEGALIZACIONES
                  </h1>

                {/* Controles Principales (Búsqueda de Fecha, Botones de Acción, Búsquedas Secundarias) */}
                <div className="flex flex-row justify-between items-start gap-y-4 mb-4 border-b pb-6">
                    
                    {/* PARTE IZQUIERDA: Búsqueda de Fecha y Botones de Acción */}
                    <div className="flex  md:flex-row md:items-start gap-4">
                        {/* 2. Buscador de Fecha */}
                        <div className="flex items-center flex-shrink-0">
                            <label htmlFor="searchDate" className="text-gray-600 font-bold whitespace-nowrap">Buscar fecha :</label>
                            <input
                                type="date"
                                id="searchDate"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                            />
                        </div>

                        {/* 3. Botones de Acción (agrupados y con flex-wrap para acomodar muchos) */}
                        <div className="flex flex-wrap gap-1 md:gap-2">
                            {[
                                { label: '+ Legalización', type: 'Legalizacion' },
                                { label: '+ Certificación', type: 'Certificacion' },
                                { label: '+ Confrontación', type: 'Confrontacion' },
                                { label: '+ Búsqueda', type: 'Busqueda' },
                                { label: '+ Consejo', type: 'Consejo' },
                                { label: '+ Importar Legalización', type: 'Importar Legalización' }
                            ].map(({ label, type, }) => (
                                <button
                                    key={type}
                                    onClick={() => handleAddTramite(type)}
                                    // Los botones especiales (Confrontación, Importar) no se deshabilitan por fecha
                                    disabled={!isToday && ADD_TRAMITE_TYPES.includes(type)} 
                                    className={`font-medium py-2 px-4 rounded transition duration-150 border 
                                        ${!isToday && ADD_TRAMITE_TYPES.includes(type)
                                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300' // Deshabilitado
                                            : 'bg-white text-gray-700 border-blue-500 hover:bg-blue-400 hover:border-blue-700' // Habilitado
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* PARTE DERECHA: 4. Búsqueda por Nro. Valorado y Nro. Trámite */}
                    <div className="flex flex-col items-center gap-2 sm:gap-1 ml-4">
                        {/* Nro. Valorado */}
                        <div className="flex items-center">
                            <input type="text" placeholder="Nro Valorado" className="border border-gray-300 rounded-l py-2 px-3 w-30 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            <button className="bg-blue-600 text-white p-2 rounded-r hover:bg-blue-700">🔍</button>
                        </div>
                        {/* Nro. Trámite */}
                        <div className="flex items-center">
                            <input type="text" placeholder="Nro Tramite" className="border border-gray-300 rounded-l py-2 px-3 w-30 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            <button className="bg-blue-600 text-white p-2 rounded-r hover:bg-blue-700">🔍</button>
                        </div>
                        {/* Ejemplo de formato */}
                        <span className=" text-sm font-bold text-red-600 whitespace-nowrap">Ejm: 123-2022</span>
                    </div>

                </div> {/* Fin de Controles Principales */}


                {/* 5. Título de la Tabla y Fecha Seleccionada */}
                <div className="mb-4">
                    <div className="text-gray-800 text-center py-3  rounded-t-lg  mb-2">
                        <h2 className="text-2xl font-semibold">Trámites de Legalización</h2>
                    </div>
                    {/* Fecha seleccionada debajo del título y a la izquierda */}
                    <span className="text-sm font-medium text-blue-600">
                        Fecha: {new Date(selectedDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                </div>

                {/* 6. Controles de la Tabla (Mostrar entradas y Filtrar) */}
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
                            placeholder="Filtrar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded py-2 px-4 pl-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>
                </div>

                {/* 7. Tabla de Trámites */}
                <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['N°', 'Tipo', 'Número', 'CI', 'Nombre', 'Fecha Solicitud', 'Fecha Firma', 'Fecha Recojo', 'Opciones', 'Entrega'].map(header => (
                                    <th key={header} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentTramites.length > 0 ? (
                                currentTramites.map((tramite, index) => (
                                    <tr key={tramite.id} className="hover:bg-gray-100">
                                        
                                        <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">{(index + 1)}</td>
                                        
                                        {/* Columna Tipo con TAG de color */}
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <span 
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${TRAMITE_COLORS[tramite.tipo]?.base || 'bg-gray-500'} text-white`}
                                            >
                                                {tramite.tipo}
                                            </span>
                                        </td>
                                        
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{tramite.numero}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{tramite.ci}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{tramite.nombre}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{tramite.fechaSolicitud}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{tramite.fechaFirma}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{tramite.fechaRecojo}</td>
                                        
                                        {/* Columna Opciones */}
                                        <td className="px-3 py-2 whitespace-nowrap text-xs font-medium space-x-2">
                                            <button 
                                                onClick={() => handleEditTramite(tramite)}
                                                className="text-blue-600 hover:text-blue-900" 
                                                title="Insertar Datos al Trámite"
                                            >
                                                📝
                                            </button>
                                            <button className="text-purple-600 hover:text-purple-900" title="Cambiar Tipo">🔁</button>
                                            <button className="text-red-600 hover:text-red-800" title="Eliminar Trámite">🗑️</button>
                                        </td>
                                        
                                        {/* Columna Entrega */}
                                        <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                                            <button 
                                                className="text-green-600 hover:text-green-800 transition duration-150"
                                                title="Entregar Trámites" 
                                            >
                                                <CircleArrowRight size={20} /> 
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center py-4 text-gray-500">No se encontraron trámites para esta fecha.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación y Resumen (Placeholder) */}
                <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-600">
                        Mostrando {Math.min(startIndex + 1, totalTramites)} a {Math.min(startIndex + rowsPerPageNum, totalTramites)} de {totalTramites} entradas.
                    </div>
                    {/* Placeholder para los botones de paginación */}
                    <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50" disabled>Previous</button>
                        <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</span>
                        <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
                
                {/* 🚨 Modal de Edición de Legalización */}
                <EditLegalizacionModal 
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    tramiteData={tramiteToEdit} // Pasar los datos del trámite
                />
                {/* Modal de Confirmación Rápida */}
                <ConfirmModal 
                    isOpen={isQuickModalOpen}
                    onClose={() => setIsQuickModalOpen(false)}
                    {...quickModalData}
                />
                
            </div>
        </div>
    );
}
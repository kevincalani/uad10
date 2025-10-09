import React, { useState, useEffect } from 'react';
import { BUSCAR_EN_OPTIONS } from '../Constants/tramiteDatos';


export default function AddEditTramiteModal({ 
  isOpen, 
  onClose, 
  title, // Título del modal (e.g., "Añadir Trámite", "Editar Trámite")
  type,  // Tipo de trámite: 'Legalizacion', 'Certificacion', 'Confrontacion', etc.
  initialData = {}, // Datos iniciales si estamos editando
  onSubmit 
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    nCuenta: '',
    costo: '',
    duracion: '',
    buscarEn: '', // Campo para el select
    descripcion: '',
    tituloGlosa: '',
    tituloGlosaInterno: '',
    soloSello: false,
    ...initialData, // Sobrescribe con datos iniciales si existen (para edición)
  });

  // Resetear el formulario cuando el modal se abre o el tipo de trámite cambia
  useEffect(() => {
    if (isOpen) {
      setFormData({
        nombre: '',
        nCuenta: '',
        costo: '',
        duracion: '',
        buscarEn: '',
        descripcion: '',
        tituloGlosa: '',
        tituloGlosaInterno: '',
        soloSello: false,
        ...initialData, // Asegura que los datos iniciales se carguen correctamente
      });
    }
  }, [isOpen, initialData, type]); // Dependencias para el efecto

  if (!isOpen) return null; // No renderiza nada si no está abierto

  // Determinar la visibilidad de las secciones
  const showDatosGlosa = ['Legalizacion', 'Certificacion', 'No atentado', 'Consejero'].includes(type);
  const showBuscarEn = ['Legalizacion', 'Certificacion', 'No atentado', 'Consejero'].includes(type);
  
  const handleBackdropClick = (e) => {
    // Si el clic ocurrió directamente sobre el DIV principal (el backdrop),
    // y no sobre un hijo, cerramos el modal.
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes limpiar o adaptar formData antes de enviarlo
    const dataToSubmit = { ...formData };
    
    // Si no se muestran los datos de glosa, los eliminamos del objeto a enviar
    if (!showDatosGlosa) {
        delete dataToSubmit.tituloGlosa;
        delete dataToSubmit.tituloGlosaInterno;
        delete dataToSubmit.soloSello;
    }
    // Si no se muestra buscarEn, lo eliminamos
    if (!showBuscarEn) {
        delete dataToSubmit.buscarEn;
    }
    
    onSubmit(dataToSubmit); // Pasa los datos al componente padre
    onClose(); // Cierra el modal después de enviar
  };

  return (
    <div className="fixed inset-0 bg-gray-500/60 bg-opacity-50 flex justify-center items-center z-50 p-4"
    onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        
        {/* Header del Modal */}
        <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center">
            {/* Icono de lápiz o documento */}
            <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            {/* Icono de cerrar */}
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-1 bg-gray-50 flex justify-center items-center">
        </div>
        
        {/* Contenido del Formulario */}
        <form onSubmit={handleSubmit} className="pt-2 pl-4 pr-4 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          
          {/* Columna Izquierda: Datos del trámite */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-blue-700">* Datos del trámite</h3>
            
            <div className="mb-2">
              <label htmlFor="nombre" className="block text-gray-700 text-sm font-medium mb-1">Nombre :</label>
              <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} 
                     className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1" required />
            </div>
            
            <div className="mb-2">
              <label htmlFor="nCuenta" className="block text-gray-700 text-sm font-medium mb-1">N° Cuenta :</label>
              <input type="text" id="nCuenta" name="nCuenta" value={formData.nCuenta} onChange={handleChange} 
                     className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1" required />
            </div>
            
            <div className="mb-2">
              <label htmlFor="costo" className="block text-gray-700 text-sm font-medium mb-1">Costo (Bs.):</label>
              <input type="number" id="costo" name="costo" value={formData.costo} onChange={handleChange} 
                     className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1" required />
            </div>
            
            <div className="mb-2">
              <label htmlFor="duracion" className="block text-gray-700 text-sm font-medium mb-1">Duración (Hrs):</label>
              <input type="text" id="duracion" name="duracion" value={formData.duracion} onChange={handleChange} 
                     className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1" required />
            </div>
            
            {/* Campo "Buscar en" - Oculto para Confrontación y Búsqueda */}
            {showBuscarEn && (
              <div className="mb-2">
                <label htmlFor="buscarEn" className="block text-gray-700 text-sm font-medium mb-1">Buscar en :</label>
                <select id="buscarEn" name="buscarEn" value={formData.buscarEn} onChange={handleChange}
                        className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1">
                  <option value=""></option>
                  {BUSCAR_EN_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                          {option.label}
                      </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="mb-2">
              <label htmlFor="descripcion" className="block text-gray-700 text-sm font-medium mb-1">Descripción :</label>
              <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} 
                        rows="2" className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1 resize-y"></textarea>
            </div>
          </div>

          {/* Columna Derecha: Datos de glosa - Oculta para Confrontación y Búsqueda */}
          {showDatosGlosa && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-700">* Datos de glosa</h3>
              
              <div className="mb-2">
                <label htmlFor="tituloGlosa" className="block text-gray-700 text-sm font-medium mb-1">Título de glosa:</label>
                <textarea id="tituloGlosa" name="tituloGlosa" value={formData.tituloGlosa} onChange={handleChange} 
                          rows="3" className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1 resize-y"></textarea>
              </div>
              
              <div className="mb-2">
                <label htmlFor="tituloGlosaInterno" className="block text-gray-700 text-sm font-medium mb-1">Título de glosa (Interno):</label>
                <textarea id="tituloGlosaInterno" name="tituloGlosaInterno" value={formData.tituloGlosaInterno} onChange={handleChange} 
                          rows="3" className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1 resize-y"></textarea>
              </div>
              
              <div className="flex items-center mb-2">
                <input type="checkbox" id="soloSello" name="soloSello" checked={formData.soloSello} onChange={handleChange} 
                       className="form-checkbox h-4 w-4 text-blue-600 rounded" />
                <label htmlFor="soloSello" className="ml-2 text-gray-700 text-sm font-medium">Solo sello:</label>
              </div>
            </div>
          )}
        </form>

        {/* Footer del Modal (Botones Cancelar/Aceptar) */}
        <div className="bg-gray-100 p-2 rounded-b-lg flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-6 rounded-md transition duration-200"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            onClick={handleSubmit} // Llama a handleSubmit del formulario
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
          >
            Aceptar
          </button>
        </div>

      </div>
    </div>
  );
}
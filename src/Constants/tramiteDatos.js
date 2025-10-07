/**
 * Mapeo de tipos de trámites a sus configuraciones de color y estilo en Tailwind CSS.
 */
export const TRAMITE_COLORS = {
  // Tipo: { color base, color hover (para botones), color de texto (si se necesita) }
  Legalizacion: { 
    base: 'bg-blue-500', 
    hover: 'hover:bg-blue-600', 
    text: 'text-blue-500' 
  }, // btn-info
  
  Certificacion: { 
    base: 'bg-yellow-500', 
    hover: 'hover:bg-yellow-600', 
    text: 'text-yellow-500' 
  }, // btn-warning
  
  Confrontacion: { 
    base: 'bg-red-500', 
    hover: 'hover:bg-red-600', 
    text: 'text-red-500' 
  }, // btn-danger
  
  Busqueda: { 
    base: 'bg-green-500', 
    hover: 'hover:bg-green-600', 
    text: 'text-green-500' 
  }, // btn-success
  
  'No atentado': { 
    base: 'bg-indigo-500', 
    hover: 'hover:bg-indigo-600', 
    text: 'text-indigo-500' 
  }, // btn-primary
  
  Consejero: { 
    base: 'bg-gray-500', 
    hover: 'hover:bg-gray-600', 
    text: 'text-gray-500' 
  }, // btn-secondary
};

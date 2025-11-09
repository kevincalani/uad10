import React, { useState } from 'react';
import { 
  CircleArrowLeft, User, UserPen, Users, BookText, ListTodo, 
  Network, FolderUp, ChartNoAxesCombined, IdCard, UserCircle2
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import DatosPersonales from '../../components/administrador/DatosPersonales';
import EditarDatosPersonales from '../../components/administrador/EditarDatosPersonales';
import Responsable from '../../components/administrador/Responsable';

// --- Estructura de la página de Detalle de Usuario ---
export default function MostrarUsuario() {

  const location = useLocation();
  const navigate = useNavigate();
  
  const [usuario, setUsuario] = useState(location.state?.usuario);

  // Función para actualizar el estado del usuario central (DatosPersonales)
   // Se usa cuando la edición es exitosa.
   const handleUpdateUsuario = (updatedData) => {
    // La API puede devolver 'nombre' o 'name'. Nos aseguramos de unificar la propiedad 'name'.
     const name = updatedData.nombre || updatedData.name;
  
     setUsuario(prev => ({
       ...prev,
       ...updatedData,
       name: name, // Asegura que se use 'name'
       // Si se actualiza la foto, Laravel a veces solo devuelve el nombre del archivo.
       // Si la respuesta incluye un nuevo 'foto', lo usamos.
       foto: updatedData.foto || prev.foto || null, 
     }));

    // Opcionalmente, vuelve a la pestaña 'Inicio' después de editar
    setSelectedTab('Inicio'); 
  };
  
  // Estado para manejar qué botón está seleccionado
  const [selectedTab, setSelectedTab] = useState('Inicio');

  // Definición de los botones de navegación y sus iconos de Lucide
  const tabs = [
    { title: 'Atrás', icon: CircleArrowLeft, action: () => navigate('/administracion/usuarios') }, // Vuelve a la lista de usuarios
    { title: 'Inicio', icon: User, component: <PanelInicio usuario={usuario} /> },
    { title: 'Editar', icon: UserPen, component: <EditarDatosPersonales usuario={usuario} onUpdateUsuario={handleUpdateUsuario} /> },
    { title: 'Responsable', icon: Users, component: <Responsable /> },
    { title: 'Actividad', icon: BookText, component: <PanelActividad /> },
    { title: 'Tareas', icon: ListTodo, component: <PanelTareas /> },
    { title: 'Bitacora', icon: Network, component: <PanelBitacora /> },
    { title: 'Importaciones', icon: FolderUp, component: <PanelImportaciones /> },
    { title: 'Rendimiento', icon: ChartNoAxesCombined, component: <PanelRendimiento /> },
    { title: 'Permisos', icon: IdCard, component: <PanelPermisos /> },
  ];

  const currentTab = tabs.find(t => t.title === selectedTab);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      
      {/* 1. BARRA DE BOTONES DE NAVEGACIÓN SUPERIOR */}
      <div className="flex flex-wrap gap-1 bg-white p-2 border border-gray-200 shadow-sm rounded-t-lg">
        {tabs.map((tab) => {
          const isSelected = tab.title === selectedTab;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.title}
              onClick={() => {
                if (tab.action) {
                  tab.action(); // Ejecuta la acción (ej. navegar)
                } else {
                  setSelectedTab(tab.title); // Cambia el panel
                }
              }}
              // Clase para el efecto de "archivo seleccionado" o carpeta
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors duration-200 
                ${isSelected
                  ? 'bg-blue-600 text-white rounded-t-md shadow-inner-top' // Botón seleccionado
                  : 'text-gray-600 hover:bg-gray-200 rounded-md' // Botón no seleccionado
                }
                ${tab.title === 'Atrás' ? 'bg-red-500 text-white hover:bg-red-600 rounded-md' : ''}
              `}
              style={isSelected ? { 
                // Estilo para simular el "file tab" - opcionalmente puedes usar clases
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // Para mejor control del borde
                borderBottom: 'none',
              } : {}}
            >
              <Icon size={18} />
              {tab.title}
            </button>
          );
        })}
      </div>

      {/* CONTENIDO PRINCIPAL (2. Datos Personales y 3. Panel de Edición) */}
      <div className="flex flex-col lg:flex-row gap-4 pt-4">
        
        {/* 2. DATOS PERSONALES (Columna Izquierda) */}
        <DatosPersonales usuario={usuario} />

        {/* 3. PANEL DE EDICIÓN/CONTENIDO (Columna Derecha) */}
        <div className="w-full lg:w-7/10 p-4 bg-white border border-gray-300 rounded-lg shadow-md">
          <div className="bg-blue-600 p-2 rounded-t-md -mt-4 -mx-4 mb-4 shadow">
            <h2 className="text-base font-semibold text-white my-1 ml-1">Panel de Edición</h2>
          </div>
          
          {/* Renderiza el contenido del tab seleccionado */}
          {currentTab && currentTab.component}
          
          {/* Mensaje por defecto si no hay un componente definido */}
          {!currentTab && <p className="text-center py-10 text-gray-500">Selecciona una opción para ver su contenido.</p>}
        </div>
      </div>
    </div>
  );
}

// --- Componentes de ejemplo para el Panel de Edición ---

const PanelInicio = ({ usuario }) => (
    <div className='p-4 border border-gray-200 rounded-md'>
        <h3 className='text-lg font-semibold text-blue-700 mb-3'>Vista de Inicio para {usuario.name.split(' ')[0]}</h3>
        <p className='text-gray-600'>Aquí se mostraría un resumen del estado del usuario, notificaciones o estadísticas rápidas.</p>
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
             <button className="text-blue-600 font-medium flex items-center gap-1">
                Establecer rango
             </button>
        </div>
    </div>
);

const PanelEdicion = () => (
    <div className='p-4'>
        <h3 className='text-lg font-semibold text-blue-700 mb-3'>Formulario de Edición de Usuario</h3>
        <p className='text-gray-600'>Aquí iría el formulario para editar los campos personales y de contacto.</p>
    </div>
);

const PanelResponsable = () => <p className='p-4 text-gray-600'>Gestión de responsables asignados.</p>;
const PanelActividad = () => <p className='p-4 text-gray-600'>Lista de Actividades del usuario.</p>;
const PanelTareas = () => <p className='p-4 text-gray-600'>Lista de Tareas pendientes/concluidas.</p>;
const PanelBitacora = () => <p className='p-4 text-gray-600'>Registro de la Bitácora del usuario.</p>;
const PanelImportaciones = () => <p className='p-4 text-gray-600'>Interfaz para importar datos al perfil.</p>;
const PanelRendimiento = () => <p className='p-4 text-gray-600'>Gráficos y estadísticas de rendimiento.</p>;
const PanelPermisos = () => <p className='p-4 text-gray-600'>Gestión detallada de los permisos y roles.</p>;
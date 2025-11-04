import React, { useState } from 'react';
import { 
  CircleArrowLeft, User, UserPen, Users, BookText, ListTodo, 
  Network, FolderUp, ChartNoAxesCombined, IdCard, UserCircle2
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// --- Componente para la foto ---
const FotoUsuario = ({ foto }) => {
  const defaultIconSize = 100; // Tamaño del icono por defecto

  if (foto) {
    const src = `http://localhost:8000/img/foto/${foto}`;
    return (
      <img
        src={src}
        alt="Foto de perfil"
        className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg mb-4"
      />
    );
  }

  // Icono por defecto: user-circle2
  return (
    <div className="w-32 h-32 flex items-center justify-center mx-auto mb-4 bg-gray-100 rounded-full text-gray-400 border border-gray-300">
      <UserCircle2 size={defaultIconSize} />
    </div>
  );
};

const formatSexo = (code) => {
  if (!code) return '-';
  const upperCode = code.toUpperCase();
  if (upperCode === 'F' || upperCode === 'FEMENINO') return 'FEMENINO';
  if (upperCode === 'M' || upperCode === 'MASCULINO') return 'MASCULINO';
  return code;
};
//Recorta el formato de fecha ISO 8601 a 'YYYY-MM-DD HH:MM:SS'
const formatDateTime = (isoDateString) => {
    if (!isoDateString || typeof isoDateString !== 'string') return '-';
    // Busca la 'T' y la corta. Si no hay 'T', simplemente la devuelve.
    const parts = isoDateString.split('T');
    if (parts.length < 2) return isoDateString; // Si no tiene 'T', no se formatea.

    const datePart = parts[0]; // YYYY-MM-DD
    const timePart = parts[1].split('.')[0]; // HH:MM:SS (corta los milisegundos y la 'Z')

    return `${datePart} ${timePart}`;
};

// --- Estructura de la página de Detalle de Usuario ---
export default function MostrarUsuario() {

  const location = useLocation();
  const navigate = useNavigate();
  
  const [usuario, setUsuario] = useState(location.state?.usuario);
  // Estado para manejar qué botón está seleccionado
  const [selectedTab, setSelectedTab] = useState('Inicio');

  // Definición de los botones de navegación y sus iconos de Lucide
  const tabs = [
    { title: 'Atrás', icon: CircleArrowLeft, action: () => navigate('/administracion/usuarios') }, // Vuelve a la lista de usuarios
    { title: 'Inicio', icon: User, component: <PanelInicio usuario={usuario} /> },
    { title: 'Editar', icon: UserPen, component: <PanelEdicion /> },
    { title: 'Responsable', icon: Users, component: <PanelResponsable /> },
    { title: 'Actividad', icon: BookText, component: <PanelActividad /> },
    { title: 'Tareas', icon: ListTodo, component: <PanelTareas /> },
    { title: 'Bitacora', icon: Network, component: <PanelBitacora /> },
    { title: 'Importaciones', icon: FolderUp, component: <PanelImportaciones /> },
    { title: 'Rendimiento', icon: ChartNoAxesCombined, component: <PanelRendimiento /> },
    { title: 'Permisos', icon: IdCard, component: <PanelPermisos /> },
  ];

  const currentTab = tabs.find(t => t.title === selectedTab);

  // Lista de campos para el componente de Datos Personales
  const personalDataFields = [
    { label: 'Nombre', value: usuario.name, style: 'font-bold text-blue-800 uppercase' },
    { label: 'CI', value: usuario.ci },
    { label: 'Contacto', value: usuario.contacto },
    { label: 'Sexo', value: formatSexo(usuario.sexo) }, 
    { label: 'Fecha Ingreso', value: formatDateTime(usuario.created_at) },
    { label: 'Rol', value: usuario.rol, style: 'uppercase' },
    { label: 'Cargo', value: usuario.cargo },
    { label: 'Dirección', value: usuario.direccion }, 
  ];

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
        <div className="w-full lg:w-1/3 p-4 bg-white border border-gray-300 rounded-lg shadow-md h-fit">
          <div className="flex justify-between items-center bg-blue-600 p-2 rounded-t-md -mt-4 -mx-4 mb-4 shadow">
            <h2 className="text-base font-semibold text-white my-1 ml-1">Datos Personales</h2>
          </div>
          
          <FotoUsuario foto={usuario.foto} />

          {/* Grid de Datos Personales con Separadores */}
          <div className="grid grid-cols-2 text-sm border-b border-gray-300 mb-4" >
            {personalDataFields.map((field, index) => (
              <React.Fragment key={field.label}>
                {/* Etiqueta del campo */}
                <div 
                  className={`font-semibold text-gray-700 py-1 ${field.fullWidth ? 'col-span-2' : ''} ${index < personalDataFields.length - 1 && 'border-b border-gray-200'}`}
                >
                  {field.label}:
                </div>
                
                {/* Valor del campo */}
                <div 
                  className={`text-gray-900 py-1 ${field.style || ''} ${field.fullWidth ? 'hidden' : ''} ${index < personalDataFields.length - 1 && 'border-b border-gray-300'}`}
                >
                  {field.value || '-'}
                </div>
                
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 3. PANEL DE EDICIÓN/CONTENIDO (Columna Derecha) */}
        <div className="w-full lg:w-2/3 p-4 bg-white border border-gray-300 rounded-lg shadow-md">
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
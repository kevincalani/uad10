export const menuItems = [
  
  {
    id: 'diplomas',
    label: 'DIPLOMAS Y TÍTULOS',
    hasSubmenu: true,
    submenuItems: [
      { id: 'listar-tomos', label: 'Listar Tomos', route: '/diplomas/tomos' },
      { id: 'buscar-titulo', label: 'Buscar título', route: '/diplomas/buscar' },
      { id: 'importar-titulos', label: 'Importar títulos', route: '/diplomas/importar' },
      { id: 'reportes-diplomas', label: 'Reportes', route: '/diplomas/reportes' },
      { id: 'duplicados', label: 'Duplicados', route: '/diplomas/duplicados' }
    ]
  },
  {
    id: 'resoluciones',
    label: 'RESOLUCIONES',
    hasSubmenu: true,
    submenuItems: [
      { id: 'listar-tomos-res', label: 'Listar tomos', route: '/resoluciones/tomos' },
      { id: 'listar-resoluciones', label: 'Listar resoluciones', route: '/resoluciones/listar' },
      { id: 'autoridad', label: 'Autoridad', route: '/resoluciones/autoridad' },
      { id: 'codigo-archivado', label: 'Código de archivado', route: '/resoluciones/codigo' },
      { id: 'busquedas-res', label: 'Búsquedas', route: '/resoluciones/busquedas' },
      { id: 'importar-res', label: 'Importar Resoluciones', route: '/resoluciones/importar' },
      { id: 'temas-interes', label: 'Temas de interés', route: '/resoluciones/temas' },
      { id: 'reportes-res', label: 'Reportes', route: '/resoluciones/reportes' }
    ]
  },
  {
    id: 'resoluciones-rfc-rcc',
    label: 'RESOLUCIONES RFC-RCC',
    hasSubmenu: false,
    route: '/resoluciones-rfc-rcc'
  },
  {
    id: 'servicios',
    label: 'SERVICIOS',
    hasSubmenu: true,
    submenuItems: [
      { id: 'configurar-tramites', label: 'Configurar trámites', route: '/servicios/configurar-tramites' },
      { id: 'tramites', label: 'Trámites', route: '/servicios/tramites' },
      { id: 'entrega-tramites', label: 'Entrega de trámites', route: '/servicios/entrega' },
      { id: 'reportes-servicios', label: 'Reportes', route: '/servicios/reportes' }
    ]
  },
  {
    id: 'apostilla',
    label: 'APOSTILLA',
    hasSubmenu: true,
    submenuItems: [
      { id: 'tramites-apostilla', label: 'Trámites apostilla', route: '/apostilla/tramites' },
      { id: 'configurar-apostilla', label: 'Configurar apostilla', route: '/apostilla/configurar' },
      { id: 'reportes-apostilla', label: 'Reportes', route: '/apostilla/reportes' }
    ]
  },
  {
    id: 'no-atentado',
    label: 'NO ATENTADO',
    hasSubmenu: true,
    submenuItems: [
      { id: 'convocatoria', label: 'Convocatoria', route: '/no-atentado/convocatoria' },
      { id: 'lista-sancionados', label: 'Lista de sancionados', route: '/no-atentado/sancionados' },
      { id: 'reportes-atentado', label: 'Reportes', route: '/no-atentado/reportes' }
    ]
  },
  {
    id: 'unidades',
    label: 'UNIDADES',
    hasSubmenu: true,
    submenuItems: [
      { id: 'facultad', label: 'Facultad', route: '/unidades/facultad' },
      { id: 'unidad', label: 'Unidad', route: '/unidades/unidad' }
    ]
  },
  {
    id: 'firma',
    label: 'FIRMA',
    hasSubmenu: false,
    route: '/firma'
  },
  {
    id: 'claustros',
    label: 'CLAUSTROS',
    hasSubmenu: true,
    submenuItems: [
      { id: 'consejos', label: 'Consejos', route: '/claustros/consejos' }
    ]
  },
  {
    id: 'funcionarios',
    label: 'FUNCIONARIOS',
    hasSubmenu: true,
    submenuItems: [
      { id: 'docentes', label: 'Docentes', route: '/funcionarios/docentes' },
      { id: 'administrativos', label: 'Administrativos', route: '/funcionarios/administrativos' },
      { id: 'reporte-funcionarios', label: 'Reporte', route: '/funcionarios/reporte' }
    ]
  }
];

export const adminMenuItems = [
  {
    id: 'usuarios',
    label: 'USUARIOS',
    hasSubmenu: true,
    submenuItems: [
      { id: 'lista-usuarios', label: 'Lista de Usuarios', route: '/admin/usuarios/lista' },
      { id: 'reportes-usuarios', label: 'Reportes', route: '/admin/usuarios/reportes' }
    ]
  },
  {
    id: 'corregir-datos',
    label: 'CORREGIR DATOS PERSONALES',
    hasSubmenu: false,
    route: '/admin/corregir-datos'
  },
  {
    id: 'programacion',
    label: 'PROGRAMACION',
    hasSubmenu: true,
    submenuItems: [
      { id: 'actividades', label: 'Actividades', route: '/admin/programacion/actividades' },
      { id: 'dependientes', label: 'Dependientes', route: '/admin/programacion/dependientes' }
    ]
  },
  {
    id: 'reporte',
    label: 'REPORTE',
    hasSubmenu: true,
    submenuItems: [
      { id: 'reporte-tareas', label: 'Reporte de Tareas', route: '/admin/reporte/tareas' },
      { id: 'registro-periodico', label: 'Registro Periodico', route: '/admin/reporte/periodico' }
    ]
  }
];

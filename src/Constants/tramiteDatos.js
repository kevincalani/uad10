/**
 * Mapeo de tipos de trámites a sus configuraciones de color y estilo en Tailwind CSS.
 */
export const TIPO_TRAMITE ={
  L: "Legalizacion",
  C: "Certificacion",
  F: "Confrontacion",
  B: "Busqueda",
  A: "No atentado",
  E: "Consejo"
}
// 🔁 Conversión inversa
export const TIPO_TRAMITE_INVERTIDO = Object.fromEntries(
  Object.entries(TIPO_TRAMITE).map(([k, v]) => [v, k])
);

export const TRAMITE_COLORS = {
  // Tipo: { color base, color hover (para botones), color de texto (si se necesita) }
  Legalizacion: { 
    base: 'bg-blue-500',
    border: 'border-blue-500', 
    hover: 'hover:bg-blue-600', 
    text: 'text-blue-500' 
  }, // btn-info
  
  Certificacion: { 
    base: 'bg-yellow-500', 
    border: 'border-yellow-500', 
    hover: 'hover:bg-yellow-600', 
    text: 'text-yellow-500' 
  }, // btn-warning
  
  Confrontacion: { 
    base: 'bg-red-500',
    border: 'border-red-500',  
    hover: 'hover:bg-red-600', 
    text: 'text-red-500' 
  }, // btn-danger
  
  Busqueda: { 
    base: 'bg-green-500', 
    border: 'border-green-500', 
    hover: 'hover:bg-green-600', 
    text: 'text-green-500' 
  }, // btn-success
  
  'No atentado': { 
    base: 'bg-indigo-500', 
    border: 'border-indigo-500',
    hover: 'hover:bg-indigo-600', 
    text: 'text-indigo-500' 
  }, // btn-primary
  
  Consejo: { 
    base: 'bg-gray-500', 
    border: 'border-gray-500', 
    hover: 'hover:bg-gray-600', 
    text: 'text-gray-500' 
  }, // btn-secondary
};
/**
 * Opciones para el campo "Buscar en" en los modales de trámites.
 */
export const BUSCAR_EN_OPTIONS = [
    { value: 'db', label: 'DB' },
    { value: 'ca', label: 'CA' },
    { value: 'da', label: 'DA' },
    { value: 'tp', label: 'TP' },
    { value: 'di', label: 'DI' },
    { value: 'tpos', label: 'TPOS' },
    { value: 're', label: 'RE' },
    { value: 'su', label: 'SU' },
    { value: 'res', label: 'RESOLUCION' },
    { value: 'db-ant', label: 'DB-ANTECEDENTE' },
    { value: 'ca-ant', label: 'CA-ANTECEDENTE' },
    { value: 'da-ant', label: 'DA-ANTECEDENTE' },
    { value: 'tp-ant', label: 'TP-ANTECEDENTE' },
    { value: 'di-ant', label: 'DI-ANTECEDENTE' },
    { value: 'tpos-ant', label: 'TPOS-ANTECEDENTE' },
    { value: 're-ant', label: 'RE-ANTECEDENTE' },
    { value: 'su-ant', label: 'SU-ANTECEDENTE' },
    
  ];
  /**
 * Opciones para el campo "Buscar en" en los modales de trámites.
 */
export const BUSCAR_EN_DOCUMENTOS = [
    { value: 'db', label: 'DB' },
    { value: 'ca', label: 'CA' },
    { value: 'da', label: 'DA' },
    { value: 'tp', label: 'TP' },
    { value: 'di', label: 'DI' },
    { value: 'tpos', label: 'TPOS' },
    { value: 're', label: 'RE' },
    { value: 'su', label: 'SU' },
  ];
export const TIPOS_LEGALIZACION = [
  { value: 'LEG. FOTOC. RR QUE CONCEDE DIPL. ACADEMICO', label: 'LEG. FOTOC. RR QUE CONCEDE DIPL. ACADEMICO' },
  { value: 'LEG. FOTOC. DIPL. ACADEMICO EXTRANJERO', label: 'LEG. FOTOC. DIPL. ACADEMICO EXTRANJERO' },
  { value: 'LEG. FOTOC. RR. REVALIDA TIT. EXTRANJERO', label: 'LEG. FOTOC. RR. REVALIDA TIT. EXTRANJERO' },
  { value: 'LEG. FOTOC. TIT/DIPL: DOC,MASTER,DIPL,ESPEC', label: 'LEG. FOTOC. TIT/DIPL: DOC,MASTER,DIPL,ESPEC' },
  { value: 'LEG. FOTOC. DIPL. BACHILLER', label: 'LEG. FOTOC. DIPL. BACHILLER' },
  { value: 'LEG. FOTOC. DIPL. BACHILLER EXTRANJERO', label: 'LEG. FOTOC. DIPL. BACHILLER EXTRANJERO' },
  { value: 'LEG. FOTOC. LIBRETA ESCOLAR P/OTRAS UNIV.', label: 'LEG. FOTOC. LIBRETA ESCOLAR P/OTRAS UNIV.' },
  { value: 'LEG. FOTOC. CONCENTRADO DE NOTAS EN GENERAL', label: 'LEG. FOTOC. CONCENTRADO DE NOTAS EN GENERAL' },
  { value: 'TRANSCR. NOTAS DE SECUNDARIA P/OTRAS UNIV.', label: 'TRANSCR. NOTAS DE SECUNDARIA P/OTRAS UNIV.' },
  { value: 'LEG. FOTOC. RR QUE CONCEDE TIT. PROV. NAC', label: 'LEG. FOTOC. RR QUE CONCEDE TIT. PROV. NAC' },
  { value: 'LEG. FOTOC. RR-RCU-RS-RVR', label: 'LEG. FOTOC. RR-RCU-RS-RVR' },
  { value: 'LEG. FOTOC. RR POR EXCELENCIA', label: 'LEG. FOTOC. RR POR EXCELENCIA' },
  { value: 'LEG. FOTOC. DIPL. ACADEMICO', label: 'LEG. FOTOC. DIPL. ACADEMICO' },
  { value: 'LEG. FOTOC. CERT. CONCLUSION PLAN DE EST.', label: 'LEG. FOTOC. CERT. CONCLUSION PLAN DE EST.' },
  { value: 'LEG. FOTOC. INTERNADO ROTATORIO', label: 'LEG. FOTOC. INTERNADO ROTATORIO' },
  { value: 'LEGALIZACION ACTA MODALIDADES DE TITULACION', label: 'LEGALIZACION ACTA MODALIDADES DE TITULACION' },
  { value: 'LEGALIZACION DE REVALIDA DE POSGRADO', label: 'LEGALIZACION DE REVALIDA DE POSGRADO' },
  { value: 'LEG. FOTOC. TIT. PROV. NAL. ALUM. NAL', label: 'LEG. FOTOC. TIT. PROV. NAL. ALUM. NAL' }
];
export const TIPO_APODERADO = [
    { value: 'declaracion_jurada', label: 'Declaración Jurada' },
    { value: 'poder_notariado', label: 'Poder Notariado' },
];
export const TIPO_DOCUMENTO ={
    db: "Diploma Bachiller",
    da: "Diploma Academico",
    tp: "Titulo Profesional",
    ca: "Certificado Academico",
    re: "Revalida",
    su: "Supletorio"
}
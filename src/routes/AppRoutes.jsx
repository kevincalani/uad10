import { Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import { AuthProvider } from '../store/authStore';

// 1. Layouts
import { Layout } from "../layouts/Layout";

// 2. Public Pages
import LoginPage from '../pages/Login'; 

// 3. Protected Pages 
import Inicio from '../pages/Inicio';

// DIPLOMAS Y TÍTULOS
import ListarTomos from '../pages/diplomas/ListarTomos';
import BuscarTitulo from '../pages/diplomas/BuscarTitulo';
import ImportarTitulos from '../pages/diplomas/ImportarTitulos';
import ReportesDiplomas from '../pages/diplomas/ReportesDiplomas';
import Duplicados from '../pages/diplomas/Duplicados';

// RESOLUCIONES
import ListarTomosResoluciones from '../pages/resoluciones/ListarTomosResoluciones';
import ListarResoluciones from '../pages/resoluciones/ListarResoluciones';
import Autoridad from '../pages/resoluciones/Autoridad';
import CodigoArchivado from '../pages/resoluciones/CodigoArchivado';
import BusquedasResoluciones from '../pages/resoluciones/BusquedasResoluciones';
import ImportarResoluciones from '../pages/resoluciones/ImportarResoluciones';
import TemasInteres from '../pages/resoluciones/TemasInteres';
import ReportesResoluciones from '../pages/resoluciones/ReportesResoluciones';

//Resoluciones RFC-RCC
import ResolucionesRFCRCC from '../pages/ResolucionesRFCRCC'; 

// SERVICIOS
import ConfigurarTramites from '../pages/servicios/ConfigurarTramites';
import Tramites from '../pages/servicios/Tramites';
import EntregaTramites from '../pages/servicios/EntregaTramites';
import ReportesServicios from '../pages/servicios/ReportesServicios';

// APOSTILLA
import TramitesApostilla from '../pages/apostilla/TramitesApostilla';
import ConfigurarApostilla from '../pages/apostilla/ConfigurarApostilla';
import ReportesApostilla from '../pages/apostilla/ReportesApostilla';

// NO ATENTADO
import Convocatoria from '../pages/noAtentado/Convocatoria';
import ListaSancionados from '../pages/noAtentado/ListaSancionados';
import ReportesNoAtentado from '../pages/noAtentado/ReportesNoAtentado';

// UNIDADES
import Facultad from '../pages/unidades/Facultad';
import Unidad from '../pages/unidades/Unidad';

// Otros
import Firma from '../pages/Firma'; 
import Consejos from '../pages/claustros/Consejos';

//FUNCIONARIOS
import Docentes from '../pages/funcionarios/Docentes'; 
import Administrativos from '../pages/funcionarios/Administrativos'; 
import ReporteFuncionarios from '../pages/funcionarios/Reporte'; 

// ADMINISTRACIÓN
import CorregirDatos from '../pages/admin/CorregirDatos';
// USUARIOS
import ListaUsuarios from '../pages/admin/ListaUsuarios';
import ReporteUsuarios from '../pages/admin/ReportesUsuarios'
import MostrarUsuario from '../pages/admin/MostrarUsuario';
// PROGRMACIÓN
import Actividades from '../pages/admin/Actividades';
import Dependientes from '../pages/admin/Dependientes';
//REPORTE
import ReporteTareas from '../pages/admin/ReporteTareas'
import RegistroPeriodico from '../pages/admin/RegistroPeriodico'
import EnConstruction from '../components/common/EnConstruccion';


export default function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Rutas protegidas (Requires Login) */}
        <Route element={<ProtectedRoutes/>}>
          <Route element={<Layout/>}>

            {/* Home Route */}
            <Route path="/inicio" element={<Inicio/>} />
            
            {/* DIPLOMAS Y TÍTULOS */}
            <Route path="/diplomas/listar-tomos" element={<ListarTomos />} />
            <Route path="/diplomas/buscar-titulo" element={<BuscarTitulo />} />
            <Route path="/diplomas/importar-titulos" element={<ImportarTitulos />} />
            <Route path="/diplomas/reportes" element={<ReportesDiplomas />} />
            <Route path="/diplomas/duplicados" element={<Duplicados />} />

            {/* RESOLUCIONES */}
            <Route path="/resoluciones/listar-tomos" element={<ListarTomosResoluciones />} />
            <Route path="/resoluciones/listar-resoluciones" element={<ListarResoluciones />} />
            <Route path="/resoluciones/autoridad" element={<Autoridad />} />
            <Route path="/resoluciones/codigo-archivado" element={<CodigoArchivado />} />
            <Route path="/resoluciones/busquedas" element={<BusquedasResoluciones />} />
            <Route path="/resoluciones/importar" element={<ImportarResoluciones />} />
            <Route path="/resoluciones/temas-interes" element={<TemasInteres />} />
            <Route path="/resoluciones/reportes" element={<ReportesResoluciones />} />
            <Route path="/resoluciones-rfc-rcc" element={<ResolucionesRFCRCC />} />
            
            {/* SERVICIOS */}
            <Route path="/servicios/configurar-tramites" element={<ConfigurarTramites />} />
            {/* ✨ TRÁMITES DE LEGALIZACIÓN CON FECHA Y BÚSQUEDA */}
            <Route path="/servicios/tramites" element={<Tramites />} />
            <Route path="/servicios/tramites/:fecha" element={<Tramites />} />
            <Route path="/servicios/buscar-tramite-legalizacion/:numero" element={<Tramites />} />
            <Route path="/servicios/entrega" element={<EntregaTramites />} />
            <Route path="/servicios/reportes" element={<ReportesServicios />} />

            {/* APOSTILLA */}
            {/* ✨ TRÁMITES DE APOSTILLA CON FECHA OPCIONAL */}
            <Route path="/apostilla/tramites" element={<TramitesApostilla />} />
            <Route path="/apostilla/tramites/:fecha" element={<TramitesApostilla />} />
            <Route path="/apostilla/configurar" element={<ConfigurarApostilla />} />
            <Route path="/apostilla/reportes" element={<ReportesApostilla />} />

            {/* NO ATENTADO */}
            <Route path="/no-atentado/convocatoria" element={<Convocatoria />} />
            <Route path="/no-atentado/sancionados" element={<ListaSancionados />} />
            <Route path="/no-atentado/reportes" element={<ReportesNoAtentado />} />

            {/* UNIDADES */}
            <Route path="/unidades/facultad" element={<Facultad />} />
            <Route path="/unidades/unidad" element={<Unidad />} />

            {/* FIRMA & OTROS */}
            <Route path="/firma" element={<Firma />} />
            <Route path="/claustros/consejos" element={<Consejos />} />
            {/* FUNCIONARIOS */}
            <Route path="/funcionarios/docentes" element={<Docentes />} />
            <Route path="/funcionarios/administrativos" element={<Administrativos />} />
            <Route path="/funcionarios/Reporte" element={<ReporteFuncionarios />} />
            
            {/* ADMINISTRACIÓN */}
            <Route path="/administracion/corregir-datos" element={<CorregirDatos />} />
            {/* USUARIOS */}
            <Route path="/administracion/usuarios" element={<ListaUsuarios />} />
            <Route path="/administracion/usuarios/reportes" element={<ReporteUsuarios />} />
            <Route path="/usuarios/:userId/mostrar-usuario" element={<MostrarUsuario />} />
            {/* PROGRAMACIÓN */}
            <Route path="/administracion/programacion/actividades" element={<Actividades />} />
            <Route path="/administracion/programacion/dependientes" element={<Dependientes />} />
            {/* REPORTE */}
            <Route path="/administracion/reporte/tareas" element={<ReporteTareas />} />
            <Route path="/administracion/reporte/periodico" element={<RegistroPeriodico />} />

            {/*404 Route */}
            <Route path="*" element={<EnConstruction pageName='No Encontrada'/>} />

          </Route>
        </Route>
        
      </Routes>
    </AuthProvider>
  );
}
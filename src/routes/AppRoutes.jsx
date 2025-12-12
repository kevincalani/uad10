import { Routes, Route } from 'react-router-dom';
import ProtectedRoutes, { RequirePermission } from './ProtectedRoutes';
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
// PROGRAMACIÓN
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

            {/* Home Route - Solo requiere autenticación */}
            <Route path="/inicio" element={<Inicio/>} />
            
            {/* ============================================ */}
            {/* DIPLOMAS Y TÍTULOS */}
            {/* ============================================ */}
            <Route 
              path="/diplomas/listar-tomos" 
              element={
                <RequirePermission permission="acceso al sistema - dyt">
                  <ListarTomos />
                </RequirePermission>
              } 
            />
            <Route 
              path="/diplomas/buscar-titulo" 
              element={
                <RequirePermission permission="busqueda - dyt">
                  <BuscarTitulo />
                </RequirePermission>
              } 
            />
            <Route 
              path="/diplomas/importar-titulos" 
              element={
                <RequirePermission permission="realizar importación - dyt">
                  <ImportarTitulos />
                </RequirePermission>
              } 
            />
            <Route 
              path="/diplomas/reportes" 
              element={
                <RequirePermission permission="acceso al sistema - dyt">
                  <ReportesDiplomas />
                </RequirePermission>
              } 
            />
            <Route 
              path="/diplomas/duplicados" 
              element={
                <RequirePermission permission="corregir duplicados - adm">
                  <Duplicados />
                </RequirePermission>
              } 
            />

            {/* ============================================ */}
            {/* RESOLUCIONES */}
            {/* ============================================ */}
            <Route 
              path="/resoluciones/listar-tomos" 
              element={
                <RequirePermission permission="ver tomos - rr">
                  <ListarTomosResoluciones />
                </RequirePermission>
              } 
            />
            <Route 
              path="/resoluciones/listar-resoluciones" 
              element={
                <RequirePermission permission="listar resoluciones - rr">
                  <ListarResoluciones />
                </RequirePermission>
              } 
            />
            <Route 
              path="/resoluciones/autoridad" 
              element={
                <RequirePermission permission="ver autoridad - rr">
                  <Autoridad />
                </RequirePermission>
              } 
            />
            <Route 
              path="/resoluciones/codigo-archivado" 
              element={
                <RequirePermission permission="acceder al codigo archivado - rr">
                  <CodigoArchivado />
                </RequirePermission>
              } 
            />
            <Route 
              path="/resoluciones/busquedas" 
              element={
                <RequirePermission permission="buscar - rr">
                  <BusquedasResoluciones />
                </RequirePermission>
              } 
            />
            <Route 
              path="/resoluciones/importar" 
              element={
                <RequirePermission permission="importar - rr">
                  <ImportarResoluciones />
                </RequirePermission>
              } 
            />
            <Route 
              path="/resoluciones/temas-interes" 
              element={
                <RequirePermission permission="acceder a temas - rr">
                  <TemasInteres />
                </RequirePermission>
              } 
            />
            <Route 
              path="/resoluciones/reportes" 
              element={
                <RequirePermission permission="ver reportes - rr">
                  <ReportesResoluciones />
                </RequirePermission>
              } 
            />
            <Route 
              path="/resoluciones-rfc-rcc" 
              element={
                <RequirePermission permission="acceder al sistema - rfc">
                  <ResolucionesRFCRCC />
                </RequirePermission>
              } 
            />
            
            {/* ============================================ */}
            {/* SERVICIOS */}
            {/* ============================================ */}
            <Route 
              path="/servicios/configurar-tramites" 
              element={
                <RequirePermission permission="acceso al sistema - srv">
                  <ConfigurarTramites />
                </RequirePermission>
              } 
            />
            <Route 
              path="/servicios/tramites" 
              element={
                <RequirePermission permission="acceso al sistema - srv">
                  <Tramites />
                </RequirePermission>
              } 
            />
            <Route 
              path="/servicios/tramites/:fecha" 
              element={
                <RequirePermission permission="acceso al sistema - srv">
                  <Tramites />
                </RequirePermission>
              } 
            />
            <Route 
              path="/servicios/buscar-tramite-legalizacion/:numero" 
              element={
                <RequirePermission permission="acceso al sistema - srv">
                  <Tramites />
                </RequirePermission>
              } 
            />
            <Route 
              path="/servicios/entrega" 
              element={
                <RequirePermission permission="listar entregas - srv">
                  <EntregaTramites />
                </RequirePermission>
              } 
            />
            <Route 
              path="/servicios/reportes" 
              element={
                <RequirePermission permission="acceso al sistema - srv">
                  <ReportesServicios />
                </RequirePermission>
              } 
            />

            {/* ============================================ */}
            {/* APOSTILLA */}
            {/* ============================================ */}
            <Route 
              path="/apostilla/tramites" 
              element={
                <RequirePermission permission="acceso al sistema - apo">
                  <TramitesApostilla />
                </RequirePermission>
              } 
            />
            <Route 
              path="/apostilla/tramites/:fecha" 
              element={
                <RequirePermission permission="acceso al sistema - apo">
                  <TramitesApostilla />
                </RequirePermission>
              } 
            />
            <Route 
              path="/apostilla/configurar" 
              element={
                <RequirePermission permission="acceso al sistema - apo">
                  <ConfigurarApostilla />
                </RequirePermission>
              } 
            />
            <Route 
              path="/apostilla/reportes" 
              element={
                <RequirePermission permission="ver reportes - apo">
                  <ReportesApostilla />
                </RequirePermission>
              } 
            />

            {/* ============================================ */}
            {/* NO ATENTADO */}
            {/* ============================================ */}
            <Route 
              path="/no-atentado/convocatoria" 
              element={
                <RequirePermission permission="acceder al sistema - noa">
                  <Convocatoria />
                </RequirePermission>
              } 
            />
            <Route 
              path="/no-atentado/sancionados" 
              element={
                <RequirePermission permission="acceder al sistema - noa">
                  <ListaSancionados />
                </RequirePermission>
              } 
            />
            <Route 
              path="/no-atentado/reportes" 
              element={
                <RequirePermission permission="acceder al sistema - noa">
                  <ReportesNoAtentado />
                </RequirePermission>
              } 
            />

            {/* ============================================ */}
            {/* UNIDADES */}
            {/* ============================================ */}
            <Route 
              path="/unidades/facultad" 
              element={
                <RequirePermission permission="acceso al sistema - f">
                  <Facultad />
                </RequirePermission>
              } 
            />
            <Route 
              path="/unidades/unidad" 
              element={
                <RequirePermission permission="acceso al sistema - f">
                  <Unidad />
                </RequirePermission>
              } 
            />

            {/* ============================================ */}
            {/* FIRMA & CLAUSTROS */}
            {/* ============================================ */}
            <Route 
              path="/firma" 
              element={
                <RequirePermission permission="acceso al sistema - srv">
                  <Firma />
                </RequirePermission>
              } 
            />
            <Route 
              path="/claustros/consejos" 
              element={
                <RequirePermission permission="acceder al sistema - cla">
                  <Consejos />
                </RequirePermission>
              } 
            />

            {/* ============================================ */}
            {/* FUNCIONARIOS */}
            {/* ============================================ */}
            <Route 
              path="/funcionarios/docentes" 
              element={
                <RequirePermission permission="acceder al sistema - dya">
                  <Docentes />
                </RequirePermission>
              } 
            />
            <Route 
              path="/funcionarios/administrativos" 
              element={
                <RequirePermission permission="acceder al sistema - dya">
                  <Administrativos />
                </RequirePermission>
              } 
            />
            <Route 
              path="/funcionarios/Reporte" 
              element={
                <RequirePermission permission="acceder al sistema - dya">
                  <ReporteFuncionarios />
                </RequirePermission>
              } 
            />
            
            {/* ============================================ */}
            {/* ADMINISTRACIÓN */}
            {/* ============================================ */}
            <Route 
              path="/administracion/corregir-datos" 
              element={
                <RequirePermission permission="acceso al sistema - adm">
                  <CorregirDatos />
                </RequirePermission>
              } 
            />

            {/* USUARIOS */}
            <Route 
              path="/administracion/usuarios" 
              element={
                <RequirePermission permission="acceso al sistema - adm">
                  <ListaUsuarios />
                </RequirePermission>
              } 
            />
            <Route 
              path="/administracion/usuarios/reportes" 
              element={
                <RequirePermission permission="acceso al sistema - adm">
                  <ReporteUsuarios />
                </RequirePermission>
              } 
            />
            <Route 
              path="/usuarios/:userId/mostrar-usuario" 
              element={
                <RequirePermission permission="acceso al sistema - adm">
                  <MostrarUsuario />
                </RequirePermission>
              } 
            />

            {/* PROGRAMACIÓN */}
            <Route 
              path="/administracion/programacion/actividades" 
              element={
                <RequirePermission permission="acceso al sistema - adm">
                  <Actividades />
                </RequirePermission>
              } 
            />
            <Route 
              path="/administracion/programacion/dependientes" 
              element={
                <RequirePermission permission="acceso al sistema - adm">
                  <Dependientes />
                </RequirePermission>
              } 
            />

            {/* REPORTE */}
            <Route 
              path="/administracion/reporte/tareas" 
              element={
                <RequirePermission permission="acceder a reportes - rep">
                  <ReporteTareas />
                </RequirePermission>
              } 
            />
            <Route 
              path="/administracion/reporte/periodico" 
              element={
                <RequirePermission permission="acceder a reportes - rep">
                  <RegistroPeriodico />
                </RequirePermission>
              } 
            />

            {/* 404 Route */}
            <Route path="*" element={<EnConstruction pageName='No Encontrada'/>} />

          </Route>
        </Route>
        
      </Routes>
    </AuthProvider>
  );
}
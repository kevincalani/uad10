// 📁 hooks/useApostilla.jsx
import { useState } from 'react';
import api from '../api/axios';
import { toast } from '../utils/toast';

export const useApostilla = () => {
  const [loading, setLoading] = useState(false);
  const [documentos, setDocumentos] = useState([]);
  const [documento, setDocumento] = useState(null);
  const [tramites, setTramites] = useState([]);
  const [tramite, setTramite] = useState(null);

  // ==================== GESTIÓN DE DOCUMENTOS ====================

  /**
   * Obtener lista de documentos de apostilla
   */
  const obtenerDocumentos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/apostilla/listar-documentos');
      if (response.data.success) {
        setDocumentos(response.data.data.tramites || []);
        return response.data.data.tramites;
      }
    } catch (error) {
      console.error('Error al obtener documentos:', error);
      toast.error('Error al cargar documentos de apostilla');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener datos de un documento específico
   */
  const obtenerDocumento = async (cod_lis) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/apostilla/editar-documento/${cod_lis}`);
      if (response.data.success) {
        setDocumento(response.data.data.tramite);
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al obtener documento:', error);
      toast.error('Error al cargar datos del documento');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Guardar documento (crear o editar)
   */
  const guardarDocumento = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post('/api/apostilla/guardar-documento', formData);
      if (response.data.success) {
        toast.success(response.data.message);
        await obtenerDocumentos(); // Recargar lista
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al guardar documento:', error);
      const mensaje = error.response?.data?.message || 'Error al guardar documento';
      toast.error(mensaje);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Habilitar/deshabilitar documento
   */
  const habilitarDocumento = async (cod_lis) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/apostilla/habilitar-documento/${cod_lis}`);
      if (response.data.success) {
        toast.success(response.data.message);
        await obtenerDocumentos(); // Recargar lista
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al habilitar documento:', error);
      toast.error('Error al modificar el estado del documento');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verificar si se puede eliminar documento
   */
  const verificarEliminarDocumento = async (cod_lis) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/apostilla/verificar-eliminar-documento/${cod_lis}`);
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al verificar eliminación:', error);
      toast.error('Error al verificar eliminación');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar documento
   */
  const eliminarDocumento = async (cod_lis) => {
    setLoading(true);
    try {
      const response = await api.post('/api/apostilla/eliminar-documento', { cl: cod_lis });
      if (response.data.success) {
        toast.success(response.data.message);
        await obtenerDocumentos(); // Recargar lista
        return true;
      }
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      const mensaje = error.response?.data?.message || 'Error al eliminar documento';
      toast.error(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ==================== GESTIÓN DE TRÁMITES ====================

  /**
   * Listar trámites por fecha
   */
  const listarTramitesPorFecha = async (fecha) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/apostilla/listar-tramites/${fecha}`);
      if (response.data.success) {
        setTramites(response.data.data.tramites || []);
        console.log(response)
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al listar trámites:', error);
      toast.error('Error al cargar trámites');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar tabla de trámites (para refrescar)
   */
  const actualizarTablaTramites = async (fecha) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/apostilla/actualizar-tabla-tramites/${fecha}`);
      if (response.data.success) {
        setTramites(response.data.data.tramites || []);
        return response.data.data.tramites;
      }
    } catch (error) {
      console.error('Error al actualizar tabla:', error);
      toast.error('Error al actualizar la tabla');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener datos para formulario de trámite
   */
  const obtenerDatosTramite = async (cod_apos) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/apostilla/datos-tramite/${cod_apos}`);
      if (response.data.success) {
        setTramite(response.data.data.tramite_apostilla);
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al obtener datos del trámite:', error);
      toast.error('Error al cargar datos del trámite');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Guardar trámite de apostilla (crear nuevo)
   */
  const guardarTramite = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post('/api/apostilla/guardar-tramite', formData);
      if (response.data.success) {
        toast.success(response.data.message);
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al guardar trámite:', error);
      const mensaje = error.response?.data?.message || 'Error al guardar trámite';
      toast.error(mensaje);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Guardar apoderado de trámite
   */
  const guardarApoderadoTramite = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post('/api/apostilla/guardar-apoderado-tramite', formData);
      if (response.data.success) {
        toast.success(response.data.message);
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al guardar apoderado:', error);
      const mensaje = error.response?.data?.message || 'Error al guardar apoderado';
      toast.error(mensaje);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener datos para agregar documento a trámite
   */
  const obtenerDatosAgregarDocumento = async (cod_lis, cod_apos) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/apostilla/datos-agregar-documento/${cod_lis}/${cod_apos}`);
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);
      toast.error('Error al cargar datos');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Agregar documento a trámite
   */
  const agregarDocumentoTramite = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post('/api/apostilla/agregar-documento-tramite', formData);
      if (response.data.success) {
        toast.success(response.data.message);
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al agregar documento:', error);
      const mensaje = error.response?.data?.message || 'Error al agregar documento';
      toast.error(mensaje);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener tabla de documentos agregados
   */
  const obtenerDocumentosAgregados = async (cod_apos) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/apostilla/tabla-documentos-agregados/${cod_apos}`);
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al obtener documentos agregados:', error);
      toast.error('Error al cargar documentos agregados');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar documento agregado
   */
  const eliminarDocumentoAgregado = async (cod_dapo) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/apostilla/eliminar-documento-agregado/${cod_dapo}`);
      if (response.data.success) {
        toast.success(response.data.message);
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      toast.error('Error al eliminar documento');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generar PDF del trámite
   */
  const generarPDFTramite = async (cod_apos, apos_numero) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/apostilla/generar-pdf/${cod_apos}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Tramite ${apos_numero}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF generado correctamente');
      return true;
    } catch (error) {
      console.error('Error al generar PDF:', error);
      toast.error('Error al generar PDF');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verificar si se puede eliminar trámite
   */
  const verificarEliminarTramite = async (cod_apos) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/apostilla/verificar-eliminar-tramite/${cod_apos}`);
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al verificar eliminación:', error);
      toast.error('Error al verificar eliminación');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar trámite
   */
  const eliminarTramite = async (cod_apos) => {
    setLoading(true);
    try {
      const response = await api.post('/api/apostilla/eliminar-tramite', {
        ca: cod_apos 
      });
      if (response.data.success) {
        toast.success(response.data.message);
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al eliminar trámite:', error);
      const mensaje = error.response?.data?.message || 'Error al eliminar trámite';
      toast.error(mensaje);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Firmar trámite
   */
  const firmarTramite = async (cod_apos) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/apostilla/firmar-tramite/${cod_apos}`);
      if (response.data.success) {
        toast.success(response.data.message);
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al firmar trámite:', error);
      toast.error('Error al firmar trámite');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener datos de entrega
   */
  const obtenerDatosEntrega = async (cod_apos) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/apostilla/datos-entrega/${cod_apos}`);
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al obtener datos de entrega:', error);
      toast.error('Error al cargar datos de entrega');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Registrar entrega de trámite
   */
  const registrarEntrega = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post('/api/apostilla/registrar-entrega', formData);
      if (response.data.success) {
        toast.success(response.data.message);
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al registrar entrega:', error);
      const mensaje = error.response?.data?.message || 'Error al registrar entrega';
      toast.error(mensaje);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ==================== BÚSQUEDA ====================

  /**
   * Buscar trámites de apostilla
   */
  const buscarTramites = async (filtros) => {
    setLoading(true);
    try {
      const response = await api.post('/api/apostilla/buscar', filtros);
      if (response.data.success) {
        return response.data.data.resultado;
      }
    } catch (error) {
      console.error('Error al buscar trámites:', error);
      toast.error('Error al buscar trámites');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Ver datos del trámite buscado
   */
  const verDatosTramite = async (cod_apos) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/apostilla/ver-datos/${cod_apos}`);
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);
      toast.error('Error al cargar datos');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mostrar observación del trámite
   */
  const obtenerObservacion = async (cod_apos) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/apostilla/observacion/${cod_apos}`);
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al obtener observación:', error);
      toast.error('Error al cargar observación');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Guardar observación del trámite
   */
  const guardarObservacion = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post('/api/apostilla/guardar-observacion', formData);
      if (response.data.success) {
        toast.success(response.data.message);
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al guardar observación:', error);
      toast.error('Error al guardar observación');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 📊 REPORTES: Obtener datos iniciales para reportes
   * GET /api/apostilla/datos-reportes
   */
  const obtenerDatosReportes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/apostilla/lista-reportes');
      if (response.data.success) {
        console.log(response)
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al obtener datos de reportes:', error);
      toast.error('Error al cargar datos de reportes');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 📊 REPORTES: Generar reporte con filtros
   * POST /api/apostilla/generar-reporte
   */
  const generarReporte = async (filtros) => {
    setLoading(true);
    try {
      const response = await api.post('/api/apostilla/ver-reporte', filtros);
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al generar reporte:', error);
      toast.error('Error al generar reporte');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 📊 REPORTES: Descargar PDF del reporte
   * POST /api/apostilla/generar-reporte (con pdf: 'on')
   */
  const descargarReportePDF = async (filtros) => {
    setLoading(true);
    try {
      const response = await api.post('/api/apostilla/ver-reporte', 
        { ...filtros, pdf: 'on' },
        { responseType: 'blob' } // Importante para recibir el archivo
      );

      // Crear un enlace temporal para descargar el PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Reporte_Apostilla.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Reporte PDF descargado correctamente');
      return true;
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      toast.error('Error al descargar el reporte PDF');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    // Estado
    loading,
    documentos,
    documento,
    tramites,
    tramite,
    
    // Setters
    setDocumento,
    setTramite,
    setTramites,
    
    // Gestión de documentos
    obtenerDocumentos,
    obtenerDocumento,
    guardarDocumento,
    habilitarDocumento,
    verificarEliminarDocumento,
    eliminarDocumento,
    
    // Gestión de trámites
    listarTramitesPorFecha,
    actualizarTablaTramites,
    obtenerDatosTramite,
    guardarTramite,
    guardarApoderadoTramite,
    obtenerDatosAgregarDocumento,
    agregarDocumentoTramite,
    obtenerDocumentosAgregados,
    eliminarDocumentoAgregado,
    generarPDFTramite,
    verificarEliminarTramite,
    eliminarTramite,
    firmarTramite,
    obtenerDatosEntrega,
    registrarEntrega,
    
    // Búsqueda
    buscarTramites,
    verDatosTramite,
    
    // Observaciones
    obtenerObservacion,
    guardarObservacion,
    
    // Reportes
    obtenerDatosReportes,
    generarReporte,
    descargarReportePDF,
  };
};
// 📁 hooks/useReporteServicios.jsx
import { useState } from 'react';
import api from '../api/axios';
import { toast } from '../utils/toast';

export const useReporteServicios = () => {
  const [loading, setLoading] = useState(false);
  const [tramites, setTramites] = useState([]);
  const [resultado, setResultado] = useState(null);

  // Obtener lista de trámites para los selects
  const obtenerTramites = async (modal) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/reportes/modal-reporte-servicios/${modal}`);
      if (response.data.success) {
        setTramites(response.data.data.tramites || []);
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al obtener trámites:', error);
      toast.error('Error al cargar los datos del reporte');
    } finally {
      setLoading(false);
    }
  };

  // Reporte personal
  const generarReportePersonal = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post('/api/reportes/reporte-servicios-personal', formData);
      if (response.data.success) {
        setResultado(response.data.data);
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al generar reporte personal:', error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Búsqueda inválida');
      } else if (error.response?.status === 404) {
        toast.error('No se encontró ninguna persona con ese CI');
      } else {
        toast.error('Error al generar el reporte');
      }
    } finally {
      setLoading(false);
    }
  };

  // Reporte general
  const generarReporteGeneral = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post('/api/reportes/reporte-servicios-general', formData);
      if (response.data.success) {
        setResultado(response.data.data);
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al generar reporte general:', error);
      toast.error('Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  // Reporte estadístico
  const generarReporteEstadistico = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post('/api/reportes/reporte-servicios-estadistico', formData);
      if (response.data.success) {
        setResultado(response.data.data);
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al generar reporte estadístico:', error);
      toast.error('Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  // Obtener detalle de trámite
  const obtenerDetalleTramite = async (cod_dtra) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/reportes/detalle-tramite-reporte/${cod_dtra}`);
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al obtener detalle:', error);
      toast.error('Error al cargar el detalle del trámite');
    } finally {
      setLoading(false);
    }
  };

  // Descargar PDF de listas
  const descargarPDFListas = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post('/api/reportes/reporte-servicios-listas', formData, {
        responseType: 'blob'
      });
      
      // Crear un enlace para descargar el PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Reporte_Listas.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('PDF generado correctamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      toast.error('Error al generar el PDF');
    } finally {
      setLoading(false);
    }
  };

  // Descargar PDF de entregas
  const descargarPDFEntregas = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post('/api/reportes/reporte-servicios-entregas', formData, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Reporte_Entregas.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('PDF generado correctamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      toast.error('Error al generar el PDF');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos de persona por CI
  const cargarDatosPersona = async (ci) => {
    try {
      const response = await api.get(`/api/datos_per/${ci}`);
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error al cargar datos de persona:', error);
      return null;
    }
  };

  return {
    loading,
    tramites,
    resultado,
    obtenerTramites,
    generarReportePersonal,
    generarReporteGeneral,
    generarReporteEstadistico,
    obtenerDetalleTramite,
    descargarPDFListas,
    descargarPDFEntregas,
    cargarDatosPersona,
    setResultado
  };
};
import React, { useState } from 'react';
import { FileDown, BarChart3, X } from 'lucide-react';
import { useApostilla } from '../../hooks/useApostilla';
import { toast } from '../../utils/toast';

export default function FiltrosReporteModal({ onClose, lista = [], onGenerar }) {
  const { generarReporte, descargarReportePDF, loading } = useApostilla();

  const [filtros, setFiltros] = useState({
    documento: '',
    dia: '',
    mes: '',
    gestion: '',
    dia_final: '',
    mes_final: '',
    gestion_final: '',
  });

  // Generar arrays para selectores
  const dias = Array.from({ length: 31 }, (_, i) => i + 1);
  const meses = [
    { value: '1', label: 'ENERO' },
    { value: '2', label: 'FEBRERO' },
    { value: '3', label: 'MARZO' },
    { value: '4', label: 'ABRIL' },
    { value: '5', label: 'MAYO' },
    { value: '6', label: 'JUNIO' },
    { value: '7', label: 'JULIO' },
    { value: '8', label: 'AGOSTO' },
    { value: '9', label: 'SEPTIEMBRE' },
    { value: '10', label: 'OCTUBRE' },
    { value: '11', label: 'NOVIEMBRE' },
    { value: '12', label: 'DICIEMBRE' },
  ];
  
  const añoActual = new Date().getFullYear();
  const años = Array.from({ length: añoActual - 2017 + 1 }, (_, i) => añoActual - i);

  const handleChange = (name, value) => {
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const construirCriterios = () => {
    let criterios = {};

    // Documento
    if (filtros.documento) {
      if (filtros.documento === 'tramites') {
        criterios.documento = 'Trámites ingresados';
      } else {
        const doc = lista.find(l => l.cod_lis === parseInt(filtros.documento));
        criterios.documento = doc ? doc.lis_alias : 'Documento seleccionado';
      }
    } else {
      criterios.documento = 'Todos los documentos';
    }

    // Fechas
    if (filtros.dia && filtros.mes && filtros.gestion) {
      criterios.fechaInicial = `${filtros.dia}/${filtros.mes}/${filtros.gestion}`;
    } else if (filtros.mes && filtros.gestion) {
      criterios.fechaInicial = `${filtros.mes}/${filtros.gestion}`;
    } else if (filtros.gestion) {
      criterios.fechaInicial = filtros.gestion;
    }

    if (filtros.dia_final && filtros.mes_final && filtros.gestion_final) {
      criterios.fechaFinal = `${filtros.dia_final}/${filtros.mes_final}/${filtros.gestion_final}`;
    } else if (filtros.mes_final && filtros.gestion_final) {
      criterios.fechaFinal = `${filtros.mes_final}/${filtros.gestion_final}`;
    } else if (filtros.gestion_final) {
      criterios.fechaFinal = filtros.gestion_final;
    }

    return criterios;
  };

  const handleGenerar = async () => {
    const datos = await generarReporte(filtros);
    
    if (datos) {
      if (datos.mensaje) {
        toast.error(datos.mensaje);
        return;
      }

      const criterios = construirCriterios();
      onGenerar({ resultado: datos.resultado, criterios });
      onClose();
      toast.success('Reporte generado correctamente');
    }
  };

  const handleGenerarPDF = async () => {
    const success = await descargarReportePDF(filtros);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-2">
            <BarChart3 size={24} />
            <h2 className="text-xl font-bold">Reporte</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 rounded-full p-1 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Título */}
          <div className="bg-blue-600 text-white rounded px-4 py-2 mb-6 w-fit mx-auto">
            <h6 className="text-center font-semibold">Reporte</h6>
          </div>

          <p className="text-blue-600 font-bold italic mb-6">* Parámetros del reporte</p>

          <div className="max-w-2xl mx-auto space-y-6">
            {/* Tipo de documento */}
            <div className="grid grid-cols-3 gap-4 items-center border-b pb-4">
              <label className="text-right font-medium text-gray-700 italic">
                Tipo de documento:
              </label>
              <div className="col-span-2">
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filtros.documento}
                  onChange={(e) => handleChange('documento', e.target.value)}
                >
                  <option value=""></option>
                  <option value="tramites">TRÁMITES INGRESADOS</option>
                  {lista.map((l) => (
                    <option key={l.cod_lis} value={l.cod_lis}>
                      {l.lis_alias}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fecha inicio */}
            <div className="grid grid-cols-3 gap-4 items-center border-b pb-4">
              <label className="text-right font-medium text-gray-700 italic">
                Fecha inicio:
              </label>
              <div className="col-span-2 flex items-center gap-2">
                <select
                  className="border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filtros.dia}
                  onChange={(e) => handleChange('dia', e.target.value)}
                >
                  <option value="">Día</option>
                  {dias.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <span className="text-gray-600">/</span>
                <select
                  className="border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filtros.mes}
                  onChange={(e) => handleChange('mes', e.target.value)}
                >
                  <option value="">Mes</option>
                  {meses.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                <span className="text-gray-600">/</span>
                <select
                  className="border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filtros.gestion}
                  onChange={(e) => handleChange('gestion', e.target.value)}
                >
                  <option value="">Año</option>
                  {años.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fecha final */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <label className="text-right font-medium text-gray-700 italic">
                Fecha final:
              </label>
              <div className="col-span-2 flex items-center gap-2">
                <select
                  className="border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filtros.dia_final}
                  onChange={(e) => handleChange('dia_final', e.target.value)}
                >
                  <option value="">Día</option>
                  {dias.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <span className="text-gray-600">/</span>
                <select
                  className="border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filtros.mes_final}
                  onChange={(e) => handleChange('mes_final', e.target.value)}
                >
                  <option value="">Mes</option>
                  {meses.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                <span className="text-gray-600">/</span>
                <select
                  className="border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filtros.gestion_final}
                  onChange={(e) => handleChange('gestion_final', e.target.value)}
                >
                  <option value="">Año</option>
                  {años.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3 border-t">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleGenerar}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            <BarChart3 size={18} />
            {loading ? 'Generando...' : 'Generar'}
          </button>
          <button
            onClick={handleGenerarPDF}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            <FileDown size={18} />
            {loading ? 'Generando PDF...' : 'Generar PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
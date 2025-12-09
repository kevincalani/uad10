// 📁 components/reportes/ResultadoReporteEstadistico.jsx
import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

export default function ResultadoReporteEstadistico ({ resultado }) {
  const { resultado: data, form, tramite, mes, tipo } = resultado;
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const tipoTramiteNombre = (tipoCode) => {
    const tipos = {
      'L': 'LEGALIZACIÓN',
      'C': 'CERTIFICACIÓN',
      'F': 'CONFRONTACIÓN',
      'B': 'BÚSQUEDA'
    };
    return tipos[tipoCode] || tipoCode;
  };

  const nombreMes = (numMes) => {
    const meses = [
      'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];
    return meses[parseInt(numMes) - 1] || numMes;
  };

  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      // Destruir gráfico anterior si existe
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');

      // Preparar datos para el gráfico
      const labels = data.map(item => 
        mes === 1 ? nombreMes(item.mes) : item.dtra_gestion_tramite
      );
      const valores = data.map(item => parseInt(item.cantidad));

      // Determinar título del gráfico
      let titulo = 'Reporte General';
      if (tipo === 'tramite' && tramite) {
        titulo = `Trámite: ${tramite.tre_nombre}`;
      } else if (tipo === 'tipo' && form.tipo) {
        titulo = `Tipo de trámite: ${tipoTramiteNombre(form.tipo)}`;
      }

      // Crear nuevo gráfico
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Trámites ingresados',
            data: valores,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: 'rgb(59, 130, 246)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: titulo,
              font: {
                size: 16,
                weight: 'bold'
              }
            },
            legend: {
              position: 'right'
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Periodos'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Cantidad de trámites'
              },
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }

    // Cleanup al desmontar
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, mes, tipo, tramite, form]);

  return (
    <div>
      <span className="font-bold text-red-600 block mb-4">
        RESULTADO CON EL CRITERIO DE BÚSQUEDA
      </span>

      <div className="bg-green-100 p-3 ml-5 rounded mb-4 inline-block">
        {tramite && (
          <span>
            <span className="text-gray-800">Trámite: </span>
            <span className="text-blue-600">{tramite.tre_nombre}</span>
            {' | '}
          </span>
        )}
        {form.tipo && (
          <span>
            <span className="text-gray-800">Tipo de Trámite: </span>
            <span className="text-blue-600">{tipoTramiteNombre(form.tipo)}</span>
            {' | '}
          </span>
        )}
        {form.gestion_inicial && (
          <span>
            <span className="text-gray-800">Gestión Inicio: </span>
            <span className="text-blue-600">{form.gestion_inicial}</span>
            {' | '}
          </span>
        )}
        {form.gestion_final && (
          <span>
            <span className="text-gray-800">Gestión final: </span>
            <span className="text-blue-600">{form.gestion_final}</span>
          </span>
        )}
      </div>

      <hr className="my-4 border-gray-300" />

      {data.length === 0 ? (
        <span className="text-red-600 font-bold italic">
          * No se encontraron resultados
        </span>
      ) : (
        <div className="h-[470px]">
          <canvas ref={chartRef}></canvas>
        </div>
      )}
    </div>
  );
};
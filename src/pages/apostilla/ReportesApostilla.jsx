import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import { BarChart3, FileText } from 'lucide-react';
import { Chart } from 'chart.js/auto';
import { useApostilla } from '../../hooks/useApostilla';
import { useModal } from '../../hooks/useModal';
import FiltrosReporteModal from '../../modals/apostilla/FiltrosReporteModal';

export default function ReporteApostilla() {
  const { obtenerDatosReportes, loading } = useApostilla();
  const { openModal } = useModal();
  
  const [datosIniciales, setDatosIniciales] = useState(null);
  const [resultado, setResultado] = useState([]);
  const [criterios, setCriterios] = useState(null);
  const [mostrarGrafico, setMostrarGrafico] = useState(false);
  
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Cargar datos iniciales al montar
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  // Actualizar gráfico cuando cambien los resultados
  useEffect(() => {
    if (mostrarGrafico && resultado.length > 0 && chartRef.current) {
      renderizarGrafico();
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [resultado, mostrarGrafico]);

  const cargarDatosIniciales = async () => {
    const datos = await obtenerDatosReportes();
    if (datos) {
      setDatosIniciales(datos);
      setResultado(datos.resultado || []);
      setMostrarGrafico(false);
    }
  };

  const renderizarGrafico = () => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: resultado.map(r => r.nombre),
        datasets: [{
          label: 'Documentos',
          data: resultado.map(r => r.cantidad),
          borderColor: 'rgba(78, 115, 223, 1)',
          backgroundColor: 'rgba(78, 115, 223, 0.05)',
          pointBackgroundColor: 'rgba(78, 115, 223, 1)',
          pointBorderColor: 'rgba(78, 115, 223, 1)',
          pointRadius: 3,
          pointHoverRadius: 5,
          lineTension: 0.3,
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgb(255,255,255)',
            titleColor: '#6e707e',
            bodyColor: '#858796',
            borderColor: '#dddfeb',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                return 'Documentos: ' + context.parsed.y;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            },
            grid: {
              color: 'rgb(234, 236, 244)',
              borderDash: [2]
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  };

  const calcularTotal = () => {
    return resultado.reduce((sum, r) => sum + parseInt(r.cantidad || 0), 0);
  };

  const handleAbrirModal = () => {
    if (!datosIniciales) return;
    
    openModal(FiltrosReporteModal, {
      lista: datosIniciales.lista,
      onGenerar: (datos) => {
        setResultado(datos.resultado || []);
        setCriterios(datos.criterios);
        setMostrarGrafico(true);
      }
    });
  };

  if (loading && !datosIniciales) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Card className="shadow-md">
        <CardHeader className="bg-blue-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BarChart3 size={24} />
            <h1 className="text-xl font-bold">REPORTE</h1>
          </div>
          <Button
            color="primary"
            variant="solid"
            size="sm"
            startContent={<BarChart3 size={18} />}
            onPress={handleAbrirModal}
          >
            Nuevo reporte
          </Button>
        </CardHeader>

        <CardBody className="p-6">
          {/* Criterios de búsqueda - Solo si hay criterios */}
          {criterios && (
            <div className="mb-6">
              <p className="text-red-600 font-bold mb-2">* CRITERIO DE BÚSQUEDA</p>
              <div className="bg-green-50 border border-green-200 rounded p-4 italic text-gray-700">
                <p>
                  <span className="font-bold">Documentos: </span>
                  <span>{criterios.documento || 'Todos los documentos'}</span>
                </p>
                {criterios.fechaInicial && (
                  <>
                    <p>
                      <span className="font-bold">Fecha inicial: </span>
                      <span>{criterios.fechaInicial}</span>
                    </p>
                    {criterios.fechaFinal && (
                      <p>
                        <span className="font-bold">Fecha final: </span>
                        <span>{criterios.fechaFinal}</span>
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Vista con tabla y gráfico lado a lado (solo si mostrarGrafico es true) */}
          {mostrarGrafico ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tabla de datos */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader className="bg-blue-600 text-white">
                    <h6 className="font-bold">Datos</h6>
                  </CardHeader>
                  <CardBody>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="bg-blue-400 text-white">
                            <th className="px-3 py-2 text-center">Nº</th>
                            <th className="px-3 py-2 text-left">Documento</th>
                            <th className="px-3 py-2 text-right">Cantidad</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {resultado.map((r, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-3 py-2 text-center">{index + 1}</td>
                              <td className="px-3 py-2">{r.nombre}</td>
                              <td className="px-3 py-2 text-right">{r.cantidad}</td>
                            </tr>
                          ))}
                          <tr className="bg-gray-100 font-bold">
                            <td colSpan="2" className="px-3 py-2 text-center">TOTAL</td>
                            <td className="px-3 py-2 text-right">{calcularTotal()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Gráfico */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="bg-blue-600 text-white">
                    <h6 className="font-bold">Gráfico estadístico</h6>
                  </CardHeader>
                  <CardBody>
                    <div className="h-96">
                      <canvas ref={chartRef}></canvas>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          ) : (
            /* Vista inicial con solo tabla centrada */
            <div>
              <div className="bg-blue-600 text-white rounded px-4 py-2 mb-4 w-fit mx-auto">
                <h6 className="text-center font-semibold">Reporte</h6>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border">
                    <thead>
                      <tr className="bg-gray-500 text-white">
                        <th className="px-3 py-2 text-center border">Nº</th>
                        <th className="px-3 py-2 text-left border">Documento</th>
                        <th className="px-3 py-2 text-right border">Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultado.map((r, index) => (
                        <tr key={index} className="hover:bg-gray-50 border-b">
                          <td className="px-3 py-2 text-center border">{index + 1}</td>
                          <td className="px-3 py-2 border">{r.nombre}</td>
                          <td className="px-3 py-2 text-right border">{r.cantidad}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-100 font-bold">
                        <td colSpan="2" className="px-3 py-2 text-center border">TOTAL</td>
                        <td className="px-3 py-2 text-right border">{calcularTotal()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
import React from 'react';

export default function ResultadoReporteGeneral({ resultado }){
  const { resultado: data, form, tramite } = resultado;

  const tipoTramiteNombre = (tipo) => {
    const tipos = {
      'L': 'LEGALIZACIÓN',
      'C': 'CERTIFICACIÓN',
      'F': 'CONFRONTACIÓN',
      'B': 'BÚSQUEDA'
    };
    return tipos[tipo] || tipo;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-BO');
  };

  const totalTramites = data.reduce((sum, item) => sum + parseInt(item.cantidad), 0);

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
        {form.fecha_inicial && (
          <span>
            <span className="text-gray-800">Fecha Inicio: </span>
            <span className="text-blue-600">{formatearFecha(form.fecha_inicial)}</span>
            {' | '}
          </span>
        )}
        {form.fecha_final && (
          <span>
            <span className="text-gray-800">Fecha final: </span>
            <span className="text-blue-600">{formatearFecha(form.fecha_final)}</span>
          </span>
        )}
      </div>

      <hr className="my-4 border-gray-300" />

      <div className="h-96 overflow-auto">
        {data.length === 0 ? (
          <span className="text-red-600 font-bold italic">
            * No se encontraron resultados
          </span>
        ) : (
          <table className="table-auto w-11/12 mx-auto text-sm">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Trámite</th>
                <th className="px-4 py-2">Cantidad trámites</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{item.tre_nombre}</td>
                  <td className="px-4 py-2">{item.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <span className="font-bold text-gray-800">TOTAL TRÁMITES: </span>
        <span className="font-bold text-red-600 ml-2">{totalTramites}</span>
      </div>
    </div>
  );
};
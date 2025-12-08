// 📁 components/modals/apostilla/ListaDocumentosAgregados.jsx
import { useMemo, useState } from 'react';
import { Trash2, Search, ArrowUpDown } from 'lucide-react';
import { useApostilla } from '../../hooks/useApostilla';

export default function DocumentosAgregados({ documentos, tramite, onRefresh }) {
  const { eliminarDocumentoAgregado } = useApostilla();
  const [filterValue, setFilterValue] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleEliminar = async (cod_dapo) => {
    if (!confirm('¿Está seguro de eliminar este documento?')) return;

    const result = await eliminarDocumentoAgregado(cod_dapo);
    if (result) {
      onRefresh?.();
    }
  };

  // Filtrado
  const filteredDocs = useMemo(() => {
    if (!filterValue) return documentos;
    
    return documentos.filter(doc => 
      doc.lis_nombre?.toLowerCase().includes(filterValue.toLowerCase()) ||
      doc.dapo_numero?.toString().includes(filterValue) ||
      doc.dapo_numero_documento?.toString().includes(filterValue)
    );
  }, [documentos, filterValue]);

  // Sorting
  const sortedDocs = useMemo(() => {
    if (!sortConfig.key) return filteredDocs;

    return [...filteredDocs].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredDocs, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={12} className="text-gray-400" />;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="space-y-2">
      {/* Filtro */}
      {documentos.length > 0 && (
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Filtrar documentos..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="w-full pl-8 pr-3 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-auto max-h-[400px] border border-gray-200 rounded-lg">
        <table className="w-full text-xs">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white sticky top-0">
            <tr>
              <th className="p-2 text-left font-semibold">Nº</th>
              <th className="p-2 text-left font-semibold">Sitra</th>
              <th 
                className="p-2 text-left font-semibold cursor-pointer hover:bg-blue-700"
                onClick={() => handleSort('lis_nombre')}
              >
                <div className="flex items-center gap-1">
                  Nombre {getSortIcon('lis_nombre')}
                </div>
              </th>
              <th 
                className="p-2 text-left font-semibold cursor-pointer hover:bg-blue-700"
                onClick={() => handleSort('dapo_numero')}
              >
                <div className="flex items-center gap-1">
                  N° trámite {getSortIcon('dapo_numero')}
                </div>
              </th>
              <th className="p-2 text-left font-semibold">N° Documento</th>
              <th className="p-2 text-center font-semibold">Opciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedDocs.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  {filterValue ? 'No se encontraron documentos' : 'No hay documentos agregados'}
                </td>
              </tr>
            ) : (
              sortedDocs.map((doc, index) => (
                <tr key={doc.cod_dapo} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">-</td>
                  <td className="p-2 font-medium">{doc.lis_nombre}</td>
                  <td className="p-2">{doc.dapo_numero}</td>
                  <td className="p-2">
                    {doc.dapo_numero_documento}/{doc.dapo_gestion_documento}
                  </td>
                  <td className="p-2 text-center">
                    {tramite?.apos_estado <= 1 ? (
                      <button
                        onClick={() => handleEliminar(doc.cod_dapo)}
                        className="p-1.5 hover:bg-red-50 rounded-full transition-colors text-red-600"
                        title="Eliminar documento"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Contador */}
      {filterValue && (
        <div className="text-xs text-gray-600 text-right">
          Mostrando {sortedDocs.length} de {documentos.length} documento(s)
        </div>
      )}
    </div>
  );
}

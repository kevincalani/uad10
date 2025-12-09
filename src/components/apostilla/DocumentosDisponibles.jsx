
// 📁 components/modals/apostilla/ListaDocumentosDisponibles.jsx
import { useState, useMemo } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { useApostilla } from '../../hooks/useApostilla';
import { useModal } from '../../hooks/useModal';
import AgregarDocumentoModal from '../../modals/apostilla/AgregarDocumentoModal';


export default function DocumentosDisponibles({ documentos, cod_apos, tramite, onRefresh }) {
  const { openModal } = useModal();
  const { agregarDocumentoTramite } = useApostilla();
  const [loadingDoc, setLoadingDoc] = useState(null);
  const [filterValue, setFilterValue] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'lis_nombre', direction: 'asc' });

  const handleAgregarDirecto = async (doc) => {
    // Si el documento no requiere datos adicionales
    if (!doc.lis_tipo || doc.lis_tipo === '') {
      setLoadingDoc(doc.cod_lis);
      try {
        await agregarDocumentoTramite({
          cl: doc.cod_lis,
          ca: cod_apos
        });
        onRefresh?.();
      } finally {
        setLoadingDoc(null);
      }
    } else {
      // Si requiere datos adicionales, abrir modal
      openModal(AgregarDocumentoModal, {
        cod_lis: doc.cod_lis,
        cod_apos,
        onSuccess: () => onRefresh?.()
      });
    }
  };

  // Filtrado
  const filteredDocs = useMemo(() => {
    if (!filterValue) return documentos;
    
    return documentos.filter(doc => 
      doc.lis_nombre?.toLowerCase().includes(filterValue.toLowerCase()) ||
      doc.lis_alias?.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [documentos, filterValue]);

  // Sorting
  const sortedDocs = useMemo(() => {
    return [...filteredDocs].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const comparison = aVal.toString().localeCompare(bVal.toString());
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
    <div className="h-full flex flex-col">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3">
        <h3 className="text-sm font-semibold text-center">
          Lista de trámites de apostilla
        </h3>
      </div>

      {/* Filtro */}
      <div className="p-2 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Filtrar trámites..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="w-full pl-8 pr-3 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="overflow-auto flex-1 max-h-[450px]">
        <table className="w-full text-xs">
          <thead className="bg-blue-600 text-white sticky top-0">
            <tr>
              <th className="p-2 text-center font-semibold">N°</th>
              <th 
                className="p-2 text-left font-semibold cursor-pointer hover:bg-blue-700"
                onClick={() => handleSort('lis_alias')}
              >
                <div className="flex items-center gap-1">
                  TRÁMITE {getSortIcon('lis_alias')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedDocs.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center py-4 text-gray-500">
                  {filterValue ? 'No se encontraron trámites' : 'No hay documentos disponibles'}
                </td>
              </tr>
            ) : (
              sortedDocs.map((doc, index) => (
                <tr key={doc.cod_lis} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="p-2 text-center">{index + 1}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleAgregarDirecto(doc)}
                      disabled={loadingDoc === doc.cod_lis}
                      className={`w-full text-left px-2 py-1 rounded transition-colors ${
                        doc.lis_tipo 
                          ? 'text-blue-600 hover:bg-blue-50' 
                          : 'text-gray-700 hover:bg-gray-100'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loadingDoc === doc.cod_lis ? (
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                          {doc.lis_alias}
                        </span>
                      ) : (
                        doc.lis_alias
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Contador */}
      {filterValue && (
        <div className="p-2 text-xs text-gray-600 text-right border-t border-gray-200">
          {sortedDocs.length} de {documentos.length} trámite(s)
        </div>
      )}
    </div>
  );
}
// DocumentoRow.jsx
import React from 'react';
import { X, CircleCheck, CircleMinus, Trash2, Eye, FilePenLine, FileCode } from 'lucide-react';

export default function DocumentoRow({ doc, index, onCambiarDestino, onDelete, onObserve }) {

    // Determinar estado del documento
    const isObserved = !!doc.dtra_obs;
    const isBlocked = doc.dtra_anulado || doc.dtra_estado_doc === 0;

    // Nombre del trámite con indicación de interno si aplica
    const displayNombre = doc.dtra_interno === 't'
        ? <>{doc.tre_nombre} <span className="text-red-600 font-semibold">(Int.)</span></>
        : doc.tre_nombre;

    // Número de trámite formateado
    const numeroTramiteDisplay = `${doc.dtra_numero_tramite} / ${doc.dtra_gestion_tramite || new Date().getFullYear()}`;

    // Número de titulo formateado
    const numeroTituloDisplay = `${doc.dtra_numero} / ${doc.dtra_gestion || ""}`;

    // Clase de fila según estado
    const rowClassName = `
        hover:bg-gray-200 
        ${isBlocked ? 'bg-red-200 hover:bg-red-300' : 'bg-white'}
    `;

    // Definición de botones de acción
    const botones = [
        {
            key: 'destino',
            onClick: () => onCambiarDestino(doc.cod_dtra),
            title: 'Cambiar Destino del Trámite',
            label: doc.dtra_interno === 'f' ? 'EXT' : 'INT',
            className: doc.dtra_interno === 'f'
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-red-100 text-red-700 hover:bg-red-200',
        },
        {
            key: 'observar',
            onClick: () => onObserve(doc),
            icon: <Eye size={16} />,
            title: isBlocked ? 'Bloqueado' : isObserved ? 'Observado' : 'Observar',
            className: isObserved ? 'text-red-600 hover:text-red-800' : 'text-blue-500 hover:text-blue-700',
        },
        !isBlocked && {
            key: 'glosa',
            icon: <FilePenLine size={16} />,
            title: 'Generar Glosa (Modal)',
            className: 'text-gray-500 hover:text-gray-700',
        },
        !isBlocked && {
            key: 'pdf',
            icon: <FileCode size={16} />,
            title: 'Ver Documento PDF (Modal)',
            className: 'text-blue-600 hover:text-blue-800',
        },
        !isBlocked && {
            key: 'eliminar',
            onClick: () => onDelete(doc.cod_tra),
            icon: <Trash2 size={16} />,
            title: 'Eliminar Trámite',
            className: 'text-red-600 hover:text-red-800',
        }
    ].filter(Boolean);

    return (
        <tr className={rowClassName}>
            <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900">{index + 1}</td>
            <td className="px-2 py-1 whitespace-nowrap text-xs">
                {doc.dtra_verificacion_sitra==0
                    ? <CircleCheck size={16} className="text-green-500" title="Verificado SITRA" />
                    : <CircleMinus size={16} className="text-red-500" title="No Verificado SITRA" />}
            </td>
            <td className="px-2 py-1 text-xs text-gray-800 font-medium">{displayNombre}</td>
            <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-500">{numeroTramiteDisplay}</td>
            <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-500">{numeroTituloDisplay}</td>
            <td className="px-2 py-1 whitespace-nowrap text-xs space-x-1">
                {botones.map(btn => (
                    <button
                        key={btn.key}
                        onClick={btn.onClick}
                        title={btn.title}
                        className={`font-bold px-1 rounded text-xs transition duration-150 ${btn.className}`}
                    >
                        {btn.icon || btn.label}
                    </button>
                ))}
            </td>
        </tr>
    );
}

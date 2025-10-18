import React from 'react'
import {TRAMITE_COLORS} from '../Constants/tramiteDatos'

export default function TramiteActionButton({type, onClick}) 
{
    const colorConfig = TRAMITE_COLORS[type] || { base: 'bg-gray-400', hover: 'hover:bg-gray-500' };
    const { base, hover } = colorConfig;

    return (
    <button 
      // Usar las constantes importadas
      className={`flex items-center text-white font-semibold py-2 px-4 rounded shadow-md transition duration-150 ${base} ${hover}`}
      onClick={() => onClick(type)}
    >
      <span className="text-xl mr-2">+</span> 
      {type}
    </button>
    )
}

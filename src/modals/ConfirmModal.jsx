import React, { useEffect } from 'react';

export default function ConfirmModal({  
    onClose, 
    type, // Tipo de trámite (Legalizacion, Certificacion, etc.)
    tramiteNumber, // Número consecutivo
    date 
}) {
    // Cierre automático después de 2 segundos
    useEffect(() => {
        
            const timer = setTimeout(() => {
                onClose();
            }, 1000); // 2 segundos

            return () => clearTimeout(timer); // Limpiar timer al desmontar o cerrar
        
    }, [onClose]);

    // Formatear la fecha
    const formattedDate = date ? new Date(date).toLocaleDateString() : 'N/A';
    const title = `Nueva ${type}`;

    return (
        
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-0 overflow-hidden">
                
                {/* Header */}
                <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Cuerpo */}
                <div className="p-6 text-center">
                    <p className="text-gray-700 mb-4">Número de Trámite :</p>
                    
                    {/* Card de Número Grande */}
                    <div className=" p-4  shadow-2x1 mb-4">
                        <p className="text-5xl font-extrabold text-red-600 mb-2">{tramiteNumber}</p>
                        <p className="text-sm text-gray-600">{formattedDate}</p>
                    </div>

                    <button onClick={onClose} className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-6 rounded-md transition duration-200">
                        Cerrar
                    </button>
                </div>

            </div>
       
    );
}
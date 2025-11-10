import React from 'react';

/**
 * Componente LabeledInput genérico para formularios.
 */
const LabeledInput = ({ label, value, onChange, name, required, disabled }) => (
    <div className="flex items-center text-sm">
        <label className="text-gray-600 font-medium whitespace-nowrap text-right mr-2 flex-shrink-0 w-24">
            {label}
            {required && <span className="text-red-500">*</span>} {/* Mostrar asterisco si es requerido */}
        </label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full p-1 border rounded ${disabled ? 'bg-gray-100 text-gray-500 border-gray-200' : 'border-gray-300'}`}
            required={required} // Pasar atributo required
            disabled={disabled} // Pasar atributo disabled
        />
    </div>
);

export default LabeledInput;
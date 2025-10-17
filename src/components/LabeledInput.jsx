import React from 'react';

/**
 * Componente LabeledInput genérico para formularios.
 */
const LabeledInput = ({ label, value, onChange, name }) => (
    <div className="flex items-center text-sm">
        <label className="text-gray-600 font-medium whitespace-nowrap text-right mr-2 flex-shrink-0 w-24">{label}</label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className="w-full p-1 border border-gray-300 rounded"
        />
    </div>
);

export default LabeledInput;
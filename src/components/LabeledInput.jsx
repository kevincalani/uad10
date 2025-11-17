import React from "react";

/**
 * Componente Input con label y manejo de estado controlado.
 * Props:
 *  - label: texto del label
 *  - name: nombre del input
 *  - value: valor actual del input
 *  - onChange: función para actualizar el valor (handler del padre)
 *  - required: booleano, si es obligatorio
 *  - disabled: booleano, si está deshabilitado
 */
export default function LabeledInput({
    label,
    name,
    value,
    onChange,
    required = false,
    disabled = false,
}) {
    return (
        <div className="flex items-center text-sm">
            <label
                htmlFor={name}
                className="text-gray-700 font-medium whitespace-nowrap text-right mr-2 flex-shrink-0 w-24"
            >
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                id={name}
                type="text"
                name={name}
                value={value}
                onChange={onChange} // <-- el padre controla el estado
                disabled={disabled}
                required={required}
                className={`w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400
                    ${disabled ? "bg-gray-100 text-gray-500 border-gray-200" : "border-gray-300"}`}
            />
        </div>
    );
}

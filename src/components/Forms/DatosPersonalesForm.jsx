import React from "react";
import LabeledInput from "../LabeledInput"; // importa el componente

export default function DatosPersonalesForm({
    tramiteData,
    datosPersonales,
    handleDatosPersonalesChange,
    handleCiChange,
    onSave,
    isDatosPersonalesSaved,
    ptaang
}) {

    return (
        <div className="border border-gray-200 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                Datos Personales
                {isDatosPersonalesSaved && (
                    <span className="ml-2 text-xs font-bold text-green-600">(GUARDADO)</span>
                )}
            </h3>

            <div className="h-20 w-20 flex flex-col mb-3 text-center mx-auto border border-gray-200 rounded-lg shadow-sm">
                <p className="text-4xl font-bold text-red-600 mb-1">{tramiteData.tra_numero}</p>
                <p className="text-sm text-gray-600">{tramiteData.tra_fecha_solicitud}</p>
            </div>

            <form className="space-y-3 pb-3" onSubmit={(e) => e.preventDefault()}>
                <LabeledInput
                    label="CI:"
                    name="ci"
                    value={datosPersonales.ci}
                    onChange={handleCiChange}
                    required
                    disabled={isDatosPersonalesSaved}
                />
                <LabeledInput
                    label="Pasaporte:"
                    name="pasaporte"
                    value={datosPersonales.pasaporte}
                    onChange={handleDatosPersonalesChange}
                    disabled={isDatosPersonalesSaved}
                />
                <LabeledInput
                    label="Apellidos:"
                    name="apellidos"
                    value={datosPersonales.apellidos}
                    onChange={handleDatosPersonalesChange}
                    required
                    disabled={isDatosPersonalesSaved}
                />
                <LabeledInput
                    label="Nombres:"
                    name="nombres"
                    value={datosPersonales.nombres}
                    onChange={handleDatosPersonalesChange}
                    required
                    disabled={isDatosPersonalesSaved}
                />

                {!isDatosPersonalesSaved && (
                    <div className="flex justify-end pt-2">
                        <button
                            type="button"
                            onClick={onSave}
                            className="bg-green-500 text-white py-1 px-4 text-sm rounded font-medium hover:bg-green-600 transition"
                        >
                            Guardar
                        </button>
                    </div>
                )}
            </form>
            {ptaang && ptaang.length > 0 && (
                <div className="mt-2 bg-red-300 rounded-sm  px-2">
                    <ul className="list-disc ml-5 text-sm text-gray-700">
                        {ptaang.map((p, index) => (
                            <li key={index}>
                                Ya tiene DIPLOMA ACADEMICO Nº <b>{p.dtra_numero} / {p.dtra_gestion}</b> por PTAANG
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

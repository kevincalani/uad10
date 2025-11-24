import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import useDocleg from "../../hooks/useDocLeg";

export default function AddDocumentoForm({
    tramiteData,
    setIsAddDocumentoFormVisible,
    setDocumentos
}) {
    const { createDocumento, loading, error, success } = useDocleg();

    // Detectar tipo de trámite padre
    const esTipoB = tramiteData?.tra_tipo_tramite === "B";

    // Estado del formulario
    const [form, setForm] = useState({
        tipo: "",
        tipo_tramite: "EXTERNO",
        ptaang: false,
        cuadis: false,
        numero: "",
        gestion: "",
        supletorio: false,
        control: "",
        reintegro: "",
        valorado_bus: "",
        reimpresion: "",
        buscar_en: "",
        documentos: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append("ctra", tramiteData.cod_tra);

        // Campos comunes
        fd.append("tipo", form.tipo);
        fd.append("numero", form.numero);
        fd.append("gestion", form.gestion);
        fd.append("control", form.control);

        // Booleanos convertidos a formatos Laravel
        fd.append("ptaang", form.ptaang ? "t" : "f");
        fd.append("cuadis", form.cuadis ? "c" : "");
        fd.append("supletorio", form.supletorio ? "t" : "f");

        // Tipo de trámite interno/externo
        fd.append("tipo_tramite", form.tipo_tramite === "INTERNO");

        if (!esTipoB) {
            fd.append("reintegro", form.reintegro);
            fd.append("valorado_bus", form.valorado_bus);
            fd.append("reimpresion", form.reimpresion);
            fd.append("buscar_en", form.buscar_en);
        } else {
            fd.append("documentos", form.documentos);
            fd.append("buscar_en", form.buscar_en);
        }

        const result = await createDocumento(fd);

        if (result) {
            setDocumentos(prev => [...prev, result.data]);
            setIsAddDocumentoFormVisible(false);
        }
    };

    return (
        <div className="mt-4 p-4 border border-blue-300 rounded-lg bg-blue-50">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-700 text-center w-full">
                    {esTipoB ? "Añadir Documento (Tipo B)" : "Añadir Trámite"}
                </h4>

                <button
                    onClick={() => setIsAddDocumentoFormVisible(false)}
                    className="text-red-500 hover:text-red-700"
                >
                    <X size={18} />
                </button>
            </div>

            {/* ERRORES */}
            {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 p-2 rounded mb-3 text-sm">
                    {error}
                </div>
            )}

            {/* FORMULARIO */}
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">

                {/* TIPO DOCUMENTO */}
                <div>
                    <label className="block text-gray-600 font-medium">
                        Tipo de Legalización
                    </label>
                    <input
                        type="text"
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded"
                        required
                    />
                </div>

                {/* FORMULARIO PARA TRÁMITE TIPO B */}
                {esTipoB && (
                    <>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-gray-600">Nro. Documento</label>
                                <input
                                    type="text"
                                    name="numero"
                                    value={form.numero}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border rounded w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-600">Gestión</label>
                                <input
                                    type="number"
                                    name="gestion"
                                    value={form.gestion}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border rounded w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-600">Buscar en</label>
                            <input
                                type="text"
                                name="buscar_en"
                                value={form.buscar_en}
                                onChange={handleChange}
                                className="mt-1 p-2 border rounded w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600">Documentos de Confrontación</label>
                            <textarea
                                name="documentos"
                                value={form.documentos}
                                onChange={handleChange}
                                className="mt-1 p-2 border rounded w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600">Nro. de Control</label>
                            <input
                                type="text"
                                name="control"
                                value={form.control}
                                onChange={handleChange}
                                className="mt-1 p-2 border rounded w-full"
                                required
                            />
                        </div>
                    </>
                )}

                {/* FORMULARIO PARA TRÁMITES ≠ B */}
                {!esTipoB && (
                    <>
                        {/* Tipo de trámite */}
                        <div className="flex items-center space-x-4">
                            <label className="font-medium text-gray-600 w-32">Tipo Trámite:</label>

                            <label className="flex items-center space-x-1">
                                <input
                                    type="radio"
                                    name="tipo_tramite"
                                    value="EXTERNO"
                                    checked={form.tipo_tramite === "EXTERNO"}
                                    onChange={handleChange}
                                />
                                <span>EXTERNO</span>
                            </label>

                            <label className="flex items-center space-x-1">
                                <input
                                    type="radio"
                                    name="tipo_tramite"
                                    value="INTERNO"
                                    checked={form.tipo_tramite === "INTERNO"}
                                    onChange={handleChange}
                                />
                                <span>INTERNO</span>
                            </label>
                        </div>

                        {/* PTANG / CUADIS / SUPLETORIO */}
                        <div className="flex items-center space-x-6">
                            <label className="flex items-center space-x-1">
                                <input
                                    type="checkbox"
                                    name="ptaang"
                                    checked={form.ptaang}
                                    onChange={handleChange}
                                />
                                <span>PTAANG</span>
                            </label>

                            <label className="flex items-center space-x-1">
                                <input
                                    type="checkbox"
                                    name="cuadis"
                                    checked={form.cuadis}
                                    onChange={handleChange}
                                />
                                <span>CUADIS</span>
                            </label>

                            <label className="flex items-center space-x-1">
                                <input
                                    type="checkbox"
                                    name="supletorio"
                                    checked={form.supletorio}
                                    onChange={handleChange}
                                />
                                <span>Supletorio</span>
                            </label>
                        </div>

                        {/* Numero / Gestión */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-gray-600">Número</label>
                                <input
                                    type="text"
                                    name="numero"
                                    value={form.numero}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border rounded w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-600">Gestión</label>
                                <input
                                    type="text"
                                    name="gestion"
                                    value={form.gestion}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border rounded w-full"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-gray-600">Reintegro</label>
                                <input
                                    type="text"
                                    name="reintegro"
                                    value={form.reintegro}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border rounded w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-600">Ctrl. Búsqueda</label>
                                <input
                                    type="text"
                                    name="valorado_bus"
                                    value={form.valorado_bus}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border rounded w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-600">Reimpresión</label>
                                <input
                                    type="text"
                                    name="reimpresion"
                                    value={form.reimpresion}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border rounded w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-600">Buscar en</label>
                            <input
                                type="text"
                                name="buscar_en"
                                value={form.buscar_en}
                                onChange={handleChange}
                                className="mt-1 p-2 border rounded w-full"
                            />
                        </div>
                    </>
                )}

                {/* BOTÓN SUBMIT */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-5 py-2 rounded text-white ${
                            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                        {loading ? "Guardando…" : "+ Agregar"}
                    </button>
                </div>
            </form>
        </div>
    );
}

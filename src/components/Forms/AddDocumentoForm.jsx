import React, { useState } from "react";
import { Plus, XCircle } from "lucide-react";
import { toast } from "../../utils/toast";
import api from "../../api/axios";

export default function AddDocumentoForm({ 
  tramiteData,
  listaTramites, 
  setIsAddDocumentoFormVisible, 
  setDocumentos 
}) {
  // Detectar si es trámite de Búsqueda (Tipo B)
  const esTipoB = tramiteData?.tra_tipo_tramite === 'B';

  const [formData, setFormData] = useState({
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
    buscar_en: "DB",
    documentos: ""
  });

  const [loading, setLoading] = useState(false);

  const opcionesBuscarEn = [
    { value: 'DB', label: 'DB' },
    { value: 'CR', label: 'CR' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("ctra", tramiteData.tramite.cod_tra);
      fd.append("tipo", formData.tipo);
      fd.append("numero", formData.numero || "-");
      fd.append("gestion", formData.gestion || new Date().getFullYear().toString().slice(-2));
      fd.append("control", formData.control);
      fd.append("ptaang", formData.ptaang ? "on" : "");
      fd.append("cuadis", formData.cuadis ? "on" : "");
      fd.append("supletorio", formData.supletorio ? "on" : "");
      fd.append("tipo_tramite", formData.tipo_tramite === 'INTERNO' ? 't' : 'f');

      if (!esTipoB) {
        fd.append("reintegro", formData.reintegro);
        fd.append("valorado_bus", formData.valorado_bus);
        fd.append("reimpresion", formData.reimpresion);
      } else {
        fd.append("reimpresion", formData.reimpresion);
        fd.append("buscar_en", formData.buscar_en);
        fd.append("documentos", formData.documentos);
      }

      const res = await api.post('/api/g-docleg', fd);

      if (res.data.status === 'success') {
        toast.success("Documento añadido correctamente");
        setDocumentos(prev => [...prev, res.data.data]);
        setIsAddDocumentoFormVisible(false);
      } else {
        toast.error(res.data.message || "Error al registrar");
      }

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // --- ESTILOS AJUSTADOS ---
  // w-28 (112px) fuerza a que los textos largos hagan salto de línea.
  // leading-tight junta las líneas verticalmente.
  const labelClass = "text-right font-bold text-gray-600 italic text-sm leading-tight pr-2 w-28 flex-shrink-0 self-center";
  const inputClass = "border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400 w-full";

  return (
    <div className="relative bg-white p-4 rounded-lg shadow-md border border-gray-200 animate-fadeIn">
      {/* Botón cerrar */}
      <button 
        onClick={() => setIsAddDocumentoFormVisible(false)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        <XCircle size={18} />
      </button>

      {/* Título */}
      <div className="flex justify-center mb-4">
        <div className="bg-blue-100 text-gray-700 font-bold text-center py-1.5 px-8 rounded shadow-sm border border-blue-200 text-sm">
          {esTipoB ? "Añadir documento para Búsqueda" : "Añadir documento"}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-1">
        
        {/* FILA 1: Selector de Trámite */}
        <div className="flex items-center mb-2">
          <label className={labelClass}>
            {esTipoB ? "Trámite :" : "Tipo de legalización :"}
          </label>
          <div className="flex items-center w-full pb-2 border-b border-gray-300">
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className={`${inputClass} bg-white`}
            required
          >
            {listaTramites.map((t) => (
              <option key={t.cod_tre} value={t.cod_tre}>
                {t.tre_nombre}
              </option>
            ))}
          </select>
          </div>
        </div>

        {esTipoB ? (
          /* --- FORMULARIO BÚSQUEDA --- */
          <>
            {/* Fila Control y Reimpresión */}
            <div className="flex items-center mb-2">
              {/* Lado Izquierdo */}
                <label className={labelClass}>Nº control valorado:</label>
                <div className="flex items-center w-full pb-2  ">
                <input
                  type="text"
                  name="control"
                  value={formData.control}
                  onChange={handleChange}
                  className={inputClass}
                />
              {/* Lado Derecho */}
                <label className={labelClass}>Nro. control Reimpresión :</label>
                <input
                  type="text"
                  name="reimpresion"
                  value={formData.reimpresion}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex items-center mb-2 ">
               <div className="w-28 flex-shrink-0 "></div> {/* Espaciador para alinear con labels */}
               <label className="flex items-center text-xs font-semibold text-gray-600 w-full pb-2 border-b border-gray-300 ">
                  CUADIS :
                  <input type="checkbox" name="cuadis" checked={formData.cuadis} onChange={handleChange} className="ml-2 h-4 w-4"/>
               </label>
            </div>

            <div className="flex items-center mb-2">
              <label className={labelClass}>Nro. Título:</label>
              <div className="flex items-center gap-2 w-full pb-2 border-b border-gray-300">
                <input name="numero" value={formData.numero} onChange={handleChange} className={`${inputClass} !w-24`} />
                <span className="font-bold text-gray-500">/</span>
                <input name="gestion" value={formData.gestion} onChange={handleChange} className={`${inputClass} !w-24`} />
                <span className="text-gray-400 text-xs whitespace-nowrap">(e.j. 1999)</span>
              </div>
            </div>

            <div className="flex items-center mb-2">
              <label className={labelClass}>Buscar en :</label>
              <div className="flex items-center w-full pb-2 border-b border-gray-300">
              <select name="buscar_en" value={formData.buscar_en} onChange={handleChange} className={inputClass}>
                {opcionesBuscarEn.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              </div>
            </div>

            <div className="flex items-start mb-2">
              <label className={`${labelClass} mt-1`}>Documentos :</label>
              <textarea name="documentos" value={formData.documentos} onChange={handleChange} rows="3" className={`${inputClass} resize-y`} />
            </div>
          </>
        ) : (
          /* --- FORMULARIO ESTÁNDAR --- */
          <>
            {/* FILA 2: Tipo Trámite | PTAG | CUADIS */}
            <div className="flex items-center mb-2 overflow-hidden">
              <label className={labelClass}>Tipo de trámite :</label>
              
              <div className="flex items-center flex-1 gap-2 text-xs sm:text-sm pb-2 border-b border-gray-300">
                <label className="flex items-center cursor-pointer text-gray-600 uppercase text-xs">
                  <input type="radio" name="tipo_tramite" value="EXTERNO" checked={formData.tipo_tramite === 'EXTERNO'} onChange={handleChange} className="mr-1" />
                  EXTERNO
                </label>
                <label className="flex items-center cursor-pointer text-gray-600 uppercase ml-2 text-xs">
                  <input type="radio" name="tipo_tramite" value="INTERNO" checked={formData.tipo_tramite === 'INTERNO'} onChange={handleChange} className="mr-1" />
                  INTERNO
                </label>

                {/* Separador Rojo */}
                <div className="h-4 w-[2px] bg-red-500 mx-1"></div>

                <label className="flex items-center cursor-pointer font-bold italic text-gray-700">
                  PTAG :
                  <input type="checkbox" name="ptaang" checked={formData.ptaang} onChange={handleChange} className="ml-1 h-4 w-4 border-gray-300" />
                </label>

                <label className="flex items-center cursor-pointer font-bold italic text-gray-700 ml-2">
                  CUADIS :
                  <input type="checkbox" name="cuadis" checked={formData.cuadis} onChange={handleChange} className="ml-1 h-4 w-4 border-gray-300" />
                </label>
              </div>
            </div>

            {/* FILA 3: Nro Título | Supletorio */}
            <div className="flex items-center mb-2">
              <label className={labelClass}>Nro. Título o Resolución:</label>
              
              <div className="flex items-center w-full pb-2 border-b border-gray-300">
                {/* Inputs pequeños */}
                <input name="numero" value={formData.numero} onChange={handleChange} className={`${inputClass} !w-20`} />
                <span className="mx-1 font-bold text-gray-500">/</span>
                <input name="gestion" value={formData.gestion} onChange={handleChange} className={`${inputClass} !w-20`} />
                
                <span className="text-gray-400 text-xs mx-2 whitespace-nowrap hidden sm:inline">(e.j. 1999)</span>

                {/* Supletorio alineado a la derecha o pegado */}
                <label className="flex items-center cursor-pointer text-xs font-bold text-gray-700 ml-auto sm:ml-2">
                  Supletorio :
                  <input type="checkbox" name="supletorio" checked={formData.supletorio} onChange={handleChange} className="ml-1 h-4 w-4 border-gray-300" />
                </label>
              </div>
            </div>

            {/* FILA 4: Nro. Control | Reintegro */}
            <div className="flex items-center mb-2 ">
              {/* Parte Izquierda: Control */}
              <label className={labelClass}>Nro. Control:</label>
              <div className="flex items-center w-full pb-2 border-b border-gray-300">
              <input 
                type="text" 
                name="control" 
                value={formData.control} 
                onChange={handleChange} 
                className={`${inputClass} flex-1`} // Ocupa espacio disponible
              />

              {/* Parte Derecha: Reintegro */}
              {/* Etiqueta azul itálica */}
              <label className="text-blue-600 font-bold italic text-xs ml-2 mr-1 whitespace-nowrap">Reintegro :</label>
              <input 
                type="text" 
                name="reintegro" 
                value={formData.reintegro} 
                onChange={handleChange} 
                className="border border-blue-300 rounded px-2 py-1 text-sm w-24 focus:outline-none focus:border-blue-500" 
              />
              </div>
            </div>

            {/* FILA 5: Control Búsqueda | Reimpresión */}
            <div className="flex items-start mb-2">
              {/* Parte Izquierda */}   
                <label className={labelClass}>
                  N° control Búsqueda:
                </label>
                <div className="flex items-center w-full pb-2 border-b border-gray-300">
                <input
                  type="text"
                  name="valorado_bus"
                  value={formData.valorado_bus}
                  onChange={handleChange}
                  className={inputClass}
                />

              {/* Parte Derecha */}
                <label className={labelClass}>
                  Nro. control Reimpresión :
                </label>
                <input
                  type="text"
                  name="reimpresion"
                  value={formData.reimpresion}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </>
        )}

        {/* Footer Botón */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-6 rounded shadow flex items-center gap-2 transition-colors text-sm disabled:opacity-50"
          >
            {loading ? "Guardando..." : <><Plus size={16} /> Crear</>}
          </button>
        </div>

      </form>
    </div>
  );
}
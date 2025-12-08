import React, { useState, useEffect } from "react";
import { X, HandCoins, UserCheck, AlertCircle } from "lucide-react";
import { useNoAtentado } from "../../../hooks/useNoAtentados";

export default function EntregaNoAtentadoModal({
  onClose,
  cod_dtra,
  onSuccess,
}) {
  const { loading, obtenerDatosEntrega, guardarApoderado, registrarEntrega } =
    useNoAtentado();

  const [datos, setDatos] = useState(null);
  const [mostrarEditarApoderado, setMostrarEditarApoderado] = useState(false);
  const [personaSeleccionada, setPersonaSeleccionada] = useState("");

  const [formApoderado, setFormApoderado] = useState({
    ci: "",
    apellido: "",
    nombre: "",
    tipo: "d",
  });

  useEffect(() => {
    cargarDatos();
  }, [cod_dtra]);

  const cargarDatos = async () => {
    const data = await obtenerDatosEntrega(cod_dtra);
    if (data) {
      setDatos(data);

      // Si hay apoderado, seleccionarlo por defecto
      if (data.apoderado) {
        setPersonaSeleccionada("a");
        setFormApoderado({
          ci: data.apoderado.apo_ci || "",
          apellido: data.apoderado.apo_apellido || "",
          nombre: data.apoderado.apo_nombre || "",
          tipo: data.tramite_noatentado.dtra_tipo_apoderado || "d",
        });
      }
    }
  };

  const handleChangeApoderado = (e) => {
    const { name, value } = e.target;
    setFormApoderado((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardarApoderado = async () => {
    if (!formApoderado.ci || !formApoderado.apellido || !formApoderado.nombre) {
      return;
    }

    const payload = {
      cdtra: cod_dtra,
      ci: formApoderado.ci,
      apellido: formApoderado.apellido,
      nombre: formApoderado.nombre,
      tipo: formApoderado.tipo,
    };

    const result = await guardarApoderado(payload);
    if (result) {
      await cargarDatos();
      setMostrarEditarApoderado(false);
    }
  };

  const handleRegistrarEntrega = async () => {
    if (!personaSeleccionada) {
      return;
    }

    const payload = {
      cdtra: cod_dtra,
      tipo: personaSeleccionada,
    };

    const result = await registrarEntrega(payload);
    if (result) {
      onSuccess && onSuccess();
      onClose();
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";

    const [year, month, day] = fecha.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    return date.toLocaleDateString("es-BO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (!datos) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  const { tramite_noatentado, convocatoria, noatentados, apoderado } = datos;
  const yaEntregado =
    tramite_noatentado.dtra_entregado === "t" ||
    tramite_noatentado.dtra_entregado === "a";

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto my-4">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <HandCoins size={24} />
          <h2 className="text-xl font-bold">Entrega - TRAMITE CONVOCATORIA</h2>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-green-700 rounded-full p-1 transition"
        >
          <X size={24} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Título */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-sm px-4 py-2 mb-6 w-fit mx-auto">
          <h4 className="text-center font-bold text-blue-800">Convocatoria</h4>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div className="space-y-6">
            {/* Número de trámite */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600">
                  {tramite_noatentado.dtra_numero_tramite}
                </h1>
                <span className="text-sm text-gray-600 italic">
                  {formatearFecha(tramite_noatentado.dtra_fecha_registro)}
                </span>
              </div>
            </div>

            {/* Datos de convocatoria */}
            <div>
              <p className="text-blue-600 font-bold italic mb-3 text-sm">
                * Datos de la convocatoria
              </p>
              <table className="w-full text-sm">
                <tbody className="space-y-2">
                  <tr className="border-b border-gray-300">
                    <th className="text-right pr-4 py-2 font-semibold text-gray-700">
                      Convocatoria:
                    </th>
                    <td className="text-left pl-4 py-2 text-gray-600 italic font-semibold">
                      {convocatoria?.con_nombre}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <th className="text-right pr-4 py-2 font-semibold text-gray-700">
                      Trámite:
                    </th>
                    <td className="text-left pl-4 py-2 font-semibold">
                      {tramite_noatentado.tre_nombre}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <th className="text-right pr-4 py-2 font-semibold text-gray-700">
                      Tipo de trámite:
                    </th>
                    <td className="text-left pl-4 py-2">
                      {tramite_noatentado.dtra_interno === "t" ? (
                        <span className="text-red-600 font-bold">INTERNO</span>
                      ) : (
                        <span className="text-blue-600 font-bold">EXTERNO</span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <th className="text-right pr-4 py-2 font-semibold text-gray-700">
                      Nro. Control:
                    </th>
                    <td className="text-left pl-4 py-2">
                      <span>{tramite_noatentado.dtra_control}</span>
                      {tramite_noatentado.dtra_valorado_reintegro && (
                        <span className="ml-4">
                          <span className="text-blue-600 font-semibold italic">
                            Nro. Control Reintegro:
                          </span>{" "}
                          {tramite_noatentado.dtra_valorado_reintegro}
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Datos del apoderado */}
            <div>
              {!mostrarEditarApoderado ? (
                <div>
                  <p className="text-blue-600 font-bold italic mb-3 text-sm">
                    * Datos del apoderado
                  </p>
                  {apoderado ? (
                    <table className="w-full text-sm">
                      <tbody className="space-y-2">
                        <tr className="border-b border-gray-300">
                          <th className="text-right pr-4 py-2 font-semibold text-gray-700">
                            CI:
                          </th>
                          <td className="text-left pl-4 py-2">
                            {apoderado.apo_ci}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-300">
                          <th className="text-right pr-4 py-2 font-semibold text-gray-700 italic">
                            Nombre apoderado:
                          </th>
                          <td className="text-left pl-4 py-2">
                            {apoderado.apo_apellido} {apoderado.apo_nombre}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-300">
                          <th className="text-right pr-4 py-2 font-semibold text-gray-700">
                            Tipo de apoderado:
                          </th>
                          <td className="text-left pl-4 py-2 text-blue-600 font-semibold">
                            {tramite_noatentado.dtra_tipo_apoderado === "d" &&
                              "Declaración jurada"}
                            {tramite_noatentado.dtra_tipo_apoderado === "p" &&
                              "Poder notariado"}
                            {tramite_noatentado.dtra_tipo_apoderado === "c" &&
                              "Carta de representación"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-500 italic text-sm">
                      Sin apoderado registrado
                    </p>
                  )}
                  <button
                    onClick={() => setMostrarEditarApoderado(true)}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition float-right"
                  >
                    Editar datos del Apoderado
                  </button>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
                  <button
                    onClick={() => setMostrarEditarApoderado(false)}
                    className="float-right text-red-600 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                  <p className="text-blue-600 font-bold italic mb-4 text-sm">
                    * Editar datos del apoderado
                  </p>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 items-center border-b pb-2">
                      <label className="text-right font-medium text-gray-700 italic text-sm">
                        CI:
                      </label>
                      <div className="col-span-2">
                        <input
                          type="text"
                          name="ci"
                          value={formApoderado.ci}
                          onChange={handleChangeApoderado}
                          className="w-full px-3 py-2 border-0 text-sm focus:outline-none focus:ring-0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center border-b pb-2">
                      <label className="text-right font-medium text-gray-700 italic text-sm">
                        Apellidos:
                      </label>
                      <div className="col-span-2">
                        <input
                          type="text"
                          name="apellido"
                          value={formApoderado.apellido}
                          onChange={handleChangeApoderado}
                          className="w-full px-3 py-2 border-0 text-sm focus:outline-none focus:ring-0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center border-b pb-2">
                      <label className="text-right font-medium text-gray-700 italic text-sm">
                        Nombres:
                      </label>
                      <div className="col-span-2">
                        <input
                          type="text"
                          name="nombre"
                          value={formApoderado.nombre}
                          onChange={handleChangeApoderado}
                          className="w-full px-3 py-2 border-0 text-sm focus:outline-none focus:ring-0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-start border-b pb-2">
                      <label className="text-right font-medium text-gray-700 italic text-sm pt-2">
                        Tipo de apoderado:
                      </label>
                      <div className="col-span-2 space-y-2">
                        <label className="flex items-center text-sm">
                          <input
                            type="radio"
                            name="tipo"
                            value="d"
                            checked={formApoderado.tipo === "d"}
                            onChange={handleChangeApoderado}
                            className="mr-2"
                          />
                          Declaración jurada
                        </label>
                        <label className="flex items-center text-sm">
                          <input
                            type="radio"
                            name="tipo"
                            value="p"
                            checked={formApoderado.tipo === "p"}
                            onChange={handleChangeApoderado}
                            className="mr-2"
                          />
                          Poder notariado
                        </label>
                        <label className="flex items-center text-sm">
                          <input
                            type="radio"
                            name="tipo"
                            value="c"
                            checked={formApoderado.tipo === "c"}
                            onChange={handleChangeApoderado}
                            className="mr-2"
                          />
                          Carta de representación
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleGuardarApoderado}
                    disabled={loading}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition float-right disabled:opacity-50"
                  >
                    {loading ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            {/* Lista de candidatos */}
            <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
              <p className="font-bold text-blue-600 italic mb-3 text-sm">
                * Lista de candidatos
              </p>
              <div className="overflow-auto max-h-64 border rounded">
                <table className="w-full text-xs">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="border px-2 py-1 text-left">N°</th>
                      <th className="border px-2 py-1 text-left">Nombre</th>
                      <th className="border px-2 py-1 text-left">CI</th>
                      <th className="border px-2 py-1 text-left">COD SIS</th>
                      <th className="border px-2 py-1 text-left">Cargo</th>
                      <th className="border px-2 py-1 text-left">Unidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {noatentados.map((n, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border px-2 py-1">{idx + 1}</td>
                        <td className="border px-2 py-1">
                          {n.per_nombre} {n.per_apellido}
                        </td>
                        <td className="border px-2 py-1">{n.per_ci}</td>
                        <td className="border px-2 py-1">{n.per_cod_sis}</td>
                        <td className="border px-2 py-1">{n.carg_nombre}</td>
                        <td className="border px-2 py-1">{n.noa_unidad}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Datos del trámite y entrega */}
            <div>
              <p className="text-blue-600 italic font-bold mb-3 text-sm">
                * Datos del trámite
              </p>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-500 text-white">
                    <tr>
                      <th className="px-3 py-2 text-left">Nº</th>
                      <th className="px-3 py-2 text-left">Nombre</th>
                      <th className="px-3 py-2 text-center">Entregar</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-50">
                    <tr>
                      <td className="px-3 py-3 border-b">1</td>
                      <td className="px-3 py-3 border-b">
                        <div>
                          <p className="font-semibold">
                            {tramite_noatentado.tre_nombre}
                          </p>
                          <div className="text-xs text-gray-600 mt-1 space-x-2">
                            {tramite_noatentado.dtra_interno === "t" && (
                              <span>
                                <span className="font-semibold">Trámite:</span>{" "}
                                <span className="text-red-600 font-bold">
                                  Interno
                                </span>
                              </span>
                            )}
                            <span>
                              <span className="font-semibold">Valorado:</span>{" "}
                              {tramite_noatentado.dtra_control}
                            </span>
                            {yaEntregado && (
                              <span>
                                <span className="font-semibold">
                                  Fecha entrega:
                                </span>{" "}
                                <span className="text-blue-600 font-bold">
                                  {new Date(
                                    tramite_noatentado.dtra_fecha_recojo
                                  ).toLocaleString("es-BO")}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center border-b">
                        {yaEntregado ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-green-600">
                              <UserCheck size={24} />
                            </span>
                            {tramite_noatentado.dtra_entregado === "a" && (
                              <span className="text-xs font-bold text-green-600 italic">
                                Apoderado
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            Pendiente
                          </span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Formulario de entrega */}
              {!yaEntregado && (
                <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <p className="font-semibold text-sm mb-3">Entregar a:</p>
                  <div className="space-y-2">
                    {noatentados.map((candidato) => (
                      <label
                        key={candidato.id_per}
                        className="flex items-center text-sm"
                      >
                        <input
                          type="radio"
                          name="persona"
                          value={candidato.id_per}
                          checked={
                            personaSeleccionada === candidato.id_per.toString()
                          }
                          onChange={(e) =>
                            setPersonaSeleccionada(e.target.value)
                          }
                          className="mr-2"
                        />
                        {candidato.per_apellido} {candidato.per_nombre}
                      </label>
                    ))}
                    {apoderado && (
                      <label className="flex items-center text-sm">
                        <input
                          type="radio"
                          name="persona"
                          value="a"
                          checked={personaSeleccionada === "a"}
                          onChange={(e) =>
                            setPersonaSeleccionada(e.target.value)
                          }
                          className="mr-2"
                        />
                        {apoderado.apo_apellido} {apoderado.apo_nombre}
                        <span className="ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                          Apo
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              )}

              {/* Advertencia */}
              {!yaEntregado && (
                <div className="mt-4 p-3 border border-red-500 rounded bg-red-50 flex items-start gap-2">
                  <AlertCircle
                    size={16}
                    className="text-red-600 mt-0.5 flex-shrink-0"
                  />
                  <div className="text-xs text-red-700 italic font-medium">
                    <p>* Esta acción se quedará registrada en el sistema</p>
                    <p>
                      * Si hace la entrega de este trámite, ya no se podrá
                      modificar su estado
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3 border-t sticky bottom-0">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition disabled:opacity-50"
        >
          Cerrar
        </button>
        {!yaEntregado && (
          <button
            onClick={handleRegistrarEntrega}
            disabled={loading || !personaSeleccionada}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            <HandCoins size={18} />
            {loading ? "Guardando..." : "Guardar"}
          </button>
        )}
      </div>
    </div>
  );
}

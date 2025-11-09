import React, { useState } from "react";
import api from "../../api/axios";
import { toast } from "../../utils/toast";

const cargos = [
  "JEFA",
  "ASISTENTE DE JEFATURA",
  "RESPONSABLE INFORMATICO UAD",
  "RESPONSABLE DE LEGALIZACION",
  "RESPONSABLE DE APOSTILLA",
  "RESPONSABLE DE TRAMITES",
  "RESPONSABLE DE ATENCION AL CLIENTE",
  "ASISTENTE INFORMATICO UAD",
  "ENCARGADO DE SISTEMATIZACION",
  "ENCARGADO DE DIGITALIZACION",
  "ENCARGADO DE ARCHIVO HISTORICO",
  "ENCARGADO DE ARCHIVO ACADEMICO",
  "BECARIO IDH",
  "AUXILIAR",
  "ADSCRITO",
  "PRACTICANTE",
];

export default function EditarDatosPersonales({ usuario, onUpdateUsuario }) {
  const [formData, setFormData] = useState({
    id: usuario?.id || "",
    nombre: usuario?.nombre || usuario?.name || "",
    ci: usuario?.ci || "",
    sexo: usuario?.sexo || "",
    login: usuario?.email || "",
    cargo: usuario?.cargo || "",
    rol: usuario?.rol || "",
    contacto: usuario?.contacto || "",
    direccion: usuario?.direccion || "",
    pas: "",
    repas: "",
    foto1: null,
    preview: usuario?.foto
      ? `http://localhost:8000/img/foto/${usuario.foto}`
      : null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        foto1: file,
        preview: URL.createObjectURL(file),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Validaciones
    const requiredFields = ["nombre", "ci", "sexo", "login", "cargo", "rol"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`El campo "${field}" es obligatorio.`);
        return;
      }
    }

    if (formData.pas && formData.pas !== formData.repas) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          data.append(key, value);
        }
      });

      // ✅ El mismo endpoint sirve para crear o editar
      const response = await api.post("/api/usuarios/guardar", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Datos actualizados correctamente");

      if (onUpdateUsuario) {
           // 💡 Modificación clave: Preparamos los datos a actualizar en el padre
           const updatedData = {
        // Usamos 'nombre' como 'name' para consistencia con el componente padre
             name: formData.nombre, 
             ci: formData.ci,
             sexo: formData.sexo,
             cargo: formData.cargo,
             rol: formData.rol,
             contacto: formData.contacto,
             direccion: formData.direccion,
        // Si Laravel devuelve el nombre del archivo de la foto, lo incluimos. 
        // Si no lo devuelve, usamos el preview si se acaba de subir una foto.
        foto: response.data.usuario?.foto || (formData.foto1 ? response.data.usuario?.foto : usuario.foto), 
           };
           // Llamamos a la función del padre para actualizar el estado central del usuario
         onUpdateUsuario(updatedData);
     }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Error al actualizar el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-1">
      <div className="bg-blue-600 text-white text-center py-2 rounded-md mb-6 shadow">
        <h2 className="text-lg font-semibold">Editar datos del usuario</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-[2.3fr_1fr] gap-8">
          {/* Columna izquierda */}
          <div className="grid grid-cols-[140px_1.8fr] gap-x-2 gap-y-2 text-sm">
            <label className="text-right font-semibold text-gray-700 self-center">
              Apellidos y Nombres:
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="border border-gray-400 rounded px-2 py-1 w-full"
            />

            <label className="text-right font-semibold text-gray-700 self-center">
              Cédula de Identidad:
            </label>
            <input
              type="text"
              name="ci"
              value={formData.ci}
              onChange={handleChange}
              className="border border-gray-400 rounded px-2 py-1 w-full"
            />

            <label className="text-right font-semibold text-gray-700 self-center">
              Sexo:
            </label>
            <select
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              className="border border-gray-400 rounded px-2 py-1 w-full"
            >
              <option value="">Seleccione...</option>
              <option value="MASCULINO">MASCULINO</option>
              <option value="FEMENINO">FEMENINO</option>
            </select>

            <label className="text-right font-semibold text-gray-700 self-center">
              Login:
            </label>
            <input
              type="email"
              name="login"
              value={formData.login}
              onChange={handleChange}
              className="border border-gray-400 rounded px-2 py-1 w-full"
            />

            <label className="text-right font-semibold text-gray-700 self-center">
              Cargo:
            </label>
            <select
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              className="border border-gray-400 rounded px-2 py-1 w-full"
            >
              <option value="">Seleccione...</option>
              {cargos.map((cargo) => (
                <option key={cargo} value={cargo}>
                  {cargo}
                </option>
              ))}
            </select>

            <label className="text-right font-semibold text-gray-700 self-center">
              Rol:
            </label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="border border-gray-400 rounded px-2 py-1 w-full"
            >
              <option value="">Seleccione...</option>
              <option value="ADMINISTRADOR">ADMINISTRADOR</option>
              <option value="FUNCIONARIO">FUNCIONARIO</option>
            </select>

            <label className="text-right font-semibold text-gray-700 self-start pt-1">
              Contacto:
            </label>
            <textarea
              name="contacto"
              rows={2}
              value={formData.contacto}
              onChange={handleChange}
              className="border border-gray-400 rounded px-2 py-1 resize-none w-full"
            />

            <label className="text-right font-semibold text-gray-700 self-start pt-1">
              Dirección:
            </label>
            <textarea
              name="direccion"
              rows={2}
              value={formData.direccion}
              onChange={handleChange}
              className="border border-gray-400 rounded px-2 py-1 resize-none w-full"
            />
          </div>

          {/* Columna derecha */}
          <div className="space-y-4 text-sm">
            <div>
              <label className="text-red-600 font-semibold block mb-1">
                PASSWORD:
              </label>
              <input
                type="password"
                name="pas"
                value={formData.pas}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded px-2 py-1"
              />
            </div>

            <div>
              <label className="text-red-600 font-semibold block mb-1">
                RE-PASSWORD:
              </label>
              <input
                type="password"
                name="repas"
                value={formData.repas}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded px-2 py-1"
              />
            </div>

            <div className="mt-6">
              <label className="block font-semibold text-gray-700 mb-1">
                Foto:
              </label>
              <label className="border border-gray-500 rounded-md px-2 py-1 bg-gray-50 hover:bg-gray-100 cursor-pointer inline-block">
                Selecciona
                <input
                  type="file"
                  name="foto1"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>

              {formData.preview && (
                <div className="mt-3 flex justify-center">
                  <img
                    src={formData.preview}
                    alt="Foto del usuario"
                    className="w-28 h-28 object-cover rounded-full border-2 border-gray-300 shadow"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}

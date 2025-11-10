import React, { useState, useEffect } from "react";
import { UserCircle2 } from "lucide-react";

const cargos = [
  "JEFA", "ASISTENTE DE JEFATURA", "RESPONSABLE INFORMATICO UAD",
  "RESPONSABLE DE LAGALIZACION", "RESPONSABLE DE APOSTILLA",
  "RESPONSABLE DE TRAMITES", "RESPONSABLE DE ATENCION AL CLIENTE",
  "ASISTENTE INFORMATICO UAD", "ENCARGADO DE SISTEMATIZACION",
  "ENCARGADO DE DIGITALIZACION", "ENCARGADO DE ARCHIVO HISTORICO",
  "ENCARGADO DE ARCHIVO ACADEMICO", "BECARIO IDH", "AUXILIAR",
  "ADSCRITO", "PRACTICANTE",
];
const roles = ["FUNCIONARIO", "ADMINISTRADOR"];
const sexos = [
  { label: "Masculino", value: "M" },
  { label: "Femenino", value: "F" },
];

export default function NuevoUsuarioForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    nombre: "",
    ci: "",
    sexo: "",
    login: "",
    cargo: "",
    rol: "",
    contacto: "",
    direccion: "",
    foto: null,
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);

  const requiredFields = ["nombre", "ci", "sexo", "login", "cargo", "rol"];

  useEffect(() => {
    onSubmit && onSubmit(formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Actualiza el campo
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Limpia el error si el usuario corrige el campo
    if (requiredFields.includes(name) && value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Función de validación (puede ser llamada desde el modal)
  const validateFields = () => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = "Campo obligatorio";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Exponer validación (para que el modal pueda usarla)
  useEffect(() => {
    formData.validate = validateFields;
    onSubmit && onSubmit(formData);
  }, [formData]);

  return (
    <form className="text-sm text-gray-700 max-h-[75vh] overflow-y-auto px-4 pb-3">
      {/* Encabezado */}
      <div className="bg-blue-700 text-center justify-self-center w-64 text-white font-semibold py-2 rounded mb-4 shadow-sm mx-auto">
        Formulario para nuevo usuario
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* COLUMNA IZQUIERDA */}
        <div className="col-span-2 space-y-2">
          {[
            ["nombre", "Apellidos y Nombres:"],
            ["ci", "Cédula de Identidad:"],
            ["sexo", "Sexo:"],
            ["login", "Login (Email):"],
            ["cargo", "Cargo:"],
            ["rol", "Rol:"],
            ["contacto", "Contacto:"],
            ["direccion", "Dirección:"],
          ].map(([name, label]) => (
            <div key={name} className="grid grid-cols-3 items-start gap-2">
              <label
                htmlFor={name}
                className="text-gray-800 font-semibold text-right pt-1"
              >
                {label}
              </label>

              <div className="col-span-2">
                {name === "sexo" ? (
                  <select
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleChange}
                    className={`border rounded w-full p-1.5 text-sm focus:ring-blue-400 focus:border-blue-400 ${
                      errors.sexo ? "border-red-500" : "border-gray-500"
                    }`}
                  >
                    <option value="">Seleccionar...</option>
                    {sexos.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                ) : name === "cargo" ? (
                  <select
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleChange}
                    className={`border rounded w-full p-1.5 text-sm focus:ring-blue-400 focus:border-blue-400 ${
                      errors.cargo ? "border-red-500" : "border-gray-500"
                    }`}
                  >
                    <option value="">Seleccionar...</option>
                    {cargos.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                ) : name === "rol" ? (
                  <select
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    className={`border rounded w-full p-1.5 text-sm focus:ring-blue-400 focus:border-blue-400 ${
                      errors.rol ? "border-red-500" : "border-gray-500"
                    }`}
                  >
                    <option value="">Seleccionar...</option>
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                ) : name === "contacto" || name === "direccion" ? (
                  <textarea
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    rows={2}
                    className={`border rounded w-full p-1.5 text-sm resize-none focus:ring-blue-400 focus:border-blue-400 ${
                      errors[name] ? "border-red-500" : "border-gray-500"
                    }`}
                  />
                ) : (
                  <input
                    type={name === "login" ? "email" : "text"}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`border rounded w-full p-1.5 text-sm focus:ring-blue-400 focus:border-blue-400 ${
                      errors[name] ? "border-red-500" : "border-gray-500"
                    }`}
                  />
                )}
                {errors[name] && (
                  <p className="text-xs text-red-600 mt-0.5">{errors[name]}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* COLUMNA DERECHA - FOTO */}
        <div className="flex flex-col items-center">
          <label className="w-full px-2 py-1 text-left text-gray-800 font-semibold text-sm">
            Foto:
          </label>
          <label className="w-full text-left border border-gray-500 rounded-md px-2 py-1 cursor-pointer bg-gray-50 hover:bg-gray-100 text-sm mb-4">
            Seleccionar foto
            <input
              type="file"
              name="foto"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </label>
          <div className="w-32 h-32 border-2 border-gray-300 rounded-full flex items-center justify-center overflow-hidden bg-gray-100 m-2">
            {preview ? (
              <img
                src={preview}
                alt="Previsualización"
                className="object-cover w-full h-full"
              />
            ) : (
              <UserCircle2 className="w-16 h-16 text-gray-400" />
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

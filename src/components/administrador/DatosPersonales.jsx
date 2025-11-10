// components/administrador/DatosPersonales.jsx
import React from "react";
import { UserCircle2 } from "lucide-react";

const formatSexo = (code) => {
  if (!code) return "-";
  const upper = code.toUpperCase();
  return upper === "M" ? "Masculino" : upper === "F" ? "Femenino" : code;
};

const formatDate = (isoDate) => {
  if (!isoDate) return "-";
  const [date] = isoDate.split("T");
  return date;
};

const FotoUsuario = ({ foto }) => {
  if (foto) {
    return (
      <img
        src={`http://localhost:8000/img/foto/${foto}`}
        alt="Foto de usuario"
        className="w-32 h-32 mx-auto rounded-full object-cover shadow mb-3"
      />
    );
  }

  return (
    <div className="w-32 h-32 flex items-center justify-center mx-auto mb-4 bg-gray-100 rounded-full text-gray-400 border border-gray-300">
      <UserCircle2 size={80} />
    </div>
  );
};

export default function DatosPersonales({ usuario }) {
  const personalData = [
    { label: "Nombre", value: usuario.name },
    { label: "CI", value: usuario.ci },
    { label: "Contacto", value: usuario.contacto },
    { label: "Sexo", value: formatSexo(usuario.sexo) },
    { label: "Fecha Ingreso", value: formatDate(usuario.created_at) },
    { label: "Rol", value: usuario.rol },
    { label: "Cargo", value: usuario.cargo },
    { label: "Dirección", value: usuario.direccion },
  ];

  return (
    <div className="w-full lg:w-3/10 p-4 bg-white border border-gray-300 rounded-lg shadow-md h-fit">
      <div className="flex justify-between items-center bg-blue-600 p-2 rounded-t-md -mt-4 -mx-4 mb-4 shadow">
        <h2 className="text-base font-semibold text-white my-1 ml-1">Datos Personales</h2>
      </div>

      <FotoUsuario foto={usuario.foto} />

      <div className="grid grid-cols-2 gap-y-1 text-sm">
        {personalData.map((item, i) => (
          <React.Fragment key={i}>
            <div className="font-semibold text-gray-700 text-right pr-2">{item.label}:</div>
            <div className="text-gray-800">{item.value || "-"}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { getListaEntregas, getEntregaDetalle, registrarEntrega } from "../api/servicioEntrega";

export const useEntrega = () => {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRegistroOpen, setModalRegistroOpen] = useState(false);

  const cargarEntregas = async () => {
    setLoading(true);
    const data = await getListaEntregas();
    setEntregas(data);
    setLoading(false);
  };

  const cargarDetalle = async (cod_dtra) => {
    const data = await getEntregaDetalle(cod_dtra);
    setDetalle(data);
    setModalOpen(true);
  };

  const guardarEntrega = async (form) => {
    const data = await registrarEntrega(form);
    return data;
  };

  useEffect(() => {
    cargarEntregas();
  }, []);

  return {
    entregas,
    loading,
    selected,
    setSelected,
    detalle,
    cargarDetalle,
    modalOpen,
    setModalOpen,
    modalRegistroOpen,
    setModalRegistroOpen,
    guardarEntrega,
  };
};

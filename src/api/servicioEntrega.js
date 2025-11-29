import api from "./axios";

export const getListaEntregas = async () => {
  const res = await api.get("/api/ltl-ajax-entrega");
  return res.data.data;
};

export const getEntregaDetalle = async (cod_dtra) => {
  const res = await api.get(`/api/panel-entrega-legalizacion/${cod_dtra}`);
  return res.data.data;
};

export const registrarEntrega = async (payload) => {
  const res = await api.post("/api/g-entrega", payload);
  return res.data;
};

import { useState, useEffect } from "react";
import api from "../api/axios";


export const useUsers = (bloqueado = "f") => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/usuarios/${bloqueado}`);
      setUsers(res.data.usuarios || []);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [bloqueado]);

  return { data: users, loading, refetch: fetchUsers };
};
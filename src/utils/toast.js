import { toast as hotToast } from "react-hot-toast";

const baseStyle = {
  color: "#fff",
  padding: "12px 20px",
  borderRadius: "10px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
  fontWeight: 500,
  fontSize: "0.9rem",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.15)",
};

export const toast = {
  success: (msg) =>
    hotToast.success(msg, {
      icon: "✅",
      style: {
        ...baseStyle,
        background: "linear-gradient(135deg, #0A66C2, #2563EB)", // Azul institucional
      },
    }),

  error: (msg) =>
    hotToast.error(msg, {
      icon: "❌",
      style: {
        ...baseStyle,
        background: "linear-gradient(135deg, #D72638, #B91C1C)", // Rojo de alerta
      },
    }),

  info: (msg) =>
    hotToast(msg, {
      icon: "ℹ️",
      style: {
        ...baseStyle,
        background: "linear-gradient(135deg, #475569, #334155)", // Gris oscuro elegante
      },
    }),

  warning: (msg) =>
    hotToast(msg, {
      icon: "⚠️",
      style: {
        ...baseStyle,
        background: "linear-gradient(135deg, #EAB308, #CA8A04)", // Amarillo cálido
        color: "#000",
      },
    }),
};

import AppRoutes from './routes/AppRoutes';
import { Toaster } from "react-hot-toast";
import "./App.css"

export default function App() {
  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
            fontFamily: "Inter, sans-serif",
          },
          success: {
            iconTheme: {
              primary: "#0A66C2", // Azul institucional
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#D72638", // Rojo institucional
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
}
import { StrictMode } from "react";
import  ReactDOM  from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react"; // ✅ Importar provider
import "./index.css";
import App from "./App.jsx";
import { ModalProvider } from "./hooks/useModal.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <HeroUIProvider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </HeroUIProvider>
    </BrowserRouter>
  </StrictMode>
);
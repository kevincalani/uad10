// 📁 hooks/useModal.jsx
import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  // Abrir un nuevo modal y mantener los anteriores
  const openModal = (Component, props = {}) => {
    setModals((prev) => [...prev, { Component, props }]);
  };

  // Cerrar un modal específico por índice
  const closeModal = (index) => {
    setModals((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {modals.map((modal, index) =>
        createPortal(
          <ModalOverlay onClose={() => closeModal(index)}>
            <ModalContainer>{renderModal(modal, () => closeModal(index))}</ModalContainer>
          </ModalOverlay>,
          document.body
        )
      )}
    </ModalContext.Provider>
  );
};

// Función auxiliar para renderizar un modal
function renderModal(modal, closeModal) {
  const { Component, props } = modal;
  const ModalComponent = Component;
  return <ModalComponent {...props} onClose={closeModal} />;
}

export const useModal = () => useContext(ModalContext);

// 🎨 Fondo semitransparente
function ModalOverlay({ children, onClose }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fadeIn"
    >
      {children}
    </div>
  );
}

// 🧱 Contenedor centrado del modal
function ModalContainer({ children }) {
  return (
    <div
      className="relative w-full max-w-4xl flex justify-center animate-scaleIn"
      onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer clic dentro
    >
      {children}
    </div>
  );
}

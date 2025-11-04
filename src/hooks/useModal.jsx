import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null);

  const openModal = (Component, props = {}) => {
    setModal({ Component, props });
  };

  const closeModal = () => setModal(null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modal &&
        createPortal(
            <ModalWrapper onClose={closeModal}>
            {(() => {
                const { Component, props } = modal;
                const ModalComponent = Component;
                return <ModalComponent {...props} onClose={closeModal} />;
            })()}
            </ModalWrapper>,
            document.body
        )}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);

function ModalWrapper({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/50  animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-auto max-w-7xl p-0 relative animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "@heroui/modal";

export const RegistrarEntregaModal = ({ open, setOpen, onSubmit, cod_dtra }) => {
  const [form, setForm] = useState({
    cdtra: cod_dtra,
    entregado_a: "",
    ci: ""
  });

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      <ModalHeader>Registrar entrega</ModalHeader>
      <ModalBody>
        <label>Nombre</label>
        <input
          className="w-full border p-2 rounded"
          value={form.entregado_a}
          onChange={e => setForm({ ...form, entregado_a: e.target.value })}
        />

        <label>CI</label>
        <input
          className="w-full border p-2 rounded"
          value={form.ci}
          onChange={e => setForm({ ...form, ci: e.target.value })}
        />
      </ModalBody>

      <ModalFooter>
        <button
          className="px-3 py-1 bg-green-600 text-white rounded-md"
          onClick={() => onSubmit(form)}
        >
          Guardar
        </button>
      </ModalFooter>
    </Modal>
  );
};

import { Modal, ModalBody, ModalHeader, ModalFooter } from "@heroui/modal";

export const DetalleEntregaModal = ({ open, setOpen, data, onRegistrar }) => {
  if (!data) return null;

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      <ModalHeader>Detalle de entrega</ModalHeader>
      <ModalBody>
        <p><b>Nombre:</b> {data.persona.per_nombre} {data.persona.per_apellido}</p>
        <p><b>CI:</b> {data.persona.per_ci}</p>
        <p><b>Tipo trámite:</b> {data.tramita.tra_tipo_tramite}</p>
        <p><b>Fecha:</b> {data.docleg.dtra_fecha_recojo}</p>
      </ModalBody>

      <ModalFooter>
        <button
          onClick={() => onRegistrar(data.docleg.cod_dtra)}
          className="px-3 py-1 bg-green-600 text-white rounded-md"
        >
          Registrar entrega
        </button>
      </ModalFooter>
    </Modal>
  );
};

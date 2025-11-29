import { EntregaTable } from "../../components/Tramites/EntregaTable";
import { useEntrega } from "../../hooks/useEntrega";
import { DetalleEntregaModal } from "../../modals/Servicios/DetalleEntregaModal";
import { RegistrarEntregaModal } from "../../modals/Servicios/RegistraEntregaModal";


export default function EntregaPage (){
  const {
    entregas,
    loading,
    detalle,
    cargarDetalle,
    modalOpen,
    setModalOpen,
    modalRegistroOpen,
    setModalRegistroOpen,
    guardarEntrega
  } = useEntrega();

  const abrirRegistro = (cod_dtra) => {
    setModalOpen(false);
    setModalRegistroOpen(true);
  };

  const submitEntrega = async (form) => {
    await guardarEntrega(form);
    setModalRegistroOpen(false);
    window.location.reload();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Lista de Entregas</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <EntregaTable entregas={entregas} onVer={cargarDetalle} />
      )}

      <DetalleEntregaModal
        open={modalOpen}
        setOpen={setModalOpen}
        data={detalle}
        onRegistrar={abrirRegistro}
      />

      <RegistrarEntregaModal
        open={modalRegistroOpen}
        setOpen={setModalRegistroOpen}
        onSubmit={submitEntrega}
        cod_dtra={detalle?.docleg?.cod_dtra}
      />
    </div>
  );
};

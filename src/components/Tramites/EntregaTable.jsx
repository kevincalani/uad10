import { Table, TableRow, TableHeader, TableBody, TableCell } from "@heroui/table";

export const EntregaTable = ({ entregas, onVer }) => {
  return (
    <Table
      aria-label="Lista de entregas"
      selectionMode="single"
      className="mt-4"
      isStriped
    >
        <TableRow>
          <TableHeader>Cod</TableHeader>
          <TableHeader>Nombre</TableHeader>
          <TableHeader>CI</TableHeader>
          <TableHeader>N° trámite</TableHeader>
          <TableHeader>Tipo</TableHeader>
          <TableHeader>Fecha solicitud</TableHeader>
          <TableHeader></TableHeader>
        </TableRow>

      <TableBody>
        {entregas?.map((e) => (
          <TableRow key={e.cod_dtra}>
            <TableCell>{e.cod_dtra}</TableCell>
            <TableCell>{e.per_nombre} {e.per_apellido}</TableCell>
            <TableCell>{e.per_ci}</TableCell>
            <TableCell>{e.tra_numero}</TableCell>
            <TableCell>{e.dtra_tipo}</TableCell>
            <TableCell>{e.tra_fecha_solicitud}</TableCell>
            <TableCell>
              <button
                onClick={() => onVer(e.cod_dtra)}
                className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Ver
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

import { Edit } from "lucide-react";
import { FC } from "react";
import { Client } from "./ClientsTable";
import { StatusPill } from "./StatusPill";

export const ClientCard: FC<{
  client: Client;
  planName: string;
  handleEdit?: () => void;
}> = ({ client, planName, handleEdit }) => (
  <li className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
    <div className="mb-2 flex items-start justify-between">
      <h3 className="text-sm font-semibold text-primary">{client.name}</h3>
      <div className="flex flex-row items-center gap-2">
        <StatusPill status={client.status} />
        <button
          onClick={handleEdit}
          className="flex h-6 w-6 items-center justify-center rounded-md bg-primary p-1 text-white"
        >
          <Edit />
        </button>
      </div>
    </div>

    <dl className="space-y-1 text-xs text-black">
      <Row label="CPF/CNPJ" value={client.cpf} />
      <Row label="Telefone" value={client.mobilePhone} />
      <Row label="Plano" value={planName} />
      <Row label="Email" value={client.email} />
    </dl>
  </li>
);

const Row: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between gap-2">
    <dt className="text-zinc-500">{label}</dt>
    <dd className="max-w-[60%] truncate text-right font-medium">{value}</dd>
  </div>
);

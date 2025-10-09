// src/components/clients/ClientsTable.tsx
import { CustomPagination } from "@/components/CustomPagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Ui/table";
import { authGetAPI, token } from "@/lib/axios";
import { cn } from "@/lib/utils";
import debounce from "lodash.debounce";
import { Edit, Plus, Search } from "lucide-react";
import { useCookies } from "next-client-cookies";
import {
  ButtonHTMLAttributes,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ClientCard } from "./ClientCard";
import { ClientCardSkeleton } from "./ClientCardSkeleton";
import CreateClientModal from "./CreateClientModal";
import EditSignatureModal from "./EditSignatureModal";
import { StatusPill } from "./StatusPill";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Ui/tooltip";

export type ClientStatus = "active" | "inactive" | "no-signature";

interface Signature {
  createdAt: string;
  creditCardId: string;
  expirationDate: string;
  influencerId: string;
  installmentCount: number;
  invoiceId: string | null;
  isAutoRenewActivated: boolean;
  paymentId: string;
  paymentType: "credit_card" | "pix" | string;
  refoundDateLimit: string;
  signaturePlanId: number | string;
  status: "active" | "inactive" | string;
}

export interface Client {
  id: string;
  name: string;
  cpf: string;
  mobilePhone: string;
  email: string;

  activeSignature?: Signature;
  otherSignatures?: Signature[];

  plan?: string;
  status: ClientStatus;
}

interface Plans {
  id: number;
  name: string;
  description: string;
  userQuantity: number;
  creditCardPrice: number;
  pixPrice: number;
  isActive: boolean;
}

interface ClientsTableProps {
  rowsPerPage?: number;
}

interface RawClient {
  id: string;
  name: string;
  activeSignature?: Signature;
  otherSignatures?: Signature[];
  cpf: string;
  mobilePhone: string;
  email: string;
}

export const ClientsTable: React.FC<ClientsTableProps> = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Client[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [plans, setPlans] = useState<Plans[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editModalData, setEditModalData] = useState<Client>();
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const cookies = useCookies();
  const Token = cookies.get(token);

  const planMap = useMemo(
    () => Object.fromEntries(plans.map((p) => [Number(p.id), p.name])),
    [plans],
  );

  const normalizeClient = (raw: RawClient): Client => {
    const activeSignature: Signature | undefined = raw.activeSignature;
    const otherSignatures: Signature[] = raw.otherSignatures ?? [];

    let status: ClientStatus;
    if (activeSignature) status = "active";
    else if (!activeSignature && otherSignatures.length > 0)
      status = "inactive";
    else status = "no-signature";

    return {
      id: raw.id,
      name: raw.name,
      cpf: raw.cpf ?? "—",
      mobilePhone: raw.mobilePhone ?? "—",
      email: raw.email ?? "—",
      activeSignature,
      otherSignatures,
      status,
    };
  };

  const getPlanName = useCallback(
    (c: Client) => {
      const sig = c.activeSignature ?? c.otherSignatures?.[0];
      if (!sig) return "—";
      const id = Number(sig.signaturePlanId);
      return planMap[id] ?? "—";
    },
    [planMap],
  );

  async function handleGetPlans() {
    try {
      const response = await authGetAPI("/signature-plan", Token);
      if (response.status === 200) {
        setPlans(response.body.plans);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleGetTableData() {
    setLoading(true);
    try {
      const response = await authGetAPI(
        `/influencer?status=${statusFilter}&page=${currentPage}&name=${search}`,
        Token,
      );
      if (response.status === 200) {
        const influencers = response.body.influencers ?? [];
        const normalized = influencers.map(normalizeClient);
        console.log("normalized", normalized);
        setData(normalized);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Token) handleGetTableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, search, currentPage, planMap, Token]);

  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [search, statusFilter]);

  const handleEdit = (data: Client) => {
    setEditModalData(data);
    setEditModalVisible(true);
  };

  const handleStopTyping = (value: string) => {
    setSearch(value);
  };

  const debouncedHandleStopTyping = useCallback(
    debounce(handleStopTyping, 1000),
    [],
  );

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4 rounded-lg bg-secondary py-4 shadow">
        {/* Topbar */}
        <div className="flex flex-col gap-2 px-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-row justify-between gap-2">
            <h2 className="text-xl font-semibold text-white">Clientes</h2>
            <button
              onClick={() => setCreateModalVisible(true)}
              className="flex items-center justify-center rounded-md bg-primary p-1 px-2 md:hidden"
            >
              Criar Cliente
              <Plus />
            </button>
          </div>

          {/* Search */}
          <div className="border-default-300 relative flex h-8 w-full flex-row items-center gap-2 overflow-hidden rounded-md border border-primary bg-white py-0 pl-2 focus:border-secondary/60 focus:ring-secondary/60 md:max-w-xs">
            <input
              onChange={(e) => debouncedHandleStopTyping(e.target.value)}
              placeholder="Escreva o nome do cliente"
              className="w-full bg-transparent py-2 text-sm outline-none"
            />
            <div className="flex h-full items-center justify-center bg-white px-2">
              <Search className="h-4 w-4" />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-1 flex-col items-center justify-center gap-2 md:items-end md:justify-end">
            <div className="flex overflow-hidden rounded-lg bg-white">
              <FilterButton
                active={statusFilter === "all"}
                onClick={() => setStatusFilter("all")}
              >
                TODOS
              </FilterButton>
              <FilterButton
                active={statusFilter === "active"}
                onClick={() => setStatusFilter("active")}
              >
                ATIVOS
              </FilterButton>
              <FilterButton
                active={statusFilter === "inactive"}
                onClick={() => setStatusFilter("inactive")}
              >
                INATIVOS
              </FilterButton>
            </div>
            <button
              onClick={() => setCreateModalVisible(true)}
              className="hidden items-center justify-center rounded-md bg-primary p-1 px-2 md:flex"
            >
              Criar Cliente
              <Plus />
            </button>
          </div>
        </div>

        <div className="hidden md:block">
          <Table
            wrapperClass="bg-white shadow-sm"
            className="w-full table-fixed"
          >
            {/* Definindo larguras responsivas com % (mantém responsivo e evita shift) */}
            <colgroup>
              <col style={{ width: "22%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>

            <TableHeader className="bg-primary/90">
              <TableRow className="border-0">
                <TableHead className="text-start">Cliente</TableHead>
                <TableHead className="text-start">CPF/CNPJ</TableHead>
                <TableHead className="text-start">Telefone</TableHead>
                <TableHead className="text-start">Plano</TableHead>
                <TableHead className="text-start">Email</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <TableRow
                      key={index}
                      className="text-[#020817] hover:bg-primary/5"
                    >
                      <TableCell className="truncate">
                        <div className="h-full w-full animate-pulse rounded-md bg-zinc-400 text-transparent">
                          .
                        </div>
                      </TableCell>
                      <TableCell className="truncate">
                        {" "}
                        <div className="h-full w-full animate-pulse rounded-md bg-zinc-400 text-transparent">
                          .
                        </div>
                      </TableCell>
                      <TableCell className="truncate">
                        {" "}
                        <div className="h-full w-full animate-pulse rounded-md bg-zinc-400 text-transparent">
                          .
                        </div>
                      </TableCell>
                      <TableCell className="truncate">
                        {" "}
                        <div className="h-full w-full animate-pulse rounded-md bg-zinc-400 text-transparent">
                          .
                        </div>
                      </TableCell>
                      <TableCell className="truncate">
                        {" "}
                        <div className="h-full w-full animate-pulse rounded-md bg-zinc-400 text-transparent">
                          .
                        </div>
                      </TableCell>
                      <TableCell className="flex items-center justify-center text-center">
                        {" "}
                        <div className="h-full w-full animate-pulse rounded-md bg-zinc-400 text-transparent">
                          .
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : !loading && data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="w-full py-8 text-center text-black"
                  >
                    <div className="flex h-full w-full items-center justify-center">
                      Nenhum registro encontrado.
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                !loading &&
                data.length !== 0 &&
                data.map((client, index) => (
                  <TableRow
                    key={index}
                    className="text-[#020817] hover:bg-primary/5"
                  >
                    <TableCell className="truncate">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="w-full truncate">{client.name}</p>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          align="start"
                          className="w-full border border-primary bg-white"
                        >
                          <p className="text-black"> {client.name}</p>
                          <TooltipArrow className="fill-primary" />
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="truncate">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="w-full truncate">{client.cpf}</p>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          align="start"
                          className="w-full border border-primary bg-white"
                        >
                          <p className="text-black"> {client.cpf}</p>
                          <TooltipArrow className="fill-primary" />
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="truncate">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="w-full truncate">
                            {client.mobilePhone}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          align="start"
                          className="w-full border border-primary bg-white"
                        >
                          <p className="text-black">{client.mobilePhone}</p>
                          <TooltipArrow className="fill-primary" />
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="truncate">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="w-full truncate">
                            {getPlanName(client)}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          align="start"
                          className="w-full border border-primary bg-white"
                        >
                          <p className="text-black">{getPlanName(client)}</p>
                          <TooltipArrow className="fill-primary" />
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="truncate">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="w-full truncate">{client.email}</p>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          align="start"
                          className="w-full border border-primary bg-white"
                        >
                          <p className="text-black"> {client.email}</p>
                          <TooltipArrow className="fill-primary" />
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="flex items-center justify-center gap-2 text-center">
                      <StatusPill status={client.status} />
                      <button
                        onClick={() => handleEdit(client)}
                        className="flex h-6 w-6 items-center justify-center rounded-md bg-primary p-1"
                      >
                        <Edit />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <ul className="flex flex-col gap-3 px-4 md:hidden">
          {loading ? (
            <>
              {Array.from({ length: 8 }).map((_, index) => (
                <ClientCardSkeleton key={index} />
              ))}
            </>
          ) : !loading && data.length === 0 ? (
            <ClientCard
              client={{
                name: "Nenhum registro encontrado",
                cpf: "",
                mobilePhone: "",
                email: "",
                status: "inactive",
                id: "",
              }}
              planName={``}
            />
          ) : (
            !loading &&
            data.length !== 0 &&
            data.map((client, index) => (
              <ClientCard
                key={index}
                client={client}
                planName={getPlanName(client)}
                handleEdit={() => handleEdit(client)}
              />
            ))
          )}
        </ul>
        <div className="flex w-full flex-col items-center justify-between gap-3 px-4 text-[#020817] md:flex-row">
          <div className="flex flex-1 items-end justify-end">
            <CustomPagination
              pages={5}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
      <EditSignatureModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        client={editModalData}
        plans={plans}
        onSuccess={handleGetTableData} // recarrega a lista depois de salvar
      />
      <CreateClientModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        plans={plans}
        onSuccess={handleGetTableData} // recarrega lista
      />
    </TooltipProvider>
  );
};

interface FilterBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}
const FilterButton: FC<FilterBtnProps> = ({
  active,
  className,
  children,
  ...rest
}) => (
  <button
    className={cn(
      "rounded px-3 py-2 text-[10px] font-semibold uppercase tracking-wide transition-all duration-300",
      active ? "bg-secondary text-white" : "",
      className,
    )}
    {...rest}
  >
    {children}
  </button>
);

export default ClientsTable;

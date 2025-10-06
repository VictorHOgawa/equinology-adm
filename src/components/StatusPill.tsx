import { cn } from "@/lib/utils";
import { FC } from "react";
import { ClientStatus } from "./ClientsTable";

export const StatusPill: FC<{ status: ClientStatus }> = ({ status }) => {
  const base =
    "w-full max-w-[110px] rounded-md border px-3 py-1 text-xs font-semibold flex items-center justify-center";
  switch (status) {
    case "active":
      return (
        <span className={cn(base, "border-green bg-green/20 text-green")}>
          ATIVO
        </span>
      );
    case "inactive":
      return (
        <span className={cn(base, "border-red bg-red/20 text-red")}>
          INATIVO
        </span>
      );
    case "no-signature":
    default:
      return (
        <span className={cn(base, "border-zinc-400 bg-zinc-200 text-zinc-700")}>
          NÃO ASSINOU
        </span>
      );
  }
};

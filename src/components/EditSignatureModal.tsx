// src/components/clients/EditSignatureModal.tsx
import { AuthPostAPI, AuthPutAPI, token } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Switch } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { useCookies } from "next-client-cookies";
import { FC, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import toast from "react-hot-toast";
import { Client } from "./ClientsTable";
import { Button } from "./Ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./Ui/dropdown-menu";
import Modal from "./Ui/modal";

/* -------------------------------------------------------------------------- */
/*                                Tipagens                                    */
/* -------------------------------------------------------------------------- */

interface Plan {
  id: string | number;
  name: string;
  isActive?: boolean; // pode não vir do backend
}

interface ActiveSignature {
  status: "active" | "inactive" | string;
  signaturePlanId: string | number;
  id?: string | number;
  _id?: string | number;
}

interface EditSignatureModalProps {
  visible: boolean;
  onClose: () => void;
  client?: Client;
  plans: Plan[];
  onSuccess?: () => void;
}

const formSchema = z.object({
  status: z.enum(["active", "inactive"]),
  planId: z.string().min(1, "Selecione um plano"),
});
type FormValues = z.infer<typeof formSchema>;

/* -------------------------------------------------------------------------- */
/*                               Componente                                   */
/* -------------------------------------------------------------------------- */

export const EditSignatureModal: FC<EditSignatureModalProps> = ({
  visible,
  onClose,
  client,
  plans,
  onSuccess,
}) => {
  const cookies = useCookies();
  const Token = cookies.get(token);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  /* Lê a assinatura ativa independentemente de vir dentro de props */
  const rawActive = client?.activeSignature as ActiveSignature | null;
  const activeSig: ActiveSignature | null =
    rawActive && typeof rawActive === "object"
      ? "props" in rawActive && rawActive.props
        ? (rawActive.props as ActiveSignature)
        : (rawActive as ActiveSignature)
      : null;

  const {
    watch,
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: (activeSig?.status as "active" | "inactive") ?? "inactive",
      planId: activeSig ? String(activeSig.signaturePlanId) : "",
    },
  });

  /* Recarrega quando trocar de cliente */
  useEffect(() => {
    reset({
      status: (activeSig?.status as "active" | "inactive") ?? "inactive",
      planId: activeSig ? String(activeSig.signaturePlanId) : "",
    });
  }, [activeSig, reset]);

  /* Planos (não descarta os que não têm isActive explícito ou isActive === true) */
  const planOptions = useMemo(
    () => plans.filter((p) => p.isActive !== false),
    [plans],
  );
  const selectedPlan = planOptions.find(
    (p) => String(p.id) === watch("planId"),
  );

  /* ---------------------------------------------------------------------- */
  async function onSubmit(values: FormValues) {
    try {
      if (activeSig) {
        setIsEditing(true);
        const update = await AuthPutAPI(
          `/signature/update-status/${activeSig.id}`,
          {
            dueDate: new Date(),
            status: values.status,
          },
          Token,
        );
        if (update.status === 200) {
          toast.success("Assinatura atualizada com sucesso!");
          onClose();
          onSuccess?.();
          return setIsEditing(false);
        }
        toast.error("Erro ao atualizar assinatura!");
        return setIsEditing(false);
      } else {
        setIsCreating(true);
        /* Cria nova assinatura */
        const create = await AuthPostAPI(
          "/signature/create-signature",
          {
            expirationDate: new Date(),
            influencerId: client?.id,
            paymentId: "paymentId",
            signaturePlanId: values.planId,
          },
          Token,
        );
        if (create.status === 200) {
          toast.success("Assinatura criada com sucesso!");
          onClose();
          onSuccess?.();
          return setIsCreating(false);
        }
        toast.error("Erro ao criar assinatura!");
        return setIsCreating(false);
      }
      // onSuccess?.();
      // onClose();
    } catch (err) {
      console.error(err);
      // aqui você pode exibir um toast de erro
    }
  }

  /* ---------------------------------------------------------------------- */
  return (
    <Modal visible={visible} onClose={onClose} classWrap="max-w-lg">
      <div className="flex flex-col gap-6 bg-white p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 p-4"
        >
          <h3 className="text-lg font-semibold text-primary">
            {activeSig ? "Editar assinatura" : "Criar assinatura"}
          </h3>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-primary">
              Cliente:
              <span className="font-bold">{client?.name}</span>
            </span>
            <span className="text-sm text-primary">
              Cpf ou cnpj:
              <span className="font-bold">{client?.cpf}</span>
            </span>
            <span className="text-sm text-primary">
              Email:
              <span className="font-bold">{client?.email}</span>
            </span>
            <span className="text-sm text-primary">
              Telefone:
              <span className="font-bold">{client?.mobilePhone}</span>
            </span>
          </div>

          {/* ------------------- Plano (Dropdown) ------------------- */}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-primary">Plano</span>
            <Controller
              name="planId"
              control={control}
              render={({ field }) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "relative w-full rounded-lg border border-primary p-2 text-primary",
                        errors.planId && "border border-red",
                      )}
                    >
                      <span className="font-semibold">
                        {selectedPlan?.name || "Selecione o plano"}
                      </span>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="dark:bg-n-6 dark:border-n-6 bg-white">
                    {planOptions.map((plan) => (
                      <DropdownMenuItem
                        key={plan.id}
                        onSelect={() => field.onChange(String(plan.id))}
                        className={cn(
                          "hover:bg-secondary-2 text-black hover:text-black dark:text-black",
                          plan.id === Number(field.value) &&
                            "bg-secondary-2 text-black",
                        )}
                      >
                        {plan.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            />
            {errors.planId && (
              <span className="text-xs text-red">{errors.planId.message}</span>
            )}
          </div>

          {activeSig && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary">
                Assinatura ativa
              </span>
              <Switch
                checked={watch("status") === "active"}
                onChange={(checked) =>
                  setValue("status", checked ? "active" : "inactive")
                }
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  watch("status") === "active" ? "bg-primary" : "bg-primary/30",
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    watch("status") === "active"
                      ? "translate-x-6"
                      : "translate-x-1",
                  )}
                />
              </Switch>
            </div>
          )}

          {/* -------------------- Ações -------------------- */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary/90"
            >
              Cancelar
            </button>
            <Button
              disabled={isSubmitting || isCreating || isEditing}
              type="submit"
            >
              {isSubmitting || isCreating || isEditing
                ? "Salvando..."
                : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditSignatureModal;

import { AuthPostAPI, token } from "@/lib/axios";
import { maskCep, maskCpfCnpj, maskPhone } from "@/lib/masks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ImageIcon, Loader2 } from "lucide-react";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import { FC, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "./Ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./Ui/form";
import { Input } from "./Ui/input";
import Modal from "./Ui/modal";
import { Textarea } from "./Ui/textarea";

interface Plan {
  id: string | number;
  name: string;
  isActive?: boolean;
}

interface CreateClientModalProps {
  visible: boolean;
  onClose: () => void;
  plans: Plan[];
  onSuccess?: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  avatar: z.string().optional(),
  cpfCnpj: z.string().min(11, "CPF/CNPJ inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  mobilePhone: z.string().optional(),
  description: z.string().optional(),
  postalCode: z.string().optional(),
  address: z.string().optional(),
  number: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const CreateClientModal: FC<CreateClientModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const cookies = useCookies();
  const [showPwd, setShowPwd] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingClient, setIsCreatingClient] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      avatar: "",
      cpfCnpj: "",
      password: "",
      mobilePhone: "",
      description: "",
      postalCode: "",
      address: "",
      number: "",
    },
  });

  const useFormSteps = (form: UseFormReturn<z.infer<typeof formSchema>>) => {
    const [activeStep, setActiveStep] = useState(0);

    const stepFields = {
      0: [
        "name",
        "email",
        "avatar",
        "cpfCnpj",
        "password",
        "mobilePhone",
        "description",
        "postalCode",
        "address",
        "number",
      ] as const,
    };

    const validateStep = async (step: number) => {
      const fields = stepFields[step as keyof typeof stepFields];
      if (!fields) return true;
      return await form.trigger(fields);
    };

    return { activeStep, validateStep, setActiveStep };
  };

  const { validateStep } = useFormSteps(form);

  async function handleUploadSingleFile(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      return;
    }
    const url = await handleUploadSingle(selectedFile);
    if (url) {
    }
  }

  async function handleUploadSingle(file: File) {
    const Token = cookies.get(token);
    const formData = new FormData();
    const sanitizedFileName = file.name.replace(/\s+/g, "-");
    formData.append("file", file, sanitizedFileName);
    setIsUploading(true);
    const response = await AuthPostAPI("/file", formData, Token);
    if (response && response.body && response.body.fullUrl) {
      form.setValue("avatar", response.body.fullUrl);
      setIsUploading(false);
      return response.body.url;
    } else {
      setIsUploading(false);
      toast.error("Falha no upload do arquivo. Tente novamente!");
      return null;
    }
  }

  async function CreateInfluencer(
    form: UseFormReturn<z.infer<typeof formSchema>>,
  ) {
    const isValid = await validateStep(0);
    if (!isValid) {
      const errors = form.formState.errors;

      const fieldLabels: Record<keyof z.infer<typeof formSchema>, string> = {
        name: "Nome",
        email: "Email",
        avatar: "Avatar",
        cpfCnpj: "CPF/CNPJ",
        password: "Senha",
        mobilePhone: "Telefone",
        description: "Descrição",
        postalCode: "CEP",
        address: "Endereço",
        number: "Número",
      };

      const firstErrorField = Object.keys(
        errors,
      )[0] as keyof typeof fieldLabels;
      const firstError = errors[firstErrorField];

      if (firstError?.message && firstErrorField in fieldLabels) {
        const fieldLabel = fieldLabels[firstErrorField];
        return toast.error(`${fieldLabel}: ${firstError.message}`);
      }

      return toast.error("Por favor, corrija os erros no formulário.");
    } else {
      setIsCreatingClient(true);
      const Token = cookies.get(token);
      const create = await AuthPostAPI(
        "/client/signup",
        form.getValues(),
        Token,
      );
      if (create.status === 200) {
        toast.success("Client criado com sucesso!");
        onClose();
        onSuccess?.();
        return setIsCreatingClient(false);
      }
      toast.error(create.body.message);
      return setIsCreatingClient(false);
    }
  }

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      classWrap="max-w-2xl bg-white p-4"
    >
      <Form {...form}>
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-primary">Criar cliente</h3>

          <FormField
            name="avatar"
            control={form.control}
            render={() => (
              <FormItem className="flex flex-col">
                <FormLabel className="mx-auto w-max">Avatar</FormLabel>
                <FormControl>
                  <div className="flex w-full flex-col items-center gap-2">
                    <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-md bg-primary">
                      {!isUploading && form.getValues("avatar") !== "" ? (
                        <Image
                          src={form.getValues("avatar") || ""}
                          alt="image"
                          width={100}
                          height={100}
                          className="h-full w-full object-cover"
                          priority={true}
                        />
                      ) : isUploading ? (
                        <Loader2 className="text-default-50 h-6 w-6 animate-spin" />
                      ) : (
                        <ImageIcon className="text-default-50 h-6 w-6" />
                      )}
                      <div className="absolute h-full w-full">
                        <input
                          className="h-full w-full opacity-0"
                          disabled={isUploading}
                          type="file"
                          id="fileInput"
                          accept=".jpg,.jpeg,.png"
                          onChange={handleUploadSingleFile}
                        />
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome*</FormLabel>
                  <FormControl>
                    <Input placeholder="João Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@email.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              name="cpfCnpj"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF / CNPJ*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123.456.789-00"
                      {...field}
                      onChange={(e) =>
                        form.setValue("cpfCnpj", maskCpfCnpj(e.target.value))
                      }
                      maxLength={18}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="mobilePhone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(99) 99999-9999"
                      {...field}
                      onChange={(e) =>
                        form.setValue("mobilePhone", maskPhone(e.target.value))
                      }
                      maxLength={14}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha*</FormLabel>
                <FormControl className="relative">
                  <div className="relative">
                    <Input
                      placeholder="*******"
                      type={showPwd ? "text" : "password"}
                      {...field}
                    />
                    {showPwd ? (
                      <EyeOff
                        onClick={() => setShowPwd(!showPwd)}
                        size={18}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-primary"
                      />
                    ) : (
                      <Eye
                        onClick={() => setShowPwd(!showPwd)}
                        size={18}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-primary"
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descrição"
                    className="resize-none text-primary placeholder:text-black/50 focus:outline-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField
              name="postalCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="99999-999"
                      {...field}
                      onChange={(e) =>
                        form.setValue("postalCode", maskCep(e.target.value))
                      }
                      maxLength={9}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço*</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua Exemplo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="number"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número*</FormLabel>
                  <FormControl>
                    <Input placeholder="123" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* 
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div className="flex flex-1 flex-col gap-1">
            <span className="text-sm font-medium text-primary">Plano</span>
            <Controller
              name="assignatureId"
              control={control}
              render={({ field }) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "relative w-full rounded-lg border border-primary bg-white p-2 text-primary",
                        errors.assignatureId && "border-red border",
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
            {errors.assignatureId && (
              <span className="text-red text-xs">
                {errors.assignatureId.message}
              </span>
            )}
          </div>

          <div className="md: flex flex-col items-start justify-center gap-2">
            <span className="text-sm font-medium text-primary">
              Assinatura ativa
            </span>
            <Controller
              name="isAssignatureActive"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    field.value ? "bg-primary" : "bg-primary/30",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      field.value ? "translate-x-6" : "translate-x-1",
                    )}
                  />
                </Switch>
              )}
            />
          </div>
        </div> */}

        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary/90"
          >
            Cancelar
          </button>
          <Button
            disabled={isCreatingClient}
            onClick={() => CreateInfluencer(form)}
          >
            {isCreatingClient ? <Loader2 className="animate-spin" /> : "Salvar"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateClientModal;

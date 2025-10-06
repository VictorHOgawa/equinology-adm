"use client";
import { useApiContext } from "@/context/ApiContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { AuthFooter } from "./components/footer";
import { AuthHeader } from "./components/header";

interface LoginDataProps {
  email: string;
  password: string;
}

const schema = z.object({
  email: z.string().email({ message: "Email Inválido" }),
  password: z.string().min(6, "Senha inválida"),
});

export default function Login() {
  const [continueConnected, setContinueConnected] = useState(true);
  const [isShowingPassword, setIsShowingPassword] = useState(false);
  const cookies = useCookies();
  const { PostAPI, setToken } = useApiContext();
  const [loginError, setLoginError] = useState("");
  const router = useRouter();
  const [isLogging, setIsLogging] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDataProps>({
    resolver: zodResolver(schema),
    mode: "all",
  });

  async function HandleLogin(data: LoginDataProps) {
    setIsLogging(true);
    const login = await PostAPI(
      "/user/signin",
      {
        email: data.email,
        password: data.password,
      },
      false,
    );
    console.log("login", login);
    if (login.status === 200) {
      cookies.set(
        process.env.NEXT_PUBLIC_USER_TOKEN as string,
        login.body.accessToken,
      );
      setToken(login.body.accessToken);
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } else {
      toast.error("Erro ao logar, tente novamente");
      setIsLogging(false);
      setLoginError(login.body.message);
    }
    setIsLogging(false);
  }

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-white">
      <Image
        src={"/images/side-login.png"}
        className="absolute right-0 top-0 z-10 hidden h-[95%] w-[40%] rounded-bl-lg object-cover md:block"
        alt=""
        width={1000}
        height={2500}
      />
      <div className="relative z-10 flex min-h-[100vh] w-full flex-col overflow-hidden px-8 xl:px-20">
        <AuthHeader />
        <div className="z-20 mt-32 flex w-full flex-col gap-2 pb-12 md:mt-20 md:w-[45%] xl:ml-[10%] xl:w-[40%] xl:gap-4">
          <h1 className="text-xl font-bold md:text-3xl">Acessar Plataforma</h1>
          <h2 className="text-sm text-[#8392AB] lg:text-lg">
            Digite seu e-mail e senha para <br /> acessar sua conta
          </h2>
          <form
            onSubmit={handleSubmit(HandleLogin)}
            className="flex flex-col gap-1"
          >
            <label className="text-sm font-semibold text-[#252F40]">
              Email
            </label>

            <input
              placeholder="Digite seu email"
              {...register("email")}
              className="h-8 rounded-md border border-zinc-400 p-2 text-black focus:border-none focus:outline-none"
              type="email"
              disabled={isLogging}
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}

            <label className="text-sm font-semibold text-[#252F40]">
              Senha
            </label>
            <div className="relative flex flex-row items-center overflow-hidden rounded-md border border-zinc-400 bg-white focus:border-none focus:outline-none">
              <input
                {...register("password")}
                placeholder="Digite sua senha"
                className="h-8 w-full rounded-md border-none p-2 text-black focus:border-none focus:outline-none"
                type={isShowingPassword ? "text" : "password"}
                disabled={isLogging}
              />
              <button
                type="button"
                onClick={() => setIsShowingPassword(!isShowingPassword)}
                className="absolute right-2 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center bg-transparent"
              >
                {isShowingPassword ? (
                  <EyeOff className="h-4 w-4 text-black" />
                ) : (
                  <Eye className="h-4 w-4 text-black" />
                )}
              </button>
            </div>

            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
            <button
              type="button"
              onClick={() => router.push("recover-password")}
              className="self-start text-xs text-black"
            >
              Esqueci minha senha
            </button>
            <div className="flex flex-row items-center gap-2">
              <button
                type="button"
                onClick={() => setContinueConnected(!continueConnected)}
                className={`flex h-4 w-8 ${
                  continueConnected ? "bg-secondary" : "bg-zinc-400"
                } relative rounded-full p-[1px]`}
              >
                <div
                  className={`absolute top-[1px] h-[90%] w-1/2 rounded-full bg-white transition-transform duration-300 ${
                    continueConnected ? "translate-x-0" : "translate-x-[90%]"
                  }`}
                />
              </button>
              <span className="text-sm text-black">Continuar conectado</span>
            </div>

            <button
              type="submit"
              disabled={isLogging}
              className="mt-6 rounded-md border bg-secondary p-2 font-bold text-white"
            >
              {isLogging ? "Carregando..." : "Acessar Plataforma"}
            </button>
          </form>
          {loginError && (
            <span className="text-red-500 mt-2">Senha ou email incorretos</span>
          )}

          <span className="text-md text-[#8392AB]">
            Não tem conta ainda?
            <button
              onClick={() => router.push("/register")}
              className="ml-1 cursor-pointer bg-secondary bg-clip-text font-bold text-transparent"
            >
              Se cadastre agora
            </button>
          </span>
        </div>
        <AuthFooter />
      </div>
    </main>
  );
}

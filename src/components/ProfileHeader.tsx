"use client";
import { token } from "@/lib/axios";
import { LogOut } from "lucide-react";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function ProfileSection() {
  const cookies = useCookies();
  const router = useRouter();

  return (
    <>
      <div className="relative flex w-full flex-col overflow-hidden rounded-lg bg-[url('/images/horse-card.png')] bg-cover bg-center bg-no-repeat">
        <div className="absolute left-0 top-0 h-full w-full bg-secondary/80" />
        <div className="z-10 flex w-full flex-row items-center justify-between">
          <div className="flex flex-1"></div>
          <div>
            <Image
              className="h-14"
              alt=" "
              width={200}
              height={200}
              src={"/logos/logo-full.png"}
            />
          </div>
          <div className="flex flex-1 items-end justify-end">
            <button
              onClick={() => {
                if (confirm("Tem certeza que deseja sair?")) {
                  cookies.remove(token);
                  return router.push("/login");
                }
              }}
              className="flex w-max flex-row items-center gap-1 rounded-md p-1 md:h-6 xl:p-2"
            >
              <LogOut className="h-4 w-4 text-white" />
              <span className="text-xs text-white">Sair</span>
            </button>
          </div>
        </div>
        <div className="flex h-[calc(100%-50px)] w-full rounded-lg bg-[url('/HomeHeaderBg4.png')] bg-cover bg-center bg-no-repeat">
          <div className="relative flex h-max w-full flex-col overflow-hidden p-4 md:px-10">
            <div className="relative z-30 w-full rounded-lg bg-white/80 shadow-md xl:mx-auto xl:w-[98%]">
              <div className="z-40 flex h-full w-full flex-col items-start gap-4 p-2 md:flex-row md:justify-between">
                <div className="flex w-full flex-row justify-between gap-4">
                  <Image
                    src="/logos/icon-green.png"
                    alt=""
                    width={100}
                    height={100}
                    className="h-10 w-10 rounded-md object-cover md:h-10 md:w-10"
                  />

                  <div className="text-break flex flex-1 flex-col gap-0">
                    <span className="text-base font-semibold leading-[1] text-[#141414] xl:text-xl">
                      Adm Equinology
                    </span>
                    <span className="text-xs font-semibold text-[#8C8C8C] md:text-sm">
                      Veja informações sobre o Administrativo.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

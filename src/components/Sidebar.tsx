"use client";

import { useSidebarContext } from "@/context/SidebarStatus";
import { Network } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
export function SideBar() {
  const { isOpen, setIsOpen } = useSidebarContext();
  const Router = useRouter();
  const pathname = usePathname();

  // Função para verificar se o botão está ativo (correspondendo à rota atual)
  const isActive = (route: string) =>
    pathname === route || pathname.includes(route);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="fixed z-[1030] h-full w-full bg-black/80 lg:hidden"
        />
      )}
      <div
        className={`z-[1030] h-full min-h-full w-[250px] items-center bg-[#F8F9FA] p-4 transition-transform duration-300 lg:w-1/5 ${
          isOpen
            ? "fixed left-0 translate-x-0 lg:relative"
            : "fixed left-0 -translate-x-full lg:relative lg:translate-x-0"
        } flex-col gap-8 lg:flex`}
      >
        <div className="flex w-full items-center justify-center">
          <Image
            className="mb-4 mt-4 h-auto w-5/6 self-center object-contain md:w-2/3 lg:mb-0 lg:mt-8"
            alt=" "
            width={200}
            height={200}
            src={"/logos/logo-full-green.png"}
          />
        </div>
        <ul className="w-full">
          <button
            className={`flex w-full flex-row items-center gap-2 rounded-md px-2 py-2 font-semibold opacity-50 ${
              isActive("/")
                ? "bg-white text-[14px] text-[#252F40] shadow-md"
                : "text-[12px] text-[#67748E]"
            }`}
            onClick={() => Router.push("/")}
          >
            <div
              className={`flex items-center justify-center rounded-md p-1 ${
                isActive("/")
                  ? "bg-gradient-to-r from-[#FF0080] to-[#7928CA]"
                  : "bg-white"
              }`}
            >
              <Network
                className={`h-3 w-3 transition-all duration-300 lg:h-5 lg:w-5 ${
                  isActive("/") ? "text-white" : "text-[#252F40]"
                }`}
              />
            </div>
            Dashboard
          </button>
        </ul>
      </div>
    </>
  );
}

"use client";

import ClientsTable from "@/components/ClientsTable";
// Importando a fonte Nunito

import { DashBoard } from "@/components/HomeDashBoard";
import { ProfileSection } from "@/components/ProfileHeader";

import { useEffect, useState } from "react";
export default function Analysis() {
  const [animateSection, setAnimateSection] = useState(false);
  useEffect(() => {
    setTimeout(() => setAnimateSection(true), 100);
  }, []);

  return (
    <>
      <div className="relative flex h-full w-full flex-col gap-4 overflow-hidden p-4 pb-24">
        <ProfileSection />

        <div
          className={`flex flex-col gap-4 transition-all duration-300 ${
            animateSection
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <DashBoard />
        </div>

        <div className="flex w-full flex-col">
          <ClientsTable />
        </div>
      </div>
    </>
  );
}

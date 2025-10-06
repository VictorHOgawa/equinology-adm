"use client";

import { createContext, useContext, useState } from "react";

// Interface para o estado de todas as modais
interface ModalsContextProps {
  isActivityModalOpen: boolean;
  setIsActivityModalOpen: (isOpen: boolean) => void;
  isComparisonModalOpen: boolean;
  setIsComparisonModalOpen: (isOpen: boolean) => void;
  isAnotherModalOpen: boolean;
  setIsAnotherModalOpen: (isOpen: boolean) => void;

  // Adicione mais modais conforme necessário
}

const ModalsContext = createContext({} as ModalsContextProps);

interface ProviderProps {
  children: React.ReactNode;
}

// Provider geral que gerencia o estado de todas as modais
export const ModalsProvider = ({ children }: ProviderProps) => {
  // Estado para Activity Modal
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  // Estado para Another Modal
  const [isAnotherModalOpen, setIsAnotherModalOpen] = useState(false);

  // Valor com todos os estados e setters das modais
  const value = {
    isActivityModalOpen,
    setIsActivityModalOpen,
    isComparisonModalOpen,
    setIsComparisonModalOpen,
    isAnotherModalOpen,
    setIsAnotherModalOpen,

    // Adicione mais modais e setters conforme necessário
  };

  return (
    <ModalsContext.Provider value={value}>{children}</ModalsContext.Provider>
  );
};

// Hooks individuais para cada modal
export function useComparisonModal() {
  const { isComparisonModalOpen, setIsComparisonModalOpen } =
    useContext(ModalsContext);
  return { isComparisonModalOpen, setIsComparisonModalOpen };
}
// Hook para Activity Modal
export function useActivityModal() {
  const { isActivityModalOpen, setIsActivityModalOpen } =
    useContext(ModalsContext);
  return { isActivityModalOpen, setIsActivityModalOpen };
}

// Hook para Another Modal
export function useAnotherModal() {
  const { isAnotherModalOpen, setIsAnotherModalOpen } =
    useContext(ModalsContext);
  return { isAnotherModalOpen, setIsAnotherModalOpen };
}

// Adicione mais hooks conforme necessário para outras modais

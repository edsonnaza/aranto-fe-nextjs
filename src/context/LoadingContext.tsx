'use client'
import { createContext, useState, useContext, ReactNode } from "react";

// 1️⃣ Definir el contexto
const LoadingContext = createContext({
  isLoading: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setLoading: (state: boolean) => {},
});

// 2️⃣ Crear el provider
export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// 3️⃣ Hook para acceder al contexto
export const useLoading = () => useContext(LoadingContext);

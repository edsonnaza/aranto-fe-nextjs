"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {  useSession } from "next-auth/react";
 

export function LoginForm() {
  const { data: session, status } = useSession();
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/"); // Redirige si ya está autenticado
    }
  }, [status, router, session]);

  if (status === "loading") {
    return <p className="text-center text-gray-600">Verificando sesión...</p>; // Mostramos solo un mensaje
  }

  if (status === "authenticated") {
    return null; // No renderizamos nada si está autenticado
  }


 

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const response = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      if (response?.error) {
        setError("Credenciales no válidas");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError("Algo anda mal!"+error);
    }
  }
 
  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-100 p-3 rounded text-red-900 text-sm">
          {error}
        </div>
      )}
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Password"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Ingresar
        </button>
      </div>
    </form>
  );
}

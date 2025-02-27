"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function LoginForm() {
  const { data: session, status } = useSession();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true); // Activamos el loading

    const formData = new FormData(event.currentTarget);

    try {
      const response = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      if (response?.error) {
        setError("Credenciales no válidas");
        setIsLoading(false); // Desactivamos el loading si hay error
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError("Algo salió mal: " + error);
      setIsLoading(false); // Desactivamos el loading en caso de error
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-100 p-3 rounded text-red-900 text-sm">{error}</div>
      )}
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Correo electrónico"
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Contraseña"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading} // Deshabilitamos el botón mientras carga
          className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 text-white mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Procesando...
            </div>
          ) : (
            "Ingresar"
          )}
        </button>
      </div>
    </form>
  );
}

"use client";

import React from "react";

interface LoadingButtonProps {
  isLoading: boolean; // Estado de carga
  children: React.ReactNode; // Texto o contenido del botón cuando no está cargando
  disabled?: boolean; // Deshabilitar el botón (por ejemplo, durante carga o sesión)
  className?: string; // Clases adicionales para personalizar el estilo
  type?: "button" | "submit" | "reset"; // Tipo de botón (por defecto "button")
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // Evento opcional para botones no submit
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  disabled = false,
  className = "",
  type = "button",
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`w-full p-3 bg-blue-600 text-white font-bold rounded flex items-center justify-center transition-all duration-200 ${
        isLoading || disabled ? "opacity-75 cursor-not-allowed" : "hover:bg-blue-700"
      } ${className}`}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Enviando...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
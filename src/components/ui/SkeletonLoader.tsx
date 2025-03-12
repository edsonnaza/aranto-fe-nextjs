// components/ui/SkeletonLoader.tsx
import React from "react";

interface SkeletonLoaderProps {
  type?: "table" | "calendar" | "form"; // Tipo de skeleton
  rows?: number; // Número de filas (para tablas)
  columns?: number; // Número de columnas (para tablas)
  fields?: number; // Número de campos (para formularios)
  height?: string; // Altura personalizada (para calendario u otros)
  width?: string; // Ancho personalizado
  className?: string; // Clases adicionales para personalización
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = "table",
  rows = 5,
  columns = 5,
  fields = 6,
  height = "500px",
  width = "100%",
  className = "",
}) => {
  const baseClass = `rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] animate-pulse ${className}`;

  const renderTableSkeleton = () => (
    <div className={baseClass}>
      <div className="overflow-hidden">
        <div className="min-w-[1100px]">
          <div className="border-b border-gray-200 dark:border-gray-700">
            {[...Array(columns)].map((_, colIndex) => (
              <div
                key={colIndex}
                className="inline-block px-4 py-2 bg-gray-300 dark:bg-gray-700 h-8 w-1/5"
              ></div>
            ))}
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {[...Array(rows)].map((_, rowIndex) => (
              <div key={rowIndex} className="flex">
                {[...Array(columns)].map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-700 h-8 w-1/5"
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCalendarSkeleton = () => (
    <div className={baseClass}>
      <div className="custom-calendar">
        <div className="h-[500px] bg-gray-300 dark:bg-gray-700 rounded-lg mb-4" style={{ height, width }}></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-1/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFormSkeleton = () => (
    <div className={baseClass}>
      <div className="max-w-[700px] p-6 lg:p-10 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="space-y-6">
          <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="space-y-4">
            {[...Array(fields)].map((_, index) => (
              <div key={index} className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="flex justify-end space-x-4">
            <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  switch (type) {
    case "calendar":
      return renderCalendarSkeleton();
    case "form":
      return renderFormSkeleton();
    case "table":
    default:
      return renderTableSkeleton();
  }
};

export default SkeletonLoader;
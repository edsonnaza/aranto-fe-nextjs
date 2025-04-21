import React from "react";
import classNames from "classnames";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import { CalendarDateRangeIcon } from "@heroicons/react/24/solid";
interface Event {
  end: string | Date | undefined;
  id: string;
  title?: string;
  start?: string | Date;
  extendedProps: {
    profesionalNombre: string;
    profesional?: string;
    calendar: string;
  };
}

interface AgendaPorProfesionalProps {
  events: Event[];
}

const AgendaPorProfesional: React.FC<AgendaPorProfesionalProps> = ({ events }) => {
  const eventosPorProfesional = events?.reduce<Record<string, Event[]>>((acc, event) => {
    const profesional = event.extendedProps?.profesionalNombre || "Sin profesional";
    if (!acc[profesional]) acc[profesional] = [];
    acc[profesional].push(event);
    return acc;
  }, {});

  const colorMap: Record<string, string> = {
    DISPONIBLE: "bg-green-100",
    OCUPADO: "bg-red-100",
    AGENDADO: "bg-blue-100",
    BLOQUEADO: "bg-yellow-100",
    CANCELADO: "bg-gray-200",
    ELIMINADO: "bg-gray-300",
  };

  if (!events || events.length === 0) {
    return <div className="p-4 text-gray-500">No hay turnos disponibles.</div>;
  }
  

  return (
    <div className="space-y-6 p-4">
      
      {Object.entries(eventosPorProfesional).map(([profesional, eventos]) => (
        <div key={profesional} className="rounded-xl border border-gray-300 shadow-md p-4 bg-white">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {profesional}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventos.map((evento) => (
              <div
                key={evento.id}
                className={classNames(
                  "p-3 rounded-md shadow-sm text-sm border",
                  colorMap[evento.extendedProps.calendar] || "bg-white"
                )}
              >
                <p className="font-medium text-gray-700">{evento.title || "Turno disponible"}</p>
                <p className="text-gray-500">
                {evento.start && evento.end
                ? `${new Date(evento.start).toLocaleDateString("es-PY", {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })} - ${new Date(new Date(evento.start).getTime() + 4 * 60 * 60 * 1000).toLocaleTimeString("es-PY", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })} - ${new Date(new Date(evento.end).getTime() + 4 * 60 * 60 * 1000).toLocaleTimeString("es-PY", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}`
                : "Sin horario"}

                </p>
                <p className="text-gray-500">
                  Estado: {evento.extendedProps.calendar}
                </p>
                {evento.extendedProps?.calendar === "OCUPADO" && (
                  <Link href="/dashboard/agenda">
                    <Button size="sm" className="w-28 mt-2 bg-blue-800 text-white hover:bg-blue-600">
                      Admitir
                      <CalendarDateRangeIcon className="size-6" />
                    </Button>
                  </Link>
                )}
                
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgendaPorProfesional;

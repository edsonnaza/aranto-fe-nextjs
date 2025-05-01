import React from "react";
import CalendarAgendas from "../calendar/CalendarTurnos";
interface Event {
  end: string | Date | undefined;
  id: string;
  title?: string;
  start?: string | Date;
  contacto?: string;
  extendedProps: {
    profesionalNombre: string;
    profesional?: string;
    calendar: string;
    duracionSlot: string;
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

  // if (!events || events.length === 0) {
  //   return <div className="p-4 text-gray-500">No hay turnos disponibles.</div>;
  // }
  
  return (
    <div className="space-y-4 p-4 grid sm:grid-cols-2 lg:grid-cols-2 gap-4  ">
      
      {Object.entries(eventosPorProfesional).map(([profesional, eventos]) => (
        <div key={profesional} className=" rounded-xl border border-gray-300 shadow-md p-4 lg:grid-col-6 bg-white">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {profesional}
          </h3>
          <CalendarAgendas
            initialEvents={eventos.map((evento) => ({
              ...evento,
              extendedProps: {
                ...evento.extendedProps,
                calendar: evento.extendedProps.calendar as
                  | "DISPONIBLE"
                  | "OCUPADO"
                  | "AGENDADO"
                  | "BLOQUEADO"
                  | "CANCELADO"
                  | "ELIMINADO",
              },
            }))}
          />
        </div>
      ))}
    </div>
  );
};

export default AgendaPorProfesional;

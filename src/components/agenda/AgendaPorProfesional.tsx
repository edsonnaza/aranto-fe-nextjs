import React from "react";
import CalendarTurnos from "../calendar/CalendarTurnos";

interface Event {
  id: string;
  start: string | Date;
  end: string | Date;
  title?: string;
  contacto?: string;
  extendedProps: {
    agendaId: string;
    profesionalNombre: string;
    calendar: "DISPONIBLE" | "OCUPADO" | "AGENDADO" | "BLOQUEADO" | "CANCELADO" | "ELIMINADO";
    duracionSlot: string;
    fechaInicio?: string | Date;
    fechaFin?: string | Date;
  };
}

interface AgendaGroup {
  agendaId: string;
  profesionalNombre: string;
  duracionSlot: string;
  eventos: Event[];
}

const AgendaPorAgenda: React.FC<{ events: Event[] }> = ({ events }) => {
  // Agrupar eventos por agendaId de forma segura
  const eventosPorAgenda = events.reduce((acc: Record<string, AgendaGroup>, event) => {
    const { agendaId, profesionalNombre, duracionSlot } = event.extendedProps;
    
    if (!acc[agendaId]) {
      acc[agendaId] = {
        agendaId,
        profesionalNombre,
        duracionSlot,
        eventos: []
      };
    }
    
    acc[agendaId].eventos.push(event);
    return acc;
  }, {});

  // Función para formatear la duración
  const formatDuracion = (duracion: string) => {
    return `${duracion} min`;
  };

  return (
    <div className="space-y-4 p-4 grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
      {Object.values(eventosPorAgenda).map((grupo) => {
        const slotsOcupados = grupo.eventos.filter(e => 
          !["DISPONIBLE"].includes(e.extendedProps.calendar)
        ).length;
        const totalSlots = grupo.eventos.length;
        const porcentajeOcupado = totalSlots > 0 
          ? Math.round((slotsOcupados / totalSlots) * 100) 
          : 0;

        return (
          <div key={grupo.agendaId} className="rounded-xl border border-gray-300 shadow-md p-4 bg-white">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {grupo.profesionalNombre}
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Agenda ID:</strong> {grupo.agendaId}</p>
                <p><strong>Duración slot:</strong> {formatDuracion(grupo.duracionSlot)}</p>
                {grupo.eventos[0]?.extendedProps.fechaInicio && (
                  <p>
                    <strong>Periodo:</strong> 
                    {grupo.eventos[0]?.extendedProps.fechaInicio && grupo.eventos[0]?.extendedProps.fechaFin
                      ? `${new Date(grupo.eventos[0].extendedProps.fechaInicio).toLocaleDateString()} - ${new Date(grupo.eventos[0].extendedProps.fechaFin).toLocaleDateString()}`
                      : "No disponible"}
                  </p>
                )}
                <p>
                  <strong>Ocupación:</strong> {slotsOcupados}/{totalSlots} slots (
                  <span className={porcentajeOcupado > 50 ? 'text-red-500' : 'text-green-500'}>
                    {porcentajeOcupado}%
                  </span>)
                </p>
              </div>
            </div>
            <CalendarTurnos 
              initialEvents={grupo.eventos}
              key={grupo.agendaId}
            />
          </div>
        );
      })}
    </div>
  );
};

export default AgendaPorAgenda;
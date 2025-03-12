// src/app/dashboard/agenda/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import Calendar from "@/components/calendar/CalendarAgendas";
import { formatDate } from "@/lib/utils"; // Importar la función global
 
 
export default async function AgendaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return <div>Error: ID de agenda no proporcionado.</div>;
  }

  const agenda = await prisma.agenda.findUnique({
    where: { id },
    include: {
      slots: {
        include: { paciente: true },
      },
      profesional: true,
    },
  });

  if (!agenda) {
    return <div>Agenda no encontrada</div>;
  }

  // Obtener el nombre del profesional
  const profesionalNombre = agenda.profesional
    ? `${agenda.profesional.nombres} ${agenda.profesional.apellidos}`
    : "Profesional no asignado";

  // Formatear las fechas usando la función global
  const fechaInicio = formatDate(agenda.fechaInicio);
  const fechaFin = formatDate(agenda.fechaFin);

  // Construir el título
  const title = `Agenda: ${profesionalNombre} [${fechaInicio} - ${fechaFin}]`;

  const events = agenda.slots.map((slot) => ({
    id: slot.id,
    title: slot.estado === "DISPONIBLE"
      ? "Disponible"
      : slot.paciente
      ? `${slot.paciente.nombres} ${slot.paciente.apellidos} (${slot.motivoConsulta || "Sin Motivo"})`
      : `Turno (${slot.estado})`,
    start: slot.horarioInicio,
    end: slot.horarioFin,
    extendedProps: {
      calendar: slot.estado,
      profesionalNombre:profesionalNombre,
    },
  }));

  return (
    <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
      <h1 className="text-2xl font-semi-bold mb-4">{title}</h1>
      
        <Calendar initialEvents={events} />
       
      
    </div>
  );
}
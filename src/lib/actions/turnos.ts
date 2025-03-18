'use server';

import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth } from "date-fns";

export async function getPacientesConTurnos() {
  const now = new Date();
  const start = startOfMonth(now); // Inicio del mes actual
  const end = endOfMonth(now);     // Fin del mes actual

  // Obtener slots con pacientes en el mes actual
  const slots = await prisma.agendaSlot.findMany({
    where: {
      estado: { in: ["OCUPADO", "AGENDADO", "DISPONIBLE"] }, // Solo slots ocupados o agendados
      horarioInicio: { gte: start, lte: end },  // Rango del mes actual
    },
    include: {
      paciente: true, // Datos del paciente
      agenda: {
        include: {
          profesional: { select: { nombres: true, apellidos: true } }, // Nombre del profesional
        },
      },
    },
  });

  // Formatear como eventos para FullCalendar
  const events = slots.map((slot) => ({
    id: slot.id,
    start: slot.horarioInicio,
    end: slot.horarioFin,
    title: slot.paciente 
      ? `${slot.paciente.nombres} ${slot.paciente.apellidos} (${slot.motivoConsulta || "Sin motivo"})`
      : "Paciente no disponible",
    extendedProps: {
      calendar: slot.estado, // Estado del slot (OCUPADO, AGENDADO)
      profesionalnombre: `${slot.agenda.profesional.nombres} ${slot.agenda.profesional.apellidos}`, // Nombre del profesional
    },
  }));

  return events;
}
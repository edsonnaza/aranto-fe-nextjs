'use server';

import { prisma } from "@/lib/prisma";
//import { EstadoSlot } from "@prisma/client";
import { addMinutes, eachDayOfInterval } from "date-fns";

console.log("Prisma en agenda.ts:", prisma); // Depuración inicial

// Validar si los días ya están ocupados en otras agendas del profesional
import { DiaSemana, EstadoSlot } from "@prisma/client";

async function validarDiasDisponibles(profesionalId: string, diasNuevos: DiaSemana[]) {
  console.log("Validando días para profesionalId:", profesionalId);
  console.log("prisma.agendaDia:", prisma.agendaDia);

  if (!prisma.agendaDia) {
    throw new Error("prisma.agendaDia no está definido");
  }

  const agendasExistentes = await prisma.agendaDia.findMany({
    where: {
      agenda: { profesionalId },
    },
    select: { diaSemana: true },
  });

  const diasOcupados = new Set(agendasExistentes.map((a) => a.diaSemana));
  const conflictos = diasNuevos.filter((dia) => diasOcupados.has(dia));

  if (conflictos.length > 0) {
    throw new Error(`El profesional ya tiene agenda en estos días: ${conflictos.join(", ")}`);
  }
}

// Función para normalizar nombres de días (eliminar tildes y convertir a mayúsculas)
const normalizeDayName = (day: string): string => {
    const normalized = day
      .toUpperCase()
      .replace(/[ÁÀ]/g, "A")
      .replace(/[ÉÈ]/g, "E")
      .replace(/[ÍÌ]/g, "I")
      .replace(/[ÓÒ]/g, "O")
      .replace(/[ÚÙ]/g, "U");
    const dayMap: { [key: string]: string } = {
      LUNES: "LUNES",
      MARTES: "MARTES",
      MIERCOLES: "MIERCOLES",
      JUEVES: "JUEVES",
      VIERNES: "VIERNES",
      SABADO: "SABADO",
      DOMINGO: "DOMINGO",
    };
    return dayMap[normalized] || normalized;
  };

// Crear la agenda y sus días, ajustado al modelo AgendaDia
async function crearAgenda(
    profesionalId: string,
    fechaInicio: Date,
    fechaFin: Date,
    intervalo: number,
    dias: Record<string, { horaInicio: string; horaFin: string }[]>,
    creadoPorId: string
  ) {
    await validarDiasDisponibles(profesionalId, Object.keys(dias) as DiaSemana[]);
  
    const agenda = await prisma.agenda.create({
      data: {
        profesionalId,
        fechaInicio,
        fechaFin,
        duracionSlot: intervalo,
        creadoPorId,
      },
      select: {
        id: true,
      },
    });
  
    for (const [dia, horarios] of Object.entries(dias)) {
      const manana = horarios[0];
      const tarde = horarios[1];
  
      await prisma.agendaDia.create({
        data: {
          agendaId: agenda.id,
          diaSemana: normalizeDayName(dia) as DiaSemana,
          fechaInicio,
          fechaFin,
          horarioMananaInicio: manana ? new Date(`${fechaInicio.toISOString().split("T")[0]}T${manana.horaInicio}:00`) : null,
          horarioMananaFin: manana ? new Date(`${fechaInicio.toISOString().split("T")[0]}T${manana.horaFin}:00`) : null,
          horarioTardeInicio: tarde ? new Date(`${fechaInicio.toISOString().split("T")[0]}T${tarde.horaInicio}:00`) : null,
          horarioTardeFin: tarde ? new Date(`${fechaInicio.toISOString().split("T")[0]}T${tarde.horaFin}:00`) : null,
        },
      });
    }
  
    await generarSlots(agenda.id);
    return agenda;
  }

// Generar los slots de la agenda basados en los horarios de mañana y tarde
async function generarSlots(agendaId: string) {
  const agenda = await prisma.agenda.findUnique({
    where: { id: agendaId },
    include: { AgendaDia: true }, // Corrección: usar 'AgendaDia' en lugar de 'dias'
  });

  if (!agenda) {
    throw new Error("Agenda no encontrada");
  }

  const slotsToCreate = [];

  for (const dia of agenda.AgendaDia) { // Corrección: usar 'AgendaDia' en lugar de 'dias'
    const fechasValidas = eachDayOfInterval({
      start: agenda.fechaInicio,
      end: agenda.fechaFin,
    }).filter((fecha) => fecha.getDay() === diaSemanaToNumber(dia.diaSemana));

    for (const fecha of fechasValidas) {
      if (dia.horarioMananaInicio && dia.horarioMananaFin) {
        slotsToCreate.push(
          ...generarSlotsParaRango(
            agenda.id,
            fecha,
            dia.horarioMananaInicio,
            dia.horarioMananaFin,
            agenda.duracionSlot
          )
        );
      }
      if (dia.horarioTardeInicio && dia.horarioTardeFin) {
        slotsToCreate.push(
          ...generarSlotsParaRango(
            agenda.id,
            fecha,
            dia.horarioTardeInicio,
            dia.horarioTardeFin,
            agenda.duracionSlot
          )
        );
      }
    }
  }

  if (slotsToCreate.length > 0) {
    await prisma.agendaSlot.createMany({ data: slotsToCreate });
  }

  return { message: "Slots generados correctamente", total: slotsToCreate.length };
}

// Convertir el nombre del día en número (Ej: "LUNES" → 1)
function diaSemanaToNumber(diaSemana: string): number {
  const map: Record<string, number> = {
    DOMINGO: 0,
    LUNES: 1,
    MARTES: 2,
    MIERCOLES: 3,
    JUEVES: 4,
    VIERNES: 5,
    SABADO: 6,
  };
  return map[diaSemana];
}

// Generar slots dentro de un rango horario
function generarSlotsParaRango(
  agendaId: string,
  fecha: Date,
  inicio: Date,
  fin: Date,
  duracion: number
) {
  const slots = [];
  let horaInicio = new Date(fecha);
  horaInicio.setHours(inicio.getHours(), inicio.getMinutes(), 0, 0);

  const horaFin = new Date(fecha);
  horaFin.setHours(fin.getHours(), fin.getMinutes(), 0, 0);

  while (horaInicio < horaFin) {
    const slotFin = addMinutes(horaInicio, duracion);
    if (slotFin > horaFin) break;

    slots.push({
      id: crypto.randomUUID(),
      agendaId,
      horarioInicio: new Date(horaInicio),
      horarioFin: new Date(slotFin),
      estado: "DISPONIBLE" as EstadoSlot,
    });

    horaInicio = slotFin;
  }

  return slots;
}
 
 
  async function getSlotPatientDetails(slotId: string) {
  const slot = await prisma.agendaSlot.findUnique({
    where: { id: slotId },
    include: {
      paciente: true,
    },
  });

  if (!slot) {
    throw new Error("Turno no encontrado");
  }

  if (!slot.pacienteId) {
    return null; // No hay paciente asociado (slot disponible)
  }

  if (!slot.paciente) {
    throw new Error("Paciente no encontrado en el slot");
  }

  console.log("Datos del slot:", { slotId, motivoConsulta: slot.motivoConsulta });

  return {
    nombres: slot.paciente.nombres,
    apellidos: slot.paciente.apellidos,
    contacto: slot.paciente.contacto,
    sexo: slot.paciente.sexo as "HOMBRE" | "MUJER",
    fechaNacimiento: slot.paciente.fechaNacimiento.toISOString().split('T')[0].split('-').reverse().join('-'),
    doc_nro: slot.paciente.doc_nro,
    motivoConsulta: slot.motivoConsulta || "",
  };
}

  async function registrarPacienteEnSlot(
  slotId: string,
  nombres: string,
  apellidos: string,
  contacto: string,
  sexo: "HOMBRE" | "MUJER",
  fechaNacimiento: string,
  motivoConsulta: string,
  asignadoPorId: string,
  doc_nro: string,
  nuevoEstado?: "DISPONIBLE" | "OCUPADO" | "AGENDADO" | "BLOQUEADO" | "CANCELADO" | "ELIMINADO"
) {
  console.log("Iniciando registrarPacienteEnSlot con datos:", {
    slotId,
    nombres,
    apellidos,
    contacto,
    sexo,
    fechaNacimiento,
    motivoConsulta,
    asignadoPorId,
    doc_nro,
    nuevoEstado,
  });

  const [day, month, year] = fechaNacimiento.split("-");
  const fechaNacimientoDate = new Date(`${year}-${month}-${day}`);
  if (isNaN(fechaNacimientoDate.getTime())) {
    console.error("Fecha de nacimiento inválida:", fechaNacimiento);
    throw new Error("Fecha de nacimiento inválida");
  }

  return prisma.$transaction(async (tx) => {
    const slot = await tx.agendaSlot.findUnique({
      where: { id: slotId },
      include: { paciente: true },
    });
    if (!slot) {
      console.error("El slot no existe:", slotId);
      throw new Error("El slot especificado no existe");
    }

    let pacienteId: string | null = slot.pacienteId;

    if (nuevoEstado === "DISPONIBLE" || nuevoEstado === "CANCELADO" || nuevoEstado === "ELIMINADO") {
      pacienteId = null;
    } else {
      let paciente = await tx.paciente.findFirst({
        where: { nombres, apellidos, contacto },
      });

      if (!paciente) {
        // Crear nuevo paciente si no existe
        console.log("Creando nuevo paciente con datos:", { nombres, apellidos, contacto, sexo, fechaNacimiento, doc_nro });
        paciente = await tx.paciente.create({
          data: {
            nombres,
            apellidos,
            contacto,
            email: `${nombres}${apellidos}${Date.now()}@example.com`.replace(/\s/g, "").toLowerCase(),
            direccion: null,
            fechaNacimiento: fechaNacimientoDate,
            sexo,
            doc_nro,
          },
        });
        console.log("Paciente creado con éxito:", paciente);
      } else {
        // Actualizar el paciente existente con los nuevos datos
        console.log("Actualizando paciente existente con datos:", { nombres, apellidos, contacto, sexo, fechaNacimiento, doc_nro });
        paciente = await tx.paciente.update({
          where: { id: paciente.id },
          data: {
            sexo,
            fechaNacimiento: fechaNacimientoDate,
            doc_nro, // Actualizar doc_nro
          },
        });
        console.log("Paciente actualizado con éxito:", paciente);
      }
      pacienteId = paciente.id;
    }

    console.log("Actualizando slot con pacienteId:", pacienteId, "y motivoConsulta:", motivoConsulta);
    const updatedSlot = await tx.agendaSlot.update({
      where: { id: slotId },
      data: {
        estado: nuevoEstado || "OCUPADO",
        paciente: pacienteId ? { connect: { id: pacienteId } } : { disconnect: true },
        asignadoPor: asignadoPorId ? { connect: { id: asignadoPorId } } : { disconnect: true },
        motivoConsulta: nuevoEstado === "DISPONIBLE" || nuevoEstado === "CANCELADO" || nuevoEstado === "ELIMINADO" ? null : motivoConsulta,
      },
      include: { agenda: true },
    });

    console.log("Turno actualizado con éxito:", updatedSlot);

    return updatedSlot;
  }, {
    timeout: 10000,
  }).catch((error) => {
    console.error("Error en la transacción:", error);
    throw error;
  });
}

 

  // Buscar pacientes
     async function buscarPacientesPorNombre(nombre: string) {
    if (!nombre || nombre.length < 2) {
      return []; // No buscar si el nombre es muy corto
    }
  
    const pacientes = await prisma.paciente.findMany({
      where: {
        nombres: {
          contains: nombre,
          mode: "insensitive", // Búsqueda case-insensitive
        },
      },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        contacto: true,
        sexo: true,
        fechaNacimiento: true,
        doc_nro:true
      },
      take: 5, // Limitar a 5 resultados para mejor rendimiento
    });
  
    return pacientes;
  }

  export { crearAgenda, generarSlots, registrarPacienteEnSlot, buscarPacientesPorNombre, getSlotPatientDetails };
import { NextRequest, NextResponse } from "next/server";
import { crearAgenda } from "@/lib/actions/agenda";

// Tipo para validar el cuerpo de la solicitud
interface AgendaRequestBody {
  profesionalId: string;
  fechaInicio: string;
  fechaFin: string;
  intervalo: number;
  dias: Record<string, { horaInicio: string; horaFin: string }[]>;
  creadoPorId: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: AgendaRequestBody = await req.json();

    // Validaciones básicas
    const requiredFields: (keyof AgendaRequestBody)[] = [
      "profesionalId",
      "fechaInicio",
      "fechaFin",
      "intervalo",
      "dias",
      "creadoPorId",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `El campo '${field}' es obligatorio` },
          { status: 400 }
        );
      }
    }

    // Validar fechas
    const fechaInicio = new Date(body.fechaInicio);
    const fechaFin = new Date(body.fechaFin);
    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      return NextResponse.json({ error: "Las fechas proporcionadas no son válidas" }, { status: 400 });
    }
    if (fechaInicio >= fechaFin) {
      return NextResponse.json(
        { error: "La fecha de inicio debe ser menor a la fecha de fin" },
        { status: 400 }
      );
    }

    // Validar el formato de 'dias'
    if (typeof body.dias !== "object" || Array.isArray(body.dias)) {
      return NextResponse.json(
        { error: "El campo 'dias' debe ser un objeto con días y horarios" },
        { status: 400 }
      );
    }
    for (const [dia, horarios] of Object.entries(body.dias)) {
      if (!Array.isArray(horarios)) {
        return NextResponse.json(
          { error: `Los horarios para el día '${dia}' deben ser un arreglo` },
          { status: 400 }
        );
      }
      for (const horario of horarios) {
        if (!horario.horaInicio || !horario.horaFin) {
          return NextResponse.json(
            { error: `Cada horario en '${dia}' debe tener 'horaInicio' y 'horaFin'` },
            { status: 400 }
          );
        }
        // Opcional: Validar formato de hora (ej. HH:MM)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(horario.horaInicio) || !timeRegex.test(horario.horaFin)) {
          return NextResponse.json(
            { error: `Formato de hora inválido en '${dia}' (esperado HH:MM)` },
            { status: 400 }
          );
        }
      }
    }

    // Crear la agenda
    const nuevaAgenda = await crearAgenda(
      body.profesionalId,
      fechaInicio,
      fechaFin,
      body.intervalo,
      body.dias,
      body.creadoPorId
    );

    return NextResponse.json({ message: "Agenda creada con éxito", agenda: nuevaAgenda }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error al crear la agenda:", error);
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
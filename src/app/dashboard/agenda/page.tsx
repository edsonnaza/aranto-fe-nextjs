// dashboard/agenda/page.tsx
import { prisma } from "@/lib/prisma";
import AgendaTable from "@/components/agenda/AgendaTable";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import { formatDate } from "@/lib/utils"
import { Suspense } from "react";
import { CalendarDateRangeIcon } from "@heroicons/react/24/solid";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

export default async function AgendaPage() {
  // Obtener todas las agendas desde Prisma
  const agendas = await prisma.agenda.findMany({
    include: {
      profesional: { select: { nombres: true, apellidos: true } }, // Datos del profesional
      slots: { select: { estado: true } }, // Slots para contar disponibles
    },
  });

  // Transformar los datos para AgendaTable
  const agendaData = agendas.map((agenda) => ({
    id: agenda.id,
    profesional: `${agenda.profesional.nombres} ${agenda.profesional.apellidos}`,
    fechaInicio: formatDate(agenda.fechaInicio), // Formato YYYY-MM-DD
    fechaFin: formatDate(agenda.fechaFin) ,
    status: "Activa", // Puedes definir una lógica para el estado (ej. basado en fechas)
    slotsDisponibles: agenda.slots.filter((slot) => slot.estado === "DISPONIBLE").length,
    slotsTotales: agenda.slots.length,
    duracionSlot: agenda.slots.length > 0 ? agenda.duracionSlot.toString() : "0", // Asignar la duración del slot
  }));

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <Link href="/dashboard/agenda/crear">
      <Button size="md"   className="w-44">
        Crear Agenda 
        <CalendarDateRangeIcon className="size-6"/>
      </Button>
      </Link>
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <Suspense fallback={<SkeletonLoader type="table" columns={7} rows={5} />}> 
         <AgendaTable agendas={agendaData}  isLoading = {false}/>
        </Suspense>
      </div>
    </div>
  );
}
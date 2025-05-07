import Link from "next/link";
import Button from "@/components/ui/button/Button";
import { Suspense } from "react";
import { CalendarDateRangeIcon } from "@heroicons/react/24/solid";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { getTurnosDelDia } from "@/lib/actions/turnos";
import AgendaPorProfesional from "@/components/agenda/AgendaPorProfesional";
import { calculateSlotDuration } from "@/lib/utils"; 

export default async function AgendaPage() {
  const events = (await getTurnosDelDia()).map(event => ({
    ...event,
    extendedProps: {
      ...event.extendedProps,
      duracionSlot: calculateSlotDuration(event.start, event.end),
    },
  }));

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <Link href="/dashboard/agenda">
      <Button size="md"   className="w-44">
        Ver Agenda 
        <CalendarDateRangeIcon className="size-6"/>
      </Button>
      </Link>
      <div className="col-span-12 space-y-6 xl:col-span-12">
      <Suspense fallback={<SkeletonLoader />}>
        <AgendaPorProfesional events={events} />
      </Suspense>
  
      </div>
    </div>
  );
}
 import { getProfesionales } from "@/lib/actions/profesionales";
 import CrearAgenda from "@/components/agenda/crearAgenda";
 import { Suspense } from "react";
 import SkeletonLoader from "@/components/ui/SkeletonLoader";
 export default async function CrearAgendaPage() {

    const profesionales = await getProfesionales();

    return <> 
               <Suspense fallback={<SkeletonLoader />}>
                <CrearAgenda profesionales={profesionales} />
               </Suspense>
           </>


    
 }
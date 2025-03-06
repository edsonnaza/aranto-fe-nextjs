 import { getProfesionales } from "@/lib/actions/profesionales";
 import CrearAgenda from "@/components/agenda/crearAgenda";

 export default async function CrearAgendaPage() {

    const profesionales = await getProfesionales();

    return <CrearAgenda profesionales = {profesionales}/>


    
 }
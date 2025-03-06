// components/Calendar/Calendar.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { EventInput, EventClickArg, EventContentArg } from "@fullcalendar/core";
import esLocale from "@fullcalendar/core/locales/es";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { registrarPacienteEnSlot, buscarPacientesPorNombre, getSlotPatientDetails } from "@/lib/actions/agenda";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import LoadingButton from "../ui/button/LoadingButton";

interface CalendarEvent extends EventInput {
  id: string;
  extendedProps: {
    calendar: "DISPONIBLE" | "OCUPADO" | "AGENDADO" | "BLOQUEADO" | "CANCELADO" | "ELIMINADO";
  };
}

interface PacienteSuggestion {
  id: string;
  nombres: string;
  apellidos: string;
  contacto: string;
  sexo: "HOMBRE" | "MUJER";
  fechaNacimiento: Date;
  doc_nro:string;
  motivoConsulta:string;
}

type EstadoSlot = "DISPONIBLE" | "OCUPADO" | "AGENDADO" | "BLOQUEADO" | "CANCELADO" | "ELIMINADO";

interface CalendarProps {
  initialEvents: CalendarEvent[];
}

// interface PatientData {
//   nombres: string;
//   apellidos: string;
//   contacto: string;
//   sexo: "HOMBRE" | "MUJER";
//   fechaNacimiento: string;
//   doc_nro: string;
//   motivoConsulta: string; // Añadimos motivoConsulta al tipo
// }

const CalendarAgendas: React.FC<CalendarProps> = ({ initialEvents }) => {
  const calendarRef = useRef<FullCalendar>(null);
  const { data: session } = useSession();
  const asignadoPorId = session?.user?.id;

  const [selectedSlot, setSelectedSlot] = useState<CalendarEvent | null>(null);
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [contacto, setContacto] = useState("");
  const [sexo, setSexo] = useState<"HOMBRE" | "MUJER" | "">("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [motivoConsulta, setMotivoConsulta] = useState("");
  const [docNro, setDocNro] = useState("");
  const [nuevoEstado, setNuevoEstado] = useState<EstadoSlot>("OCUPADO");
  const [isLoading, setIsLoading] = useState(false);
  const [sugerencias, setSugerencias] = useState<PacienteSuggestion[]>([]);
  const { isOpen, openModal, closeModal } = useModal();
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  useEffect(() => {
    console.log("Initial events:", initialEvents); // Depuración
    const fetchSugerencias = async () => {
      if (nombres.length >= 2) {
        const resultados = await buscarPacientesPorNombre(nombres) as PacienteSuggestion[];
        setSugerencias(resultados);
      } else {
        setSugerencias([]);
      }
    };
    fetchSugerencias();
  }, [initialEvents, nombres]);

  const handleEventClick = async (clickInfo: EventClickArg) => {
    const slot = clickInfo.event as unknown as CalendarEvent;
    console.log("Turno seleccionado:", slot); // Depuración
    setSelectedSlot(slot);

    if (slot.extendedProps.calendar !== "DISPONIBLE") {
      try {
        const patientData = await getSlotPatientDetails(slot.id);
        console.log('getSlotPatientDetails',{patientData})
        if (patientData) {
          const { nombres, apellidos, contacto, sexo, fechaNacimiento, doc_nro, motivoConsulta } = patientData;
          setNombres(nombres);
          setApellidos(apellidos);
          setContacto(contacto);
          setSexo(sexo);
          setFechaNacimiento(fechaNacimiento);
          setDocNro(doc_nro);
          setMotivoConsulta(motivoConsulta);
          setNuevoEstado(slot.extendedProps.calendar);
        } else {
          setNombres("");
          setApellidos("");
          setContacto("");
          setSexo("");
          setFechaNacimiento("");
          setDocNro("");
          setMotivoConsulta("");
          setNuevoEstado(slot.extendedProps.calendar);
        }
      } catch (error) {
        console.error("Error al cargar los datos del paciente:", error);
        toast.error("No se pudieron cargar los datos del paciente");
        setNombres("");
        setApellidos("");
        setContacto("");
        setSexo("");
        setFechaNacimiento("");
        setDocNro("");
        setMotivoConsulta("");
        setNuevoEstado(slot.extendedProps.calendar);
      }
    } else {
      setNombres("");
      setApellidos("");
      setContacto("");
      setSexo("");
      setFechaNacimiento("");
      setDocNro("");
      setMotivoConsulta("");
      setNuevoEstado("OCUPADO");
    }

    setSugerencias([]);
    openModal();
  };

  const handleSeleccionarSugerencia = (paciente: PacienteSuggestion) => {
    setNombres(paciente.nombres);
    setApellidos(paciente.apellidos);
    setContacto(paciente.contacto);
    setSexo(paciente.sexo);
    setFechaNacimiento(
      paciente.fechaNacimiento.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).split("/").join("-")
    );
    setDocNro(paciente.doc_nro); // Podrías incluir doc_nro en PacienteSuggestion si está disponible
    setMotivoConsulta(paciente.motivoConsulta)
    setSugerencias([]);
  };

  const handleRegistrarPaciente = async () => {
    if (!selectedSlot || !asignadoPorId) {
      toast.error("Faltan datos básicos para registrar el cambio");
      return;
    }
    if ((nuevoEstado === "OCUPADO" || nuevoEstado === "AGENDADO") && (!nombres || !apellidos || !contacto || !sexo || !fechaNacimiento || !motivoConsulta || !docNro)) {
      toast.error("Faltan datos del paciente para estado OCUPADO o AGENDADO");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Enviando datos a registrarPacienteEnSlot:", {
        slotId: selectedSlot.id,
        nombres, apellidos, contacto, sexo, fechaNacimiento, motivoConsulta, asignadoPorId, docNro, nuevoEstado,
      });
      const updatedSlot = await registrarPacienteEnSlot(
        selectedSlot.id,
        nombres,
        apellidos,
        contacto,
        sexo || "HOMBRE",
        fechaNacimiento,
        motivoConsulta,
        asignadoPorId,
        docNro,
        nuevoEstado
      );

      console.log("Updated slot returned:", updatedSlot); // Depuración
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === updatedSlot.id
            ? {
                ...event,
                title: nuevoEstado === "DISPONIBLE" || nuevoEstado === "CANCELADO" || nuevoEstado === "ELIMINADO"
                  ? "Disponible"
                  : `${nombres} ${apellidos} (${motivoConsulta})`,
                extendedProps: { calendar: nuevoEstado },
              }
            : event
        )
      );

      toast.success("Turno actualizado con éxito");
      console.log("Cerrando el modal..."); // Log de depuración
      closeModal();
    } catch (error) {
      toast.error("Error al actualizar el slot");
      console.error("Error en handleRegistrarPaciente:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          eventOverlap={false}
          plugins={[dayGridPlugin, timeGridPlugin]}
          slotDuration="00:30:00"
          slotLabelInterval="00:30"
          ref={calendarRef}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          eventContent={renderEventContent}
          slotMinTime="05:00:00"
          slotMaxTime="23:00:00"
          allDaySlot={false}
          locale={esLocale}
          buttonText={{
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
          }}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          eventClick={handleEventClick}
        />
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 lg:p-10">
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              Gestionar Turno
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Registra un paciente o cambia el estado del turno
            </p>
          </div>
          <div className="mt-8">
            <div className="relative">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Nombres *
              </label>
              <input
                id="paciente-nombres"
                type="text"
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                placeholder="Ej. Juan"
                disabled={nuevoEstado === "CANCELADO" || nuevoEstado === "ELIMINADO"}
              />
              {sugerencias.length > 0 && !(nuevoEstado === "CANCELADO" || nuevoEstado === "ELIMINADO") && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto dark:bg-gray-900 dark:border-gray-700">
                  {sugerencias.map((paciente) => (
                    <li
                      key={paciente.id}
                      onClick={() => handleSeleccionarSugerencia(paciente)}
                      className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer dark:text-white/90 dark:hover:bg-gray-800"
                    >
                      {paciente.nombres} {paciente.apellidos} ({paciente.contacto})
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Apellidos *
              </label>
              <input
                id="paciente-apellidos"
                type="text"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                placeholder="Ej. Pérez"
                disabled={nuevoEstado === "CANCELADO" || nuevoEstado === "ELIMINADO"}
              />
            </div>
            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Contacto *
              </label>
              <input
                id="paciente-contacto"
                type="text"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                placeholder="Ej. 123456789"
                disabled={nuevoEstado === "CANCELADO" || nuevoEstado === "ELIMINADO"}
              />
            </div>
            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Número de Documento *
              </label>
              <input
                id="paciente-doc-nro"
                type="text"
                value={docNro}
                onChange={(e) => setDocNro(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                placeholder="Ej. 12345678"
                disabled={nuevoEstado === "CANCELADO" || nuevoEstado === "ELIMINADO"}
              />
            </div>
            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Sexo *
              </label>
              <div className="flex gap-6">
                <label className="flex items-center text-sm text-gray-700 dark:text-gray-400">
                  <input
                    type="radio"
                    value="HOMBRE"
                    checked={sexo === "HOMBRE"}
                    onChange={() => setSexo("HOMBRE")}
                    className="mr-2"
                    disabled={nuevoEstado === "CANCELADO" || nuevoEstado === "ELIMINADO"}
                  />
                  Hombre
                </label>
                <label className="flex items-center text-sm text-gray-700 dark:text-gray-400">
                  <input
                    type="radio"
                    value="MUJER"
                    checked={sexo === "MUJER"}
                    onChange={() => setSexo("MUJER")}
                    className="mr-2"
                    disabled={nuevoEstado === "CANCELADO" || nuevoEstado === "ELIMINADO"}
                  />
                  Mujer
                </label>
              </div>
            </div>
            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Fecha de Nacimiento (dd-mm-yyyy) *
              </label>
              <input
                id="paciente-fecha-nacimiento"
                type="date"
                value={fechaNacimiento.split("-").reverse().join("-")}
                onChange={(e) => setFechaNacimiento(e.target.value.split("-").reverse().join("-"))}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                disabled={nuevoEstado === "CANCELADO" || nuevoEstado === "ELIMINADO"}
                required
              />
            </div>
            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Motivo de Consulta
              </label>
              <input
                id="motivo-consulta"
                type="text"
                value={motivoConsulta}
                onChange={(e) => setMotivoConsulta(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                placeholder="Ej. Consulta general"
                disabled={nuevoEstado === "CANCELADO" || nuevoEstado === "ELIMINADO"}
              />
            </div>
            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Estado *
              </label>
              <select
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value as EstadoSlot)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option value="DISPONIBLE">Disponible</option>
                <option value="OCUPADO">Ocupado</option>
                <option value="AGENDADO">Agendado</option>
                <option value="BLOQUEADO">Bloqueado</option>
                <option value="CANCELADO">Cancelado</option>
                <option value="ELIMINADO">Eliminado</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Cancelar
            </button>
            <LoadingButton
              type="button"
              isLoading={isLoading}
              onClick={handleRegistrarPaciente}
              className="bg-brand-500 hover:bg-brand-600"
            >
              Guardar
            </LoadingButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const calendarType = eventInfo.event.extendedProps.calendar;
 // console.log("Rendering event:", eventInfo.event); // Depuración
  const colorMap: { [key: string]: string } = {
    DISPONIBLE: "bg-green-200 text-black",
    OCUPADO: "bg-red-200 text-black",
    AGENDADO: "bg-blue-200 text-black",
    BLOQUEADO: "bg-yellow-200 text-black",
    CANCELADO: "bg-gray-200 text-black",
    ELIMINADO: "bg-gray-300 text-black",
  };
  const eventClass = colorMap[calendarType] || "bg-gray-200 text-white";

  return (
    <div className={`p-2 rounded ${eventClass}`}>
      <strong>{eventInfo.timeText}:</strong> {eventInfo.event.title}
    </div>
  );
};

export default CalendarAgendas;
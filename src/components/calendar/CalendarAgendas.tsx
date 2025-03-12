"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
 
import { EventInput, EventClickArg, EventContentArg } from "@fullcalendar/core";
import esLocale from "@fullcalendar/core/locales/es";
import { Modal } from "@/components/ui/modal";
import { registrarPacienteEnSlot, buscarPacientesPorNombre, getSlotPatientDetails } from "@/lib/actions/agenda";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import LoadingButton from "../ui/button/LoadingButton";
import { formatDate } from "@/lib/utils";
import "moment/locale/es"; // Importa el idioma español
import "moment-timezone"; // Importa la zona horaria
import moment from "moment";

// Configurar moment en español
moment.locale("es");
 

 

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
  doc_nro: string;
}

type EstadoSlot = "DISPONIBLE" | "OCUPADO" | "AGENDADO" | "BLOQUEADO" | "CANCELADO" | "ELIMINADO";

interface CalendarProps {
  initialEvents: CalendarEvent[];
}

const CalendarAgendas: React.FC<CalendarProps> = ({ initialEvents }) => {
  const calendarRef = useRef<FullCalendar>(null);
  const { data: session } = useSession();
  const asignadoPorId = session?.user?.id;

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    contacto: "",
    sexo: "",
    fechaNacimiento: "",
    motivoConsulta: "",
    docNro: "",
  });
  const [nuevoEstado, setNuevoEstado] = useState<EstadoSlot>("OCUPADO");
  const [isLoading, setIsLoading] = useState(false);
  const [sugerencias, setSugerencias] = useState<PacienteSuggestion[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<CalendarEvent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  
  useEffect(() => {
    const fetchSugerencias = async () => {
      if (formData.nombres.length >= 2) {
        const resultados = await buscarPacientesPorNombre(formData.nombres) as PacienteSuggestion[];
        setSugerencias(resultados);
      } else {
        setSugerencias([]);
      }
    };
    fetchSugerencias();
  }, [formData.nombres]);

  useEffect(() => {
    console.log("isLoading changed:", isLoading);
  }, [isLoading]);

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    console.log("Cerrando modal, isLoading antes de cerrar:", isLoading);
    setIsOpen(false);
    setFormData({
      nombres: "",
      apellidos: "",
      contacto: "",
      sexo: "",
      fechaNacimiento: "",
      docNro: "",
      motivoConsulta: "",
    });
    setSugerencias([]);
    // No reiniciamos isLoading aquí, lo manejamos en handleRegistrarPaciente
  };

  const handleEventClick = async (clickInfo: EventClickArg) => {
    console.log("handleEventClick iniciado");
    const slot = clickInfo.event as unknown as CalendarEvent;
    setSelectedSlot(slot);

    const initialFormData = {
      nombres: "",
      apellidos: "",
      contacto: "",
      sexo: "",
      fechaNacimiento: "",
      docNro: "",
      motivoConsulta: "",
    };

    if (slot.extendedProps.calendar !== "DISPONIBLE") {
      try {
        const patientData = await getSlotPatientDetails(slot.id);
        if (patientData) {
          setFormData({
            ...patientData,
            docNro: patientData.doc_nro,
          });
          setNuevoEstado(slot.extendedProps.calendar);
        } else {
          setFormData(initialFormData);
          setNuevoEstado(slot.extendedProps.calendar);
        }
      } catch (error) {
        toast.error("No se pudieron cargar los datos del paciente: " + error);
        setFormData(initialFormData);
        setNuevoEstado(slot.extendedProps.calendar);
      }
    } else {
      setFormData(initialFormData);
      setNuevoEstado("OCUPADO");
    }

    setSugerencias([]);
    openModal();
    console.log("handleEventClick finalizado");
  };

  const handleSeleccionarSugerencia = (paciente: PacienteSuggestion) => {
    setFormData({
      ...formData,
      nombres: paciente.nombres,
      apellidos: paciente.apellidos,
      contacto: paciente.contacto,
      sexo: paciente.sexo,
      fechaNacimiento: formatDate(paciente.fechaNacimiento),
      docNro: paciente.doc_nro,
    });
    setSugerencias([]);
  };

  const handleRegistrarPaciente = async () => {
    console.log("Iniciando handleRegistrarPaciente, isLoading:", isLoading);
    if (!selectedSlot || !asignadoPorId) {
      toast.error("Faltan datos básicos para registrar el cambio");
      setIsLoading(false);
      return;
    }

    const requiredFields = [
      formData.nombres,
      formData.apellidos,
      formData.contacto,
      formData.sexo,
      formData.fechaNacimiento,
      formData.motivoConsulta,
      formData.docNro,
    ];
    if ((nuevoEstado === "OCUPADO" || nuevoEstado === "AGENDADO") && requiredFields.some((field) => !field)) {
      toast.error("Faltan datos del paciente para estado OCUPADO o AGENDADO");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      console.log("Enviando datos a registrarPacienteEnSlot:", {
        slotId: selectedSlot.id,
        ...formData,
        asignadoPorId,
        nuevoEstado,
      });
      const updatedSlot = await registrarPacienteEnSlot(
        selectedSlot.id,
        formData.nombres,
        formData.apellidos,
        formData.contacto,
        (formData.sexo === "HOMBRE" || formData.sexo === "MUJER" ? formData.sexo : "HOMBRE"),
        formData.fechaNacimiento,
        formData.motivoConsulta,
        asignadoPorId,
        formData.docNro,
        nuevoEstado
      );

      console.log("Updated slot returned:", updatedSlot);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === updatedSlot.id
            ? {
                ...event,
                title:
                  nuevoEstado === "DISPONIBLE" || nuevoEstado === "CANCELADO" || nuevoEstado === "ELIMINADO"
                    ? "Disponible"
                    : `${formData.nombres} ${formData.apellidos} (${formData.motivoConsulta})`,
                extendedProps: { calendar: nuevoEstado },
              }
            : event
        )
      );

      toast.success("Turno actualizado con éxito");
      closeModal();
    } catch (error) {
      toast.error("Error al actualizar el slot: " + (error instanceof Error ? error.message : String(error)));
      console.error("Error en handleRegistrarPaciente:", error);
    } finally {
      console.log("Finalizando handleRegistrarPaciente, reiniciando isLoading");
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
          timeZone="PY"
          ref={calendarRef}
          initialView="timeGridDay"
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
          dayMaxEvents={3} // Muestra hasta 3 eventos antes de mostrar "+X más"
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
                value={formData.nombres}
                onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
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
                value={formData.apellidos}
                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
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
                value={formData.contacto}
                onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
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
                value={formData.docNro}
                onChange={(e) => setFormData({ ...formData, docNro: e.target.value })}
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
                    checked={formData.sexo === "HOMBRE"}
                    onChange={() => setFormData({ ...formData, sexo: "HOMBRE" })}
                    className="mr-2"
                    disabled={nuevoEstado === "CANCELADO" || nuevoEstado === "ELIMINADO"}
                  />
                  Hombre
                </label>
                <label className="flex items-center text-sm text-gray-700 dark:text-gray-400">
                  <input
                    type="radio"
                    value="MUJER"
                    checked={formData.sexo === "MUJER"}
                    onChange={() => setFormData({ ...formData, sexo: "MUJER" })}
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
                value={formData.fechaNacimiento.split("-").reverse().join("-")}
                onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value.split("-").reverse().join("-") })}
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
                value={formData.motivoConsulta}
                onChange={(e) => setFormData({ ...formData, motivoConsulta: e.target.value })}
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
              disabled={isLoading || !formData.nombres || !formData.apellidos || !formData.contacto || !formData.sexo || !formData.fechaNacimiento || !formData.motivoConsulta || !formData.docNro}
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

  const colorMap: { [key: string]: string } = {
    DISPONIBLE: "bg-green-200 text-black",
    OCUPADO: "bg-red-200 text-white",
    AGENDADO: "bg-blue-200 text-white",
    BLOQUEADO: "bg-yellow-200 text-black",
    CANCELADO: "bg-gray-200 text-black",
    ELIMINADO: "bg-gray-300 text-black",
  };

  const eventClass = colorMap[calendarType] || "bg-gray-200 text-black";

  return (
    <div
      title={`${eventInfo.event.extendedProps.profesionalNombre}: ${eventInfo.event.title}  |  ${moment(eventInfo.event.endStr).tz("America/Asuncion")
    .format("dddd D [de] MMMM [a las] HH:mm")}}`}
      className={`p-2 rounded-md ${eventClass} flex items-center gap-2 text-sm font-medium cursor-pointer`}
    >
      <strong>{eventInfo.timeText}:</strong> {eventInfo.event.title}
    </div>
  );
};

 

export default CalendarAgendas;
"use client";
import { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import ComponentCard from "../common/ComponentCard";
import { crearAgenda } from "@/lib/actions/agenda";
import { useSession } from "next-auth/react";
import { toast, Bounce } from "react-toastify";
import LoadingButton from "../ui/button/LoadingButton";
import Link from "next/link";
import SkeletonLoader from "../ui/SkeletonLoader";

const CrearAgenda = ({ profesionales }: { profesionales: { id: string; nombres: string; apellidos: string }[] }) => {
  const { data: session, status } = useSession();
  const creadoPorId = session?.user?.id;

  const className = "max-w-lg mx-auto p-6";
  const [profesional, setProfesional] = useState("");
  const [dias, setDias] = useState<string[]>([]);
  const [intervalo, setIntervalo] = useState(15);
  const [horarios, setHorarios] = useState<{ [key: string]: { manana?: string; tarde?: string } }>({});
  const [fechaFin, setFechaFin] = useState<Date | undefined>(undefined);
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>(undefined);
  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const intervalosDisponibles = [5, 10, 15, 20, 30, 45, 60];
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setProfesional("");
    setDias([]);
    setIntervalo(15);
    setHorarios({});
    setFechaInicio(undefined);
    setFechaFin(undefined);
    setErrors([]);
    setIsLoading(false); // Reiniciar isLoading al resetear el formulario
  };

  const toggleDia = (dia: string) => {
    setDias((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]));
  };

  const handleHorarioChange = (dia: string, turno: "manana" | "tarde", value: string) => {
    setHorarios((prev) => ({
      ...prev,
      [dia]: { ...prev[dia], [turno]: value },
    }));
  };

  const validarHorario = (startTime: string, endTime: string): boolean => {
    if (!startTime || !endTime) return true; // Si falta algún valor, no validar aún
    return startTime < endTime; // Start Time debe ser menor a End Time
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Iniciando handleSubmit, isLoading:", isLoading); // Depuración
    setIsLoading(true); // Activar el spinner

    const newErrors: string[] = [];

    if (status === "loading") {
      newErrors.push("Esperando a que cargue la sesión...");
    } else if (!creadoPorId) {
      newErrors.push("No se pudo obtener el ID del usuario autenticado");
    }
    if (!profesional) newErrors.push("Debe seleccionar un profesional");
    if (!fechaInicio) newErrors.push("La fecha de inicio es requerida");
    if (!fechaFin) newErrors.push("La fecha de fin es requerida");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      console.log("Errores encontrados, isLoading:", isLoading); // Depuración
      setIsLoading(false); // Desactivar isLoading si hay errores
      return;
    }

    setErrors([]);
    try {
      const transformedHorarios = Object.entries(horarios).reduce(
        (acc, [dia, { manana, tarde }]) => {
          acc[dia] = [];
          if (manana) {
            const [horaInicio, horaFin] = manana.split("-");
            acc[dia].push({ horaInicio, horaFin });
          }
          if (tarde) {
            const [horaInicio, horaFin] = tarde.split("-");
            acc[dia].push({ horaInicio, horaFin });
          }
          return acc;
        },
        {} as Record<string, { horaInicio: string; horaFin: string }[]>
      );

      if (fechaInicio && fechaFin) {
        console.log("Llamando a crearAgenda con datos:", { profesional, fechaInicio, fechaFin, intervalo, transformedHorarios, creadoPorId });
        await crearAgenda(profesional, fechaInicio, fechaFin, intervalo, transformedHorarios, creadoPorId!);
        toast.success(
          <div>
            Agenda creada con éxito!{" "}
            <Link href="/dashboard/agenda" className="text-blue-500 underline">
              Ver agendas  {transformedHorarios? JSON.stringify(transformedHorarios) : ""}
            </Link>
          </div>,
          {
            transition: Bounce,
          }
        );
        resetForm(); // Limpiar el formulario
      } else {
        setErrors(["Las fechas de inicio y fin son requeridas"]);
      }
    } catch (error) {
      const errorMessage = (error as Error).message || "Error al crear la agenda";
      setErrors([errorMessage]);
      toast.error(errorMessage, {
        transition: Bounce,
      });
      console.error("Error en crearAgenda:", error);
    } finally {
      console.log("Finalizando handleSubmit, isLoading:", isLoading); // Depuración
      setIsLoading(false); // Desactivar el spinner siempre
    }
  };

  function convertToDate(timeStr: string) {
    const [hours, minutes] = timeStr.split(":");
    const now = new Date();
    now.setHours(parseInt(hours));
    now.setMinutes(parseInt(minutes));
    now.setSeconds(0);
    return now;
  }
  

  if (isLoading) {
    return <SkeletonLoader type="form" fields={6} />;
  }

  return (
    <ComponentCard className={className} title="Crear Nueva Agenda">
      <form onSubmit={handleSubmit}>
        {errors.length > 0 && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <label className="block mb-2">
          Profesional:
          <select value={profesional} onChange={(e) => setProfesional(e.target.value)} className="w-full p-2 border rounded">
            <option value="">Seleccione un profesional</option>
            {profesionales.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombres} {item.apellidos}
              </option>
            ))}
          </select>
        </label>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Días disponibles:</h3>
          {diasSemana.map((dia) => (
            <label key={dia} className="block">
              <input type="checkbox" checked={dias.includes(dia)} onChange={() => toggleDia(dia)} className="mr-2" />
              {dia}
            </label>
          ))}
        </div>

        <label className="block mb-4">
          Intervalo de atención (min):
          <select value={intervalo} onChange={(e) => setIntervalo(Number(e.target.value))} className="w-full p-2 border rounded">
            {intervalosDisponibles.map((int) => (
              <option key={int} value={int}>
                {int} minutos
              </option>
            ))}
          </select>
        </label>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Fecha de Inicio:</h3>
          <Flatpickr
            value={fechaInicio}
            onChange={(date) => setFechaInicio(date[0])}
            options={{ dateFormat: "Y-m-d", minDate: fechaInicio || "today" }}
            className="border rounded-lg p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Fecha de Fin:</h3>
          <Flatpickr
            value={fechaFin}
            onChange={(date) => setFechaFin(date[0])}
            options={{ dateFormat: "Y-m-d", minDate: fechaInicio || "today" }}
            className="border rounded-lg p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Horarios disponibles:</h3>
          {dias.map((dia) => (
            <div key={dia} className="mb-3 ring-1 ring-blue-500 p-4 rounded-sm">
              <h4 className="font-bold mb-2">{dia}</h4>
              <label className="block">
                Mañana Hora Inicio/Fin: 
                <div className="flex gap-2">
                  <Flatpickr
                    value={horarios[dia]?.manana?.split("-")[0] || ""}
                    onChange={(date) => {
                      const formattedTime = date[0].toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
                      const endTime = horarios[dia]?.manana?.split("-")[1] || "";
                      if (validarHorario(formattedTime, endTime)) {
                        handleHorarioChange(dia, "manana", `${formattedTime}-${endTime}`);
                      }
                    }}
                    options={{
                      enableTime: true,
                      noCalendar: true,
                      dateFormat: "H:i",
                      defaultHour: 8,
                      time_24hr: true,
                      }}
                  
                    className="border rounded-lg p-2 w-full"
                  />
                  <span>-</span>
                
                  <Flatpickr
                    value={horarios[dia]?.manana?.split("-")[1] || ""}
                    onChange={(date) => {
                      const formattedTime = date[0].toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
                      const startTime = horarios[dia]?.manana?.split("-")[0] || "";
                      if (validarHorario(startTime, formattedTime)) {
                        handleHorarioChange(dia, "manana", `${startTime}-${formattedTime}`);
                      }
                    }}
                    options={{
                      enableTime: true,
                      noCalendar: true,
                      minDate: fechaInicio || "today",
                      dateFormat: "H:i",
                      defaultHour: 12,
                      time_24hr: true,
                    }}
                    className="border rounded-lg p-2 w-full"
                  />
                </div>
              </label>
              <label className="block mt-2">
                Tarde Hora Inicio/Fin:
                <div className="flex gap-2">
                  <Flatpickr
                    value={horarios[dia]?.tarde?.split("-")[0] || ""}
                    onChange={(date) => {
                      const formattedTime = date[0].toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
                      const endTime = horarios[dia]?.tarde?.split("-")[1] || "";
                      if (validarHorario(formattedTime, endTime)) {
                        handleHorarioChange(dia, "tarde", `${formattedTime}-${endTime}`);
                      }
                    }}
                    options={{
                      enableTime: true,
                      noCalendar: true,
                      dateFormat: "H:i",
                      defaultHour: 14,
                      time_24hr: true,
                    }}
                    className="border rounded-lg p-2 w-full"
                  />
                  <span>-</span>
                  <Flatpickr
                    value={horarios[dia]?.tarde?.split("-")[1] || ""}
                    onChange={(date) => {
                      const formattedTime = date[0].toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
                      const startTime = horarios[dia]?.tarde?.split("-")[0] || "";
                      if (validarHorario(startTime, formattedTime)) {
                        handleHorarioChange(dia, "tarde", `${startTime}-${formattedTime}`);
                      }
                    }}
                    options={{
                      enableTime: true,
                      noCalendar: true,
                      dateFormat: "H:i",
                      defaultHour: 18,
                      time_24hr: true,
                    }}
                    className="border rounded-lg p-2 w-full"
                  />
                </div>
              </label>
            </div>
          ))}
        </div>

        <LoadingButton
          type="submit"
          isLoading={isLoading}
          disabled={status === "loading"}
          className="mt-3"
        >
          Guardar Agenda
        </LoadingButton>
      </form>
    </ComponentCard>
  );
};

export default CrearAgenda;
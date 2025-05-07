// components/agenda/AgendaTable.tsx
"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Link from "next/link";
import { Eye } from "lucide-react";
import SkeletonLoader from "../ui/SkeletonLoader";
 

interface Agenda {
  id: string;
  profesional: string;
  fechaInicio: string;
  duracionSlot: string;
  fechaFin: string;
  status: string;
  slotsDisponibles: number;
  slotsTotales: number;
}

interface AgendaTableProps {
  agendas: Agenda[];
  isLoading : boolean;
}

export default function AgendaTable({ agendas, isLoading=false}: AgendaTableProps) {
  // Función para calcular el porcentaje de ocupación y determinar el color de la barra
  const getProgressBarProps = (slotsDisponibles: number, slotsTotales: number) => {
    const turnosOcupados = slotsTotales - slotsDisponibles;
    const porcentajeOcupado = slotsTotales > 0 ? (turnosOcupados / slotsTotales) * 100 : 0;

    let colorClass = "bg-green-500"; // Verde por defecto (baja ocupación)
    if (porcentajeOcupado > 80) {
      colorClass = "bg-red-500"; // Rojo si está casi lleno (> 80%)
    } else if (porcentajeOcupado > 50) {
      colorClass = "bg-yellow-500"; // Amarillo si está a medio camino (> 50%)
    }

    return { porcentajeOcupado, colorClass };
  };

  if (isLoading) {
    return <SkeletonLoader type="table" rows={5} columns={6} />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Profesionales
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Fechas
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Duración
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Estatus
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Turnos Ocupados
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Disponibilidad
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {agendas.map((agenda) => {
                const turnosOcupados = agenda.slotsTotales - agenda.slotsDisponibles;
                const { porcentajeOcupado, colorClass } = getProgressBarProps(
                  agenda.slotsDisponibles,
                  agenda.slotsTotales
                );

                return (
                  <TableRow key={agenda.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-800 dark:text-white/90">
                      {agenda.profesional}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {agenda.fechaInicio} - {agenda.fechaFin}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {agenda.duracionSlot} min
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={agenda.status === "Activa" ? "success" : "warning"}
                      >
                        {agenda.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {turnosOcupados}/{agenda.slotsTotales}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className={`h-2.5 rounded-full ${colorClass}`}
                          style={{ width: `${porcentajeOcupado}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                        {Math.round(porcentajeOcupado)}% ocupado
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Link href={`/dashboard/agenda/${agenda.id}`}>
                        <Eye className="w-5 h-5 text-blue-500 hover:text-blue-700" />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
/*
  Warnings:

  - Added the required column `doc_nro` to the `Paciente` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoSlot" AS ENUM ('DISPONIBLE', 'OCUPADO', 'AGENDADO', 'BLOQUEADO', 'CANCELADO', 'ELIMINADO');

-- AlterTable
ALTER TABLE "Paciente" ADD COLUMN     "doc_nro" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Agenda" (
    "id" TEXT NOT NULL,
    "profesionalId" TEXT NOT NULL,
    "creadoPorId" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "duracionSlot" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendaSlot" (
    "id" TEXT NOT NULL,
    "agendaId" TEXT NOT NULL,
    "horarioInicio" TIMESTAMP(3) NOT NULL,
    "horarioFin" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoSlot" NOT NULL DEFAULT 'DISPONIBLE',
    "pacienteId" TEXT,
    "asignadoPorId" TEXT,
    "eliminado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgendaSlot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "Profesional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaSlot" ADD CONSTRAINT "AgendaSlot_agendaId_fkey" FOREIGN KEY ("agendaId") REFERENCES "Agenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaSlot" ADD CONSTRAINT "AgendaSlot_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaSlot" ADD CONSTRAINT "AgendaSlot_asignadoPorId_fkey" FOREIGN KEY ("asignadoPorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

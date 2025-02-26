/*
  Warnings:

  - A unique constraint covering the columns `[profesionalId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'MEDICO';
ALTER TYPE "Role" ADD VALUE 'ENFERMERO';
ALTER TYPE "Role" ADD VALUE 'RECEPCIONISTA';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profesionalId" TEXT;

-- CreateTable
CREATE TABLE "Profesional" (
    "id" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profesional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Especialidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Especialidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfesionalEspecialidad" (
    "profesional_id" TEXT NOT NULL,
    "especialidad_id" INTEGER NOT NULL,

    CONSTRAINT "ProfesionalEspecialidad_pkey" PRIMARY KEY ("profesional_id","especialidad_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profesional_email_key" ON "Profesional"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Especialidad_nombre_key" ON "Especialidad"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "User_profesionalId_key" ON "User"("profesionalId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "Profesional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfesionalEspecialidad" ADD CONSTRAINT "ProfesionalEspecialidad_profesional_id_fkey" FOREIGN KEY ("profesional_id") REFERENCES "Profesional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfesionalEspecialidad" ADD CONSTRAINT "ProfesionalEspecialidad_especialidad_id_fkey" FOREIGN KEY ("especialidad_id") REFERENCES "Especialidad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

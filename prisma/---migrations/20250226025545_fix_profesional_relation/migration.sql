/*
  Warnings:

  - You are about to drop the column `sexo` on the `Profesional` table. All the data in the column will be lost.
  - The primary key for the `ProfesionalEspecialidad` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `especialidad_id` on the `ProfesionalEspecialidad` table. All the data in the column will be lost.
  - You are about to drop the column `profesional_id` on the `ProfesionalEspecialidad` table. All the data in the column will be lost.
  - You are about to drop the column `profesionalId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usuarioId]` on the table `Profesional` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `especialidadId` to the `ProfesionalEspecialidad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profesionalId` to the `ProfesionalEspecialidad` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProfesionalEspecialidad" DROP CONSTRAINT "ProfesionalEspecialidad_especialidad_id_fkey";

-- DropForeignKey
ALTER TABLE "ProfesionalEspecialidad" DROP CONSTRAINT "ProfesionalEspecialidad_profesional_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profesionalId_fkey";

-- DropIndex
DROP INDEX "Especialidad_nombre_key";

-- DropIndex
DROP INDEX "User_profesionalId_key";

-- AlterTable
ALTER TABLE "Profesional" DROP COLUMN "sexo",
ADD COLUMN     "usuarioId" TEXT;

-- AlterTable
ALTER TABLE "ProfesionalEspecialidad" DROP CONSTRAINT "ProfesionalEspecialidad_pkey",
DROP COLUMN "especialidad_id",
DROP COLUMN "profesional_id",
ADD COLUMN     "especialidadId" INTEGER NOT NULL,
ADD COLUMN     "profesionalId" TEXT NOT NULL,
ADD CONSTRAINT "ProfesionalEspecialidad_pkey" PRIMARY KEY ("profesionalId", "especialidadId");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profesionalId";

-- CreateTable
CREATE TABLE "Estudios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Estudios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstudiosPaciente" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "estudioId" INTEGER NOT NULL,
    "profesionalId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "linkResultado" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EstudiosPaciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultadosEstudiosPaciente" (
    "id" TEXT NOT NULL,
    "estudiosPacienteId" TEXT NOT NULL,
    "archivoURL" TEXT NOT NULL,
    "tipoArchivo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResultadosEstudiosPaciente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Estudios_nombre_key" ON "Estudios"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Profesional_usuarioId_key" ON "Profesional"("usuarioId");

-- AddForeignKey
ALTER TABLE "Profesional" ADD CONSTRAINT "Profesional_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfesionalEspecialidad" ADD CONSTRAINT "ProfesionalEspecialidad_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "Profesional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfesionalEspecialidad" ADD CONSTRAINT "ProfesionalEspecialidad_especialidadId_fkey" FOREIGN KEY ("especialidadId") REFERENCES "Especialidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstudiosPaciente" ADD CONSTRAINT "EstudiosPaciente_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstudiosPaciente" ADD CONSTRAINT "EstudiosPaciente_estudioId_fkey" FOREIGN KEY ("estudioId") REFERENCES "Estudios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstudiosPaciente" ADD CONSTRAINT "EstudiosPaciente_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "Profesional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstudiosPaciente" ADD CONSTRAINT "EstudiosPaciente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultadosEstudiosPaciente" ADD CONSTRAINT "ResultadosEstudiosPaciente_estudiosPacienteId_fkey" FOREIGN KEY ("estudiosPacienteId") REFERENCES "EstudiosPaciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

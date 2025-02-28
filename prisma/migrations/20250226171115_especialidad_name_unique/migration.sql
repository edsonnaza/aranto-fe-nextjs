/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Especialidad` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Especialidad_nombre_key" ON "Especialidad"("nombre");

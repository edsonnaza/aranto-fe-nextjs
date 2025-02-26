-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('HOMBRE', 'MUJER');

-- CreateTable
CREATE TABLE "Paciente" (
    "id" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "direccion" TEXT,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "contacto" TEXT NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seguro" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seguro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeguroPaciente" (
    "paciente_id" TEXT NOT NULL,
    "seguro_id" INTEGER NOT NULL,

    CONSTRAINT "SeguroPaciente_pkey" PRIMARY KEY ("paciente_id","seguro_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_email_key" ON "Paciente"("email");

-- AddForeignKey
ALTER TABLE "SeguroPaciente" ADD CONSTRAINT "SeguroPaciente_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeguroPaciente" ADD CONSTRAINT "SeguroPaciente_seguro_id_fkey" FOREIGN KEY ("seguro_id") REFERENCES "Seguro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

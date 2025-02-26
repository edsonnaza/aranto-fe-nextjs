-- CreateEnum
CREATE TYPE "MotivoConsulta" AS ENUM ('DOLOR_DE_GARGANTA', 'DOLOR_DE_OIDO', 'DOLOR_DE_ESTOMAGO', 'FIEBRE', 'DIFICULTAD_RESPIRATORIA', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoEspera" AS ENUM ('EN_ESPERA', 'ATENDIDO', 'DERIVADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "Recepcion" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "agendaId" TEXT,
    "profesionalId" TEXT NOT NULL,
    "motivoConsulta" "MotivoConsulta" NOT NULL,
    "descripcion" TEXT,
    "estadoEspera" "EstadoEspera" NOT NULL DEFAULT 'EN_ESPERA',
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creadoPorId" TEXT NOT NULL,
    "notas" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recepcion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recepcion" ADD CONSTRAINT "Recepcion_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recepcion" ADD CONSTRAINT "Recepcion_agendaId_fkey" FOREIGN KEY ("agendaId") REFERENCES "Agenda"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recepcion" ADD CONSTRAINT "Recepcion_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "Profesional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recepcion" ADD CONSTRAINT "Recepcion_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

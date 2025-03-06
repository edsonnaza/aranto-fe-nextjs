-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO');

-- CreateTable
CREATE TABLE "AgendaDia" (
    "id" TEXT NOT NULL,
    "agendaId" TEXT NOT NULL,
    "diaSemana" "DiaSemana" NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "horarioMananaInicio" TIMESTAMP(3),
    "horarioMananaFin" TIMESTAMP(3),
    "horarioTardeInicio" TIMESTAMP(3),
    "horarioTardeFin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgendaDia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AgendaDiaToAgendaSlot" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AgendaDiaToAgendaSlot_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AgendaDiaToAgendaSlot_B_index" ON "_AgendaDiaToAgendaSlot"("B");

-- AddForeignKey
ALTER TABLE "AgendaDia" ADD CONSTRAINT "AgendaDia_agendaId_fkey" FOREIGN KEY ("agendaId") REFERENCES "Agenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgendaDiaToAgendaSlot" ADD CONSTRAINT "_AgendaDiaToAgendaSlot_A_fkey" FOREIGN KEY ("A") REFERENCES "AgendaDia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgendaDiaToAgendaSlot" ADD CONSTRAINT "_AgendaDiaToAgendaSlot_B_fkey" FOREIGN KEY ("B") REFERENCES "AgendaSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "AgendaSlotLog" (
    "id" TEXT NOT NULL,
    "agendaSlotId" TEXT NOT NULL,
    "estadoAnterior" "EstadoSlot" NOT NULL,
    "estadoNuevo" "EstadoSlot" NOT NULL,
    "pacienteId" TEXT,
    "motivo" TEXT,
    "modificadoPorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgendaSlotLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AgendaSlotLog" ADD CONSTRAINT "AgendaSlotLog_agendaSlotId_fkey" FOREIGN KEY ("agendaSlotId") REFERENCES "AgendaSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaSlotLog" ADD CONSTRAINT "AgendaSlotLog_modificadoPorId_fkey" FOREIGN KEY ("modificadoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

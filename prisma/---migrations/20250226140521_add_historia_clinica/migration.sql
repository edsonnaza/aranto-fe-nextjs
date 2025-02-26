-- CreateTable
CREATE TABLE "HistoriaClinica" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "profesionalId" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "numeroRecepcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusEliminado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "HistoriaClinica_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HistoriaClinica" ADD CONSTRAINT "HistoriaClinica_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoriaClinica" ADD CONSTRAINT "HistoriaClinica_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

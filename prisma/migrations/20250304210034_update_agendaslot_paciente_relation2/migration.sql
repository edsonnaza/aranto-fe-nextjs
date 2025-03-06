-- DropForeignKey
ALTER TABLE "AgendaSlot" DROP CONSTRAINT "AgendaSlot_pacienteId_fkey";

-- CreateTable
CREATE TABLE "_PacienteSlot" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PacienteSlot_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PacienteSlot_B_index" ON "_PacienteSlot"("B");

-- AddForeignKey
ALTER TABLE "AgendaSlot" ADD CONSTRAINT "AgendaSlot_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PacienteSlot" ADD CONSTRAINT "_PacienteSlot_A_fkey" FOREIGN KEY ("A") REFERENCES "AgendaSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PacienteSlot" ADD CONSTRAINT "_PacienteSlot_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

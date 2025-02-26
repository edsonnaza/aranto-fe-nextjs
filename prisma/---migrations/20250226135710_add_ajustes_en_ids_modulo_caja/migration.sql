-- CreateEnum
CREATE TYPE "EstadoCaja" AS ENUM ('ABIERTO', 'CERRADO');

-- CreateTable
CREATE TABLE "Caja" (
    "id" SERIAL NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "montoApertura" DECIMAL(65,30) NOT NULL,
    "totalVentas" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "montoEgresos" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "montoOtrosIngresos" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "montoFinalCierre" DECIMAL(65,30),
    "fechaApertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaCierre" TIMESTAMP(3),
    "usuarioCierreId" TEXT,
    "estado" "EstadoCaja" NOT NULL DEFAULT 'ABIERTO',
    "eliminado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Caja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CajaEgreso" (
    "id" TEXT NOT NULL,
    "cajaId" INTEGER NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CajaEgreso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CajaOtrosIngresos" (
    "id" TEXT NOT NULL,
    "cajaId" INTEGER NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "concepto" TEXT NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CajaOtrosIngresos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Caja" ADD CONSTRAINT "Caja_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caja" ADD CONSTRAINT "Caja_usuarioCierreId_fkey" FOREIGN KEY ("usuarioCierreId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CajaEgreso" ADD CONSTRAINT "CajaEgreso_cajaId_fkey" FOREIGN KEY ("cajaId") REFERENCES "Caja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CajaEgreso" ADD CONSTRAINT "CajaEgreso_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CajaOtrosIngresos" ADD CONSTRAINT "CajaOtrosIngresos_cajaId_fkey" FOREIGN KEY ("cajaId") REFERENCES "Caja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CajaOtrosIngresos" ADD CONSTRAINT "CajaOtrosIngresos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

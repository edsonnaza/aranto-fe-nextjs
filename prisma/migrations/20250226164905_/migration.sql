-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'USER', 'MEDICO', 'ENFERMERO', 'RECEPCIONISTA');

-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('HOMBRE', 'MUJER');

-- CreateEnum
CREATE TYPE "EstadoSlot" AS ENUM ('DISPONIBLE', 'OCUPADO', 'AGENDADO', 'BLOQUEADO', 'CANCELADO', 'ELIMINADO');

-- CreateEnum
CREATE TYPE "MotivoConsulta" AS ENUM ('DOLOR_DE_GARGANTA', 'DOLOR_DE_OIDO', 'DOLOR_DE_ESTOMAGO', 'FIEBRE', 'DIFICULTAD_RESPIRATORIA', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoEspera" AS ENUM ('EN_ESPERA', 'ATENDIDO', 'DERIVADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "CategoriaProducto" AS ENUM ('SERVICIOS', 'ESTUDIOS', 'CONSULTAS', 'MEDICAMENTOS', 'DESCARTABLES', 'OTROS');

-- CreateEnum
CREATE TYPE "EstadoComision" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'PAGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstadoCaja" AS ENUM ('ABIERTO', 'CERRADO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profesional" (
    "id" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "usuarioId" TEXT,

    CONSTRAINT "Profesional_pkey" PRIMARY KEY ("id")
);

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
    "doc_nro" TEXT NOT NULL,

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
    "especialidadId" INTEGER NOT NULL,
    "profesionalId" TEXT NOT NULL,

    CONSTRAINT "ProfesionalEspecialidad_pkey" PRIMARY KEY ("profesionalId","especialidadId")
);

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

-- CreateTable
CREATE TABLE "invoices" (
    "id" CHAR(36) NOT NULL,
    "customer_id" CHAR(36) NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" CHAR(36) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenue" (
    "month" TEXT NOT NULL,
    "revenue" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "image" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agenda" (
    "id" TEXT NOT NULL,
    "profesionalId" TEXT NOT NULL,
    "creadoPorId" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "duracionSlot" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendaSlot" (
    "id" TEXT NOT NULL,
    "agendaId" TEXT NOT NULL,
    "horarioInicio" TIMESTAMP(3) NOT NULL,
    "horarioFin" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoSlot" NOT NULL DEFAULT 'DISPONIBLE',
    "pacienteId" TEXT,
    "asignadoPorId" TEXT,
    "eliminado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgendaSlot_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "categoria" "CategoriaProducto" NOT NULL DEFAULT 'OTROS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrecioProducto" (
    "id" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "seguroId" INTEGER NOT NULL,
    "precio" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrecioProducto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComisionProfesional" (
    "id" TEXT NOT NULL,
    "profesionalId" TEXT NOT NULL,
    "productoId" TEXT,
    "porcentaje" DECIMAL(65,30) NOT NULL,
    "estatus" "EstadoComision" NOT NULL DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComisionProfesional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VentaCarrito" (
    "id" TEXT NOT NULL,
    "recepcionId" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "profesionalId" TEXT NOT NULL,
    "estadoPago" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "comisionPagada" BOOLEAN NOT NULL DEFAULT false,
    "porcentajeComision" DECIMAL(65,30) NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VentaCarrito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VentaCarritoItem" (
    "id" TEXT NOT NULL,
    "ventaId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(65,30) NOT NULL,
    "subtotal" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VentaCarritoItem_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profesional_email_key" ON "Profesional"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profesional_usuarioId_key" ON "Profesional"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_email_key" ON "Paciente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Seguro_nombre_key" ON "Seguro"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Estudios_nombre_key" ON "Estudios"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "revenue_month_key" ON "revenue"("month");

-- CreateIndex
CREATE INDEX "product_category_id_idx" ON "product"("category_id");

-- AddForeignKey
ALTER TABLE "Profesional" ADD CONSTRAINT "Profesional_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeguroPaciente" ADD CONSTRAINT "SeguroPaciente_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeguroPaciente" ADD CONSTRAINT "SeguroPaciente_seguro_id_fkey" FOREIGN KEY ("seguro_id") REFERENCES "Seguro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfesionalEspecialidad" ADD CONSTRAINT "ProfesionalEspecialidad_especialidadId_fkey" FOREIGN KEY ("especialidadId") REFERENCES "Especialidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfesionalEspecialidad" ADD CONSTRAINT "ProfesionalEspecialidad_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "Profesional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstudiosPaciente" ADD CONSTRAINT "EstudiosPaciente_estudioId_fkey" FOREIGN KEY ("estudioId") REFERENCES "Estudios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstudiosPaciente" ADD CONSTRAINT "EstudiosPaciente_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstudiosPaciente" ADD CONSTRAINT "EstudiosPaciente_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "Profesional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstudiosPaciente" ADD CONSTRAINT "EstudiosPaciente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultadosEstudiosPaciente" ADD CONSTRAINT "ResultadosEstudiosPaciente_estudiosPacienteId_fkey" FOREIGN KEY ("estudiosPacienteId") REFERENCES "EstudiosPaciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "Profesional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaSlot" ADD CONSTRAINT "AgendaSlot_agendaId_fkey" FOREIGN KEY ("agendaId") REFERENCES "Agenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaSlot" ADD CONSTRAINT "AgendaSlot_asignadoPorId_fkey" FOREIGN KEY ("asignadoPorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaSlot" ADD CONSTRAINT "AgendaSlot_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recepcion" ADD CONSTRAINT "Recepcion_agendaId_fkey" FOREIGN KEY ("agendaId") REFERENCES "Agenda"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recepcion" ADD CONSTRAINT "Recepcion_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recepcion" ADD CONSTRAINT "Recepcion_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recepcion" ADD CONSTRAINT "Recepcion_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "Profesional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrecioProducto" ADD CONSTRAINT "PrecioProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrecioProducto" ADD CONSTRAINT "PrecioProducto_seguroId_fkey" FOREIGN KEY ("seguroId") REFERENCES "Seguro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComisionProfesional" ADD CONSTRAINT "ComisionProfesional_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComisionProfesional" ADD CONSTRAINT "ComisionProfesional_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "Profesional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VentaCarrito" ADD CONSTRAINT "VentaCarrito_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VentaCarrito" ADD CONSTRAINT "VentaCarrito_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "Profesional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VentaCarrito" ADD CONSTRAINT "VentaCarrito_recepcionId_fkey" FOREIGN KEY ("recepcionId") REFERENCES "Recepcion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VentaCarritoItem" ADD CONSTRAINT "VentaCarritoItem_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VentaCarritoItem" ADD CONSTRAINT "VentaCarritoItem_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "VentaCarrito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caja" ADD CONSTRAINT "Caja_usuarioCierreId_fkey" FOREIGN KEY ("usuarioCierreId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caja" ADD CONSTRAINT "Caja_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CajaEgreso" ADD CONSTRAINT "CajaEgreso_cajaId_fkey" FOREIGN KEY ("cajaId") REFERENCES "Caja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CajaEgreso" ADD CONSTRAINT "CajaEgreso_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CajaOtrosIngresos" ADD CONSTRAINT "CajaOtrosIngresos_cajaId_fkey" FOREIGN KEY ("cajaId") REFERENCES "Caja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CajaOtrosIngresos" ADD CONSTRAINT "CajaOtrosIngresos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoriaClinica" ADD CONSTRAINT "HistoriaClinica_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoriaClinica" ADD CONSTRAINT "HistoriaClinica_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

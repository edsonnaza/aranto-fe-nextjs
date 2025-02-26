import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { estudios, seguros, especialidades } from "./data"; // Importa los datos desde data.ts

const prisma = new PrismaClient();

async function main() {
  // Dados del superusuario
  const name = "Edson Sanchez";
  const email = "edsonnaza@gmail.com";
  const password = "Login123";
  

  // Criptografía de la contraseña
  const hashPassword = await bcrypt.hash(password, 10);

  try {
    // Crear el superusuario
    await prisma.user.create({
      data: { email, name, password: hashPassword},
    });
    console.log("✅ Superusuario creado.");
  } catch (error) {
    console.error("❌ Error al crear el superusuario:", error);
  }

  try {
    // Insertar los estudios
    for (const estudio of estudios) {
      await prisma.estudios.upsert({
        where: { nombre: estudio.nombre }, // Evita duplicados
        update: {},
        create: estudio,
      });
    }
    console.log("✅ Estudios insertados correctamente.");
  } catch (error) {
    console.error("❌ Error al insertar estudios:", error);
  }

  try {
    // Restablecer el valor del contador AUTO_INCREMENT de seguro en PostgreSQL
   // await prisma.$queryRaw`SELECT setval('seguro_id_seq', 1, false)`;
   // console.log('✅ Reset seguro auto increment to 1 in PostgreSQL');

    // Insertar los seguros
    for (const seguro of seguros) {
      await prisma.seguro.upsert({
        where: { nombre: seguro.nombre, descripcion: seguro.descripcion }, // Evita duplicados
        update: {},
        create: seguro,
      });
    }
    console.log("✅ Seguros insertados correctamente.");
  } catch (error) {
    console.error("❌ Error al insertar seguros:", error);
  } finally {
    await prisma.$disconnect(); // Solo desconectar al final
  }

  try {
    // Restablecer el valor del contador AUTO_INCREMENT de seguro en PostgreSQL
   // await prisma.$queryRaw`SELECT setval('seguro_id_seq', 1, false)`;
   // console.log('✅ Reset seguro auto increment to 1 in PostgreSQL');

    // Insertar los seguros
    for (const especialidad of especialidades) {
      await prisma.especialidad.upsert({
        where: { nombre: especialidad.nombre }, // Evita duplicados
        update: {},
        create: especialidad,
      });
    }
    console.log("✅ Especialidades insertados correctamente.");
  } catch (error) {
    console.error("❌ Error al insertar especialidad:", error);
  } finally {
    await prisma.$disconnect(); // Solo desconectar al final
  }
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

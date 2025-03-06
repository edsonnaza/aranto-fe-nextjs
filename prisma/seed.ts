import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { estudios, seguros, especialidades, users, profesionales } from "./data"; // Importa los datos desde data.ts

const prisma = new PrismaClient();

async function main() {
  // Dados del superusuario
  
   try {
      // Crear el superusuario
      for (const user of users) {
        // Criptografía de la contraseña
        const hashPassword = await bcrypt.hash(user.password, 10);
    
        await prisma.user.upsert({
          where: { email: user.email }, // Solo se puede usar `email` porque es `@unique`
          update: {
            name: user.name,
            password: hashPassword,
            role: user.role as Role, // Asegúrate de que el campo existe
          },
          create: {
            name: user.name,
            email: user.email,
            password: hashPassword,
            role: user.role as Role,
          },
        });
      }
      console.log("✅ Usuarios insertados correctamente.");
      } catch (error) {
        console.error("❌ Error al insertar usuarios:", error);
    }

    try {
      // Crear Profesionales
      for (const prof of profesionales) {
        await prisma.profesional.upsert({
          where: { email: prof.email }, // Solo se puede usar `email` porque es `@unique`
          update: {
            nombres: prof.nombres,
            apellidos: prof.apellidos,
            email:prof.email,
            contacto:prof.contacto
            
          },
          create: {
            nombres: prof.nombres,
            apellidos: prof.apellidos,
            email: prof.email,
            contacto: prof.contacto
          },
        });
      }
      console.log("✅ Profesionales insertados correctamente.");
      } catch (error) {
        console.error("❌ Error al insertar profesionales:", error);
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

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  // dados do Superusuário
  const name = "Pablo George";
  const email = "pablogeokar@hotmail.com";
  const password = "123";

  // Criptografia da Senha
  const hashPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: { email, name, password: hashPassword },
    });
  } catch (error) {}
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

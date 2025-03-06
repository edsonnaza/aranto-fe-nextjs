import { prisma } from "../prisma";

export async function getProfesionales() {
  return await prisma.profesional.findMany({
    where: { status: true },
    select: { id: true, nombres: true, apellidos: true }
  });
}

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SUPER';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'SUPER';

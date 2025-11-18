-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "task" ADD COLUMN     "priority" "TaskPriority" NOT NULL DEFAULT 'LOW';

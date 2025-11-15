-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED');

-- CreateTable
CREATE TABLE "invite_collaborator" (
    "id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "invited_by_id" TEXT NOT NULL,
    "invite_status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "invited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invite_collaborator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invite_collaborator_task_id_email_key" ON "invite_collaborator"("task_id", "email");

-- AddForeignKey
ALTER TABLE "invite_collaborator" ADD CONSTRAINT "invite_collaborator_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invite_collaborator" ADD CONSTRAINT "invite_collaborator_invited_by_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

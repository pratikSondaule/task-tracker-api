-- CreateTable
CREATE TABLE "task_collaborator" (
    "id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "task_collaborator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "task_collaborator_task_id_user_id_key" ON "task_collaborator"("task_id", "user_id");

-- AddForeignKey
ALTER TABLE "task_collaborator" ADD CONSTRAINT "task_collaborator_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_collaborator" ADD CONSTRAINT "task_collaborator_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

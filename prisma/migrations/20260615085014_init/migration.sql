-- CreateTable
CREATE TABLE "manifests" (
    "id" TEXT NOT NULL,
    "access_key" TEXT NOT NULL,
    "target_name" TEXT NOT NULL,
    "message_content" TEXT NOT NULL,
    "resonate_count" INTEGER NOT NULL DEFAULT 0,
    "unlock_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "manifests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "manifests_access_key_idx" ON "manifests"("access_key");

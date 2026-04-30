-- CreateEnum safely
DO $$ BEGIN
  CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CreateEnum safely
DO $$ BEGIN
  CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'RESOLVED', 'FLAGGED', 'BANNED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AlterTable safely
ALTER TABLE "Request"
ADD COLUMN IF NOT EXISTS "receiverId" INTEGER,
ADD COLUMN IF NOT EXISTS "receiverUsername" TEXT,
ADD COLUMN IF NOT EXISTS "status" "RequestStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable safely
CREATE TABLE IF NOT EXISTS "Report" (
    "id" SERIAL NOT NULL,
    "reportedUsername" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "incidentDate" TIMESTAMP(3) NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey safely
DO $$ BEGIN
  ALTER TABLE "Request" ADD CONSTRAINT "Request_receiverId_fkey"
  FOREIGN KEY ("receiverId") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

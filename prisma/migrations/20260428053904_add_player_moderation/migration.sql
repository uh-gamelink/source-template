/*
  Warnings:

  - The values [INVESTIGATING,WARNING] on the enum `ReportStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "PlayerModerationStatus" AS ENUM ('CLEAN', 'FLAGGED', 'BANNED');

-- AlterEnum
BEGIN;
CREATE TYPE "ReportStatus_new" AS ENUM ('PENDING', 'RESOLVED', 'FLAGGED', 'BANNED');
ALTER TABLE "public"."Report" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Report" ALTER COLUMN "status" TYPE "ReportStatus_new" USING ("status"::text::"ReportStatus_new");
ALTER TYPE "ReportStatus" RENAME TO "ReportStatus_old";
ALTER TYPE "ReportStatus_new" RENAME TO "ReportStatus";
DROP TYPE "public"."ReportStatus_old";
ALTER TABLE "Report" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "moderationStatus" "PlayerModerationStatus" NOT NULL DEFAULT 'CLEAN';

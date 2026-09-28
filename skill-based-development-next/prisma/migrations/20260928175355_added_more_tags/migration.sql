-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CourseTag" ADD VALUE 'FUNDAMENTALS';
ALTER TYPE "CourseTag" ADD VALUE 'SOLO_DRILLS';
ALTER TYPE "CourseTag" ADD VALUE 'KNEE_ON_BELLY';
ALTER TYPE "CourseTag" ADD VALUE 'NORTH_SOUTH';

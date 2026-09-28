/*
  Warnings:

  - The `tags` column on the `Course` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CourseTag" AS ENUM ('CLOSED_GUARD', 'HALF_GUARD', 'OPEN_GUARD', 'SIDE_CONTROL', 'MOUNT', 'BACK_CONTROL', 'TURTLE', 'GUARD_PASSING', 'ESCAPES');

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "tags",
ADD COLUMN     "tags" "CourseTag"[] DEFAULT ARRAY[]::"CourseTag"[];

-- DropEnum
DROP TYPE "CourseTags";

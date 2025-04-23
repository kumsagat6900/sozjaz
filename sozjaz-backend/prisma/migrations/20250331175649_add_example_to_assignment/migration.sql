/*
  Warnings:

  - The values [ILLUSTRATED_TEXT,KEYWORD_TEXT,TEXT_PLAN,EDITING,SYNONYM_SEARCH,FORUM] on the enum `AssignmentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AssignmentType_new" AS ENUM ('AUDIO_DICTATION', 'AUDIO_SUMMARY', 'SYNONYM_REPLACE', 'OPEN_SPACE', 'WORD_GAME');
ALTER TABLE "Assignment" ALTER COLUMN "type" TYPE "AssignmentType_new" USING ("type"::text::"AssignmentType_new");
ALTER TYPE "AssignmentType" RENAME TO "AssignmentType_old";
ALTER TYPE "AssignmentType_new" RENAME TO "AssignmentType";
DROP TYPE "AssignmentType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "example" TEXT,
ADD COLUMN     "studentId" TEXT;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

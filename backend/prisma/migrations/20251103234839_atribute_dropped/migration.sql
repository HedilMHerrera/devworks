/*
  Warnings:

  - Added the required column `droppedDate` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "droppedDate" TIMESTAMP(3) NOT NULL;

/*
  Warnings:

  - You are about to drop the column `name` on the `departments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[department_code]` on the table `departments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[role_code]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `department_code` to the `departments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department_name` to the `departments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "departments" DROP COLUMN "name",
ADD COLUMN     "department_code" VARCHAR(100) NOT NULL,
ADD COLUMN     "department_name" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "departments_department_code_key" ON "departments"("department_code");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_code_key" ON "roles"("role_code");

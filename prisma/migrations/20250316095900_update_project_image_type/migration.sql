/*
  Warnings:

  - You are about to drop the `ProjectImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "ProjectImage_projectId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ProjectImage";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "amenities" TEXT NOT NULL,
    "isReraRegistered" BOOLEAN NOT NULL DEFAULT false,
    "reraNumbers" TEXT,
    "landmark" TEXT,
    "landmarkDistance" TEXT,
    "latitude" TEXT,
    "longitude" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "images" TEXT
);
INSERT INTO "new_Project" ("amenities", "createdAt", "description", "id", "isReraRegistered", "landmark", "landmarkDistance", "latitude", "location", "longitude", "price", "propertyType", "reraNumbers", "status", "title", "updatedAt") SELECT "amenities", "createdAt", "description", "id", "isReraRegistered", "landmark", "landmarkDistance", "latitude", "location", "longitude", "price", "propertyType", "reraNumbers", "status", "title", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

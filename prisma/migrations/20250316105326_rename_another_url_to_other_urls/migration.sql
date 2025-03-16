/*
  Warnings:

  - You are about to drop the column `another_url` on the `Project` table. All the data in the column will be lost.

*/
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
    "otherUrls" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "images" TEXT
);
INSERT INTO "new_Project" ("amenities", "createdAt", "description", "id", "images", "isReraRegistered", "landmark", "landmarkDistance", "latitude", "location", "longitude", "price", "propertyType", "reraNumbers", "status", "title", "updatedAt") SELECT "amenities", "createdAt", "description", "id", "images", "isReraRegistered", "landmark", "landmarkDistance", "latitude", "location", "longitude", "price", "propertyType", "reraNumbers", "status", "title", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

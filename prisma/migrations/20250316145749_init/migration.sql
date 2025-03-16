-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "images" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

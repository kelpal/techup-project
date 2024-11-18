-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")   
);

-- Create Location table
CREATE TABLE "Location" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL
);

-- Create Attribute table
CREATE TABLE "Attribute" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE
);

-- Create LocationAttribute (pivot) table for many-to-many relationship
CREATE TABLE "LocationAttribute" (
  "id" SERIAL PRIMARY KEY,
  "locationId" INT NOT NULL REFERENCES "Location"("id") ON DELETE CASCADE,
  "attributeId" INT NOT NULL REFERENCES "Attribute"("id") ON DELETE CASCADE,
  CONSTRAINT unique_location_attribute UNIQUE ("locationId", "attributeId")
);


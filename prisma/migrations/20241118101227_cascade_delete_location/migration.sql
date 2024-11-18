-- DropForeignKey
ALTER TABLE "LocationAttribute" DROP CONSTRAINT "LocationAttribute_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "LocationAttribute" DROP CONSTRAINT "LocationAttribute_locationId_fkey";

-- CreateTable
CREATE TABLE "_LocationAttributes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LocationAttributes_AB_unique" ON "_LocationAttributes"("A", "B");

-- CreateIndex
CREATE INDEX "_LocationAttributes_B_index" ON "_LocationAttributes"("B");

-- AddForeignKey
ALTER TABLE "LocationAttribute" ADD CONSTRAINT "LocationAttribute_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationAttribute" ADD CONSTRAINT "LocationAttribute_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationAttributes" ADD CONSTRAINT "_LocationAttributes_A_fkey" FOREIGN KEY ("A") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationAttributes" ADD CONSTRAINT "_LocationAttributes_B_fkey" FOREIGN KEY ("B") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "unique_location_attribute" RENAME TO "LocationAttribute_locationId_attributeId_key";

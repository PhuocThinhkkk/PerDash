/*
  Warnings:

  - You are about to drop the column `userId` on the `OrderDetails` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PaymentDetails` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Wishlist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userClerkId,productId]` on the table `Wishlist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userClerkId` to the `OrderDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userClerkId` to the `PaymentDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userClerkId` to the `Wishlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderDetails" DROP CONSTRAINT "OrderDetails_userId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentDetails" DROP CONSTRAINT "PaymentDetails_userId_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_userId_fkey";

-- DropIndex
DROP INDEX "Wishlist_userId_productId_key";

-- AlterTable
ALTER TABLE "OrderDetails" DROP COLUMN "userId",
ADD COLUMN     "userClerkId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PaymentDetails" DROP COLUMN "userId",
ADD COLUMN     "userClerkId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Wishlist" DROP COLUMN "userId",
ADD COLUMN     "userClerkId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_userClerkId_productId_key" ON "Wishlist"("userClerkId", "productId");

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_userClerkId_fkey" FOREIGN KEY ("userClerkId") REFERENCES "User"("clerk_customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentDetails" ADD CONSTRAINT "PaymentDetails_userClerkId_fkey" FOREIGN KEY ("userClerkId") REFERENCES "User"("clerk_customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_userClerkId_fkey" FOREIGN KEY ("userClerkId") REFERENCES "User"("clerk_customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

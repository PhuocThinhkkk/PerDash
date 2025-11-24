import db from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function addWishlistItem(userClerkId: string, productId: number) {
  return db.wishlist.create({
    data: { userClerkId: userClerkId, productId }
  });
}

export async function removeWishlistItem(
  userClerkId: string,
  productId: number
) {
  return db.wishlist.delete({
    where: { userClerkId_productId: { userClerkId, productId } }
  });
}

export async function getUserWishlist(userClerkId: string) {
  return db.wishlist.findMany({
    where: { userClerkId: userClerkId },
    include: { product: true }
  });
}

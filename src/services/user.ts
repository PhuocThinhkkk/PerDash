import db from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function getUserByClerkId(clerkId: string) {
  return db.user.findUnique({
    where: { clerk_customer_id: clerkId },
    include: {
      wishlist: { include: { product: true } },
      orders: {
        include: { items: { include: { product_sku: true } }, payment: true }
      },
      payments: true
    }
  });
}

export async function createUserByClerkId(data: Prisma.UserCreateInput) {
  return db.user.create({ data });
}

export async function updateUserByClerkId(
  clerkId: string,
  data: Partial<{
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
    stripe_customer_id: string;
    phone_number: string;
    avatar_url: string;
  }>
) {
  return db.user.update({
    where: { clerk_customer_id: clerkId },
    data
  });
}

export async function deleteUserByClerkId(clerkId: string) {
  return db.user.delete({
    where: { clerk_customer_id: clerkId }
  });
}

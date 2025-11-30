import db from '@/lib/db';
import { Prisma, User } from '@prisma/client';

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

export async function getTotalUsersNumber(): Promise<number> {
  return db.user.count();
}

export type FilterUserType = {
  page?: number;
  pageSize?: number;
};

export type UserWithPayment = Prisma.UserGetPayload<{
  include: {
    payments: true;
  };
}>;

export async function getUsersByFilter(
  filter: FilterUserType
): Promise<UserWithPayment[]> {
  const page = filter.page ? filter.page : 1;
  const pageSize = filter.pageSize ? filter.pageSize : 10;
  const users = await db.user.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: {
      name: {
        contains: '', // or equals
        mode: 'insensitive'
      }
    },
    include: {
      payments: true
    },
    orderBy: { id: 'asc' }
  });
  return users;
}

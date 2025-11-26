import db from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function createPaymentByClerkId(
  userClerkId: string,
  data: Omit<Prisma.PaymentDetailsCreateInput, 'userClerkId' | 'user'>
) {
  return db.paymentDetails.create({
    data: {
      ...data,
      stripe_payment_id: data.stripe_payment_id || `payment_${Date.now()}`,
      userClerkId: userClerkId
    }
  });
}

export async function getPaymentsByClerkId(userClerkId: string) {
  return db.paymentDetails.findMany({
    where: { userClerkId }
  });
}

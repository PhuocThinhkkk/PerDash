import db from '@/lib/db';

export async function createPaymentByClerkId(data: {
  userClerkId: string;
  provider: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  amount: number;
  stripe_payment_id?: string;
}) {
  return db.paymentDetails.create({
    data: {
      ...data,
      stripe_payment_id: data.stripe_payment_id || `payment_${Date.now()}`
    }
  });
}

export async function getPaymentsByClerkId(userClerkId: string) {
  return db.paymentDetails.findMany({
    where: { userClerkId }
  });
}

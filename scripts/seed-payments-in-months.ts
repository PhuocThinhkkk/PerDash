// npx tsx scripts/seed-payments-in-months.ts 7

import { OrderStatus, PaymentStatus } from '@prisma/client';
import crypto from 'crypto';
import db from '@/lib/db';

function parseArgs() {
  const args = process.argv.slice(2);
  if (!args[0]) throw new Error('Usage: seed-payments-in-months.ts <months>');
  const months = Number(args[0]);
  if (!Number.isFinite(months) || months < 1) {
    throw new Error('Months must be a positive integer.');
  }
  return { months };
}

// Generate a random date between now and N months ago
function randomDateInPastMonths(maxMonths: number): Date {
  const now = new Date();
  const target = new Date();

  const monthOffset = Math.floor(Math.random() * (maxMonths + 1)); // 0..maxMonths
  target.setMonth(now.getMonth() - monthOffset);

  // random day in that month
  const daysInMonth = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0
  ).getDate();
  target.setDate(Math.floor(Math.random() * daysInMonth) + 1);

  // random hour/min/sec
  target.setHours(Math.floor(Math.random() * 24));
  target.setMinutes(Math.floor(Math.random() * 60));
  target.setSeconds(Math.floor(Math.random() * 60));

  return target;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const { months } = parseArgs();
  console.log(`Seeding random payments across last ${months} months...`);

  const users = await db.user.findMany({
    where: { clerk_customer_id: { not: null } }
  });

  const productSkus = await db.productsSkus.findMany({
    include: { product: true }
  });

  if (users.length === 0) return console.log('No users found.');
  if (productSkus.length === 0) return console.log('No product SKUs found.');

  for (const user of users) {
    const orderCount = randomInt(1, 5); // random 1–5 orders per user

    for (let i = 0; i < orderCount; i++) {
      const timestamp = randomDateInPastMonths(months);
      const sku = productSkus[randomInt(0, productSkus.length - 1)];
      const quantity = randomInt(1, 2);
      const totalPrice = sku.price * quantity;

      await db.$transaction(async (tx) => {
        const payment = await tx.paymentDetails.create({
          data: {
            userClerkId: user.clerk_customer_id!,
            stripe_payment_id: `seed_${crypto.randomUUID()}`,
            provider: 'stripe',
            amount: totalPrice,
            status: PaymentStatus.PAID,
            created_at: timestamp,
            updated_at: timestamp
          }
        });

        const order = await tx.orderDetails.create({
          data: {
            userClerkId: user.clerk_customer_id!,
            paymentId: payment.id,
            total_amount: totalPrice,
            status: OrderStatus.COMPLETED,
            created_at: timestamp,
            updated_at: timestamp
          }
        });

        await tx.orderItems.create({
          data: {
            orderId: order.id,
            productSkuId: sku.id,
            quantity,
            price: sku.price,
            created_at: timestamp,
            updated_at: timestamp
          }
        });
      });
    }

    console.log(`Seeded ${orderCount} orders for ${user.clerk_customer_id}`);
  }

  console.log('Done.');
  await db.$disconnect();
}

main();

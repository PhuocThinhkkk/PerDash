//   ex: npx tsx scripts/delete-payment-by-date.ts 2025 12 11

import db from '@/lib/db';

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    throw new Error('Provide date as: year month day');
  }

  const [y, m, d] = args.map(Number);
  if (!y || !m || !d) throw new Error('Invalid date provided');

  return { year: y, month: m, day: d };
}

function startEndOfDay(year: number, month: number, day: number) {
  const start = new Date(year, month - 1, day, 0, 0, 0, 0);
  const end = new Date(year, month - 1, day + 1, 0, 0, 0, 0);
  return { start, end };
}

async function main() {
  try {
    const { year, month, day } = parseArgs();
    const { start, end } = startEndOfDay(year, month, day);

    console.log(`Deleting all payments created on ${year}-${month}-${day}`);

    const payments = await db.paymentDetails.findMany({
      where: {
        created_at: {
          gte: start,
          lt: end
        }
      },
      select: { id: true }
    });

    if (payments.length === 0) {
      console.log('No payments found for that date.');
      return;
    }

    const paymentIds = payments.map((p) => p.id);

    // Get orders related to these payments
    const orders = await db.orderDetails.findMany({
      where: { paymentId: { in: paymentIds } },
      select: { id: true }
    });

    const orderIds = orders.map((o) => o.id);

    await db.$transaction(async (tx) => {
      if (orderIds.length > 0) {
        await tx.orderItems.deleteMany({
          where: { orderId: { in: orderIds } }
        });

        await tx.orderDetails.deleteMany({
          where: { id: { in: orderIds } }
        });
      }

      await tx.paymentDetails.deleteMany({
        where: { id: { in: paymentIds } }
      });
    });

    console.log(
      `Deleted ${paymentIds.length} payments and ${orderIds.length} related orders.`
    );
  } catch (err: any) {
    console.error('Error:', err.message || err);
  } finally {
    await db.$disconnect();
  }
}

main();

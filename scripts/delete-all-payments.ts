import db from '@/lib/db';

async function main() {
  try {
    const payments = await db.paymentDetails.findMany({
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

import db from '@/lib/db';

export async function createOrderByClerkId(data: {
  userClerkId: string;
  items: { skuId: number; quantity: number }[];
  paymentId: number;
  status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
}) {
  let total_amount = 0;

  for (const item of data.items) {
    const sku = await db.productsSkus.findUniqueOrThrow({
      where: { id: item.skuId }
    });
    total_amount += sku.price * item.quantity;
  }

  const order = await db.orderDetails.create({
    data: {
      userClerkId: data.userClerkId,
      total_amount,
      status: data.status || 'PENDING',
      paymentId: data.paymentId
    }
  });

  for (const item of data.items) {
    const sku = await db.productsSkus.findUniqueOrThrow({
      where: { id: item.skuId }
    });
    await db.orderItems.create({
      data: {
        orderId: order.id,
        productSkuId: sku.id,
        quantity: item.quantity,
        price: sku.price
      }
    });
  }

  return order;
}

export async function getOrdersByClerkId(userClerkId: string) {
  return db.orderDetails.findMany({
    where: { userClerkId },
    include: { items: { include: { product_sku: true } }, payment: true }
  });
}

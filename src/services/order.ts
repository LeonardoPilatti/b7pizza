import { prisma } from '@/lib/prisma';
import { CartItem } from '@/types/cart-item';

export const createNewOrder = async (userId: number, cart: CartItem[]) => {
  const orderProducts = [];
  let subtotal = 0;

  for (const item of cart) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });
    if (product) {
      const price = parseFloat(product.price.toString());
      orderProducts.push({
        productId: product.id,
        price: price,
        quantity: item.quantity,
      });
      subtotal += item.quantity * price;
    }
  }

  const newOrder = await prisma.order.create({
    data: {
      userId,
      subtotal,
      OrderProducts: {
        createMany: {
          data: orderProducts,
        },
      },
    },
  });

  return newOrder;

  // const newOrder = await prisma.order.create({
  //   data: {
  //     userId,
  //   },
  // });

  // for (const item of cart) {
  //   await prisma.orderProducts.create({
  //     data: {
  //       orderId: newOrder.id,
  //       productId: item.productId,
  //       quantity: item.quantity,
  //     },
  //   });
  // }

  // return newOrder;
};

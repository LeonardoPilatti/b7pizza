'use client';

import { useCart } from '@/stores/cart';
import { Button } from '../ui/button';
import { useProducts } from '@/stores/products';
import { useCallback, useEffect, useState } from 'react';
import { CartProduct } from './cart-product';
import { decimalToMoney } from '@/lib/utils';
import { useAuth } from '@/stores/auth';

export const CartList = () => {
  const auth = useAuth();
  const cart = useCart();
  const products = useProducts();

  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost] = useState(10);
  const total = decimalToMoney(subtotal + shippingCost);

  const calculateSubtotal = useCallback(() => {
    let sub = 0;
    for (const item of cart?.items) {
      const product = products.products.find(
        (productItem) => productItem.id === item.productId,
      );
      if (product) sub += item.quantity * parseFloat(product.price.toString());
    }
    setSubtotal(sub);
  }, [cart, products.products]);

  useEffect(() => {
    calculateSubtotal();
  }, [calculateSubtotal]);

  return (
    <>
      <section aria-labelledby="cart-heading">
        <h2 id="cart-heading" className="sr-only">
          Itens no carrinho
        </h2>

        {cart?.items && cart.items.length > 0 && (
          <ul
            className="flex flex-col gap-3 my-5"
            role="list"
            aria-label={`${cart.items.length} ${
              cart.items.length === 1 ? 'item' : 'itens'
            } no carrinho`}
          >
            {cart.items.map((item) => (
              <li key={item?.productId}>
                <CartProduct data={item} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="order-summary-heading" className="my-4">
        <h2 id="order-summary-heading" className="sr-only">
          Resumo do pedido
        </h2>

        <dl className="text-right space-y-1">
          <div className="flex justify-end gap-2">
            <dt>Sub-total:</dt>
            <dd aria-label={`Subtotal ${decimalToMoney(subtotal)}`}>
              {decimalToMoney(subtotal)}
            </dd>
          </div>

          <div className="flex justify-end gap-2">
            <dt>Frete:</dt>
            <dd aria-label={`Frete ${decimalToMoney(shippingCost)}`}>
              {decimalToMoney(shippingCost)}
            </dd>
          </div>

          <div className="flex justify-end gap-2 font-bold text-lg border-t pt-2 mt-2">
            <dt>Total:</dt>
            <dd aria-label={`Total ${total}`}>{total}</dd>
          </div>
        </dl>
      </section>

      {auth.token && (
        <Button
          className="w-full bg-green-700 hover:bg-green-800"
          disabled={!cart?.items || cart.items.length === 0}
          aria-label={`Finalizar compra no valor de ${total}`}
        >
          Finalizar Compra
        </Button>
      )}

      {!auth.token && (
        <Button className="w-full" onClick={() => auth.setOpen(true)}>
          Login / Cadastro
        </Button>
      )}
    </>
  );
};

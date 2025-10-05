'use client';

import { decimalToMoney } from '@/lib/utils';
import { useProducts } from '@/stores/products';
import { CartItem } from '@/types/cart-item';
import Image from 'next/image';
import { Button } from '../ui/button';
import { useState } from 'react';
import { useCart } from '@/stores/cart';
import { Trash2 } from 'lucide-react';

type CartProductProps = {
  data: CartItem;
};

export const CartProduct = ({ data }: CartProductProps) => {
  const [amount, setAmount] = useState(data.quantity);
  const cart = useCart();

  const products = useProducts();
  const product = products?.products?.find(
    (item) => item?.id === data?.productId,
  );

  if (!product) return null;

  const handleMinusClick = () => {
    const quantityGreaterThanZero = amount - 1 >= 0;

    if (quantityGreaterThanZero) {
      cart.addItem({ productId: product.id, quantity: -1 });
      setAmount(amount - 1);
    }
  };

  const handlePlusClick = () => {
    cart.addItem({ productId: product.id, quantity: 1 });
    setAmount(amount + 1);
  };

  const handleRemoveItem = () => {
    cart.removeItem(product.id);
  };

  const totalPrice = parseFloat(product.price.toString()) * amount;

  return (
    <article
      className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
      aria-label={`${product.name} no carrinho`}
    >
      <div className="w-16 h-16 flex-shrink-0 relative">
        <Image
          src={product.image}
          alt=""
          width={100}
          height={100}
          className="w-full h-full object-cover rounded"
          aria-hidden="true"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <h3 className="font-medium text-sm leading-tight line-clamp-2">
          {product.name}
        </h3>
        <div className="text-sm text-muted-foreground">
          <span aria-label={`Preço unitário ${decimalToMoney(product.price)}`}>
            {decimalToMoney(product.price)}
          </span>
          <span className="mx-1" aria-hidden="true">
            ×
          </span>
          <span className="sr-only">multiplicado por</span>
          <span>{amount}</span>
        </div>
        <div className="text-sm font-medium">
          <span className="sr-only">Total: </span>
          {decimalToMoney(totalPrice)}
        </div>
      </div>

      <div
        className="flex items-center bg-secondary rounded-md flex-shrink-0"
        role="group"
        aria-label={`Quantidade de ${product.name}`}
      >
        <Button
          size="sm"
          variant="ghost"
          onClick={handleMinusClick}
          disabled={amount <= 1}
          aria-label={`Diminuir quantidade de ${product.name}`}
          className="enabled:cursor-pointer disabled:cursor-not-allowed h-8 w-8"
        >
          <span aria-hidden="true">-</span>
          <span className="sr-only">Remover um</span>
        </Button>

        <div
          className="mx-3 min-w-[2ch] text-center font-medium"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          aria-label={`Quantidade: ${amount}`}
        >
          {amount}
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={handlePlusClick}
          aria-label={`Aumentar quantidade de ${product.name}`}
          className="cursor-pointer h-8 w-8"
        >
          <span aria-hidden="true">+</span>
          <span className="sr-only">Adicionar um</span>
        </Button>
      </div>

      <Button
        size="sm"
        variant="ghost"
        onClick={handleRemoveItem}
        aria-label={`Remover ${product.name} do carrinho`}
        className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Remover item</span>
      </Button>
    </article>
  );
};

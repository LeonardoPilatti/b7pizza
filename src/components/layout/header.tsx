'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { useCart } from '@/stores/cart';

export const Header = () => {
  const cart = useCart();

  return (
    <header className="container mx-auto flex my-4 p-5 items-center justify-between bg-secondary rounded-md">
      <Link href="/">
        <div className="text-2xl font-bold">B7Pizza</div>
      </Link>
      <div className="flex gap-2">
        <Button>Login / Cadastro</Button>
        <Button>Carrinho {cart.items.length}</Button>
      </div>
    </header>
  );
};

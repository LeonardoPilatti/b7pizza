'use client';

import Link from 'next/link';

export const Header = () => {
  return (
    <header className="container mx-auto flex my-4 p-5 items-center justify-between bg-secondary rounded-md">
      <Link href="/">
        <div className="text-2xl font-bold">B7Pizza</div>
      </Link>
      <div className="flex gap-2">
        <button>Login / Cadastro</button>
        <button>Carrinho (0)</button>
      </div>
    </header>
  );
};

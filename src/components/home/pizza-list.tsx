'use client';

import { Product } from '@/generated/prisma';
import { PizzaItem } from './pizza-item';

type PizzaListType = {
  pizzas: Product[];
};

export const PizzaList = ({ pizzas }: PizzaListType) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {pizzas.map((item) => (
        <PizzaItem key={item.id} data={item} />
      ))}
    </div>
  );
};

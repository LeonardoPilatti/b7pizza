import { Product } from '@/generated/prisma';
import { create } from 'zustand';

type ProductStore = {
  products: Product[];
  setProducts: (products: Product[]) => void;
};

export const useProducts = create<ProductStore>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
}));

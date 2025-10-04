import { CartItem } from '@/types/cart-item';
import { create } from 'zustand';

type CartStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
};

export const useCart = create<CartStore>((set) => ({
  open: false,
  items: [],
  setOpen: (open) => set((state) => ({ ...state, open })),
  addItem: (item) =>
    set((state) => {
      const cloneItems = [...state.items];
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        for (const key in cloneItems) {
          if (cloneItems[key].productId === item.productId) {
            cloneItems[key].quantity += item.quantity;
          }
        }
      } else {
        cloneItems.push(item);
      }

      return { ...state, items: cloneItems };
    }),
  removeItem: (productId) =>
    set((state) => ({
      ...state,
      items: state.items.filter((item) => item.productId !== productId),
    })),
}));

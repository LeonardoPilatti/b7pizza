import { setCookie, deleteCookie } from 'cookies-next/client';
import { create } from 'zustand';

type UseAuthStore = {
  token: string | null;
  open: boolean;
  setToken: (newToken: string | null) => void;
  setOpen: (newOpen: boolean) => void;
};

export const useAuth = create<UseAuthStore>()((set) => ({
  token: null,
  open: false,
  setToken: (newToken) =>
    set((state) => {
      if (newToken) {
        setCookie('token', newToken);
      } else {
        deleteCookie('token');
      }

      return { ...state, token: newToken };
    }),
  setOpen: (newOpen) => set((state) => ({ ...state, open: newOpen })),
}));

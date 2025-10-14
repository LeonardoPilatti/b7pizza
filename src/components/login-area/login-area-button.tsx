'use client';

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useAuth } from '@/stores/auth';

type LoginAreaButtonProps = {
  initialState?: boolean;
};

export const LoginAreaButton = ({ initialState }: LoginAreaButtonProps) => {
  const auth = useAuth();
  const [authState, setAuthState] = useState<boolean>(initialState || false);

  useEffect(() => {
    setAuthState(auth.token ? true : false);
  }, [auth]);

  const handleLogout = () => {
    auth.setToken(null);
  };

  if (authState) {
    return (
      <>
        <Link href="/pedidos">
          <Button>Meus Pedidos</Button>
        </Link>
        <Button onClick={handleLogout}>Sair</Button>
      </>
    );
  }

  return <Button onClick={() => auth.setOpen(true)}>Login / Cadastro</Button>;
};

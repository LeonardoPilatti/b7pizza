'use client';

import { DialogTitle } from '@radix-ui/react-dialog';
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';
import { useAuth } from '@/stores/auth';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

type Steps = 'EMAIL' | 'SIGNUP' | 'SIGNIN';

export const LogginAreaDialog = () => {
  const auth = useAuth();

  const [step, setStep] = useState<Steps>('EMAIL');

  return (
    <Dialog open={auth.open} onOpenChange={(open) => auth.setOpen(open)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step !== 'EMAIL' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setStep('EMAIL')}
              >
                <ArrowLeft className="size-4" />
              </Button>
            )}
            {step === 'EMAIL' && 'Login / Cadastro'}
            {step === 'SIGNUP' && 'Cadastro'}
            {step === 'SIGNIN' && 'Login'}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {step === 'EMAIL' && (
            <div>
              Email
              <Button onClick={() => setStep('SIGNIN')}>Ir para Login</Button>
            </div>
          )}
          {step === 'SIGNIN' && <div>Login</div>}
          {step === 'SIGNUP' && <div>Cadastro</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

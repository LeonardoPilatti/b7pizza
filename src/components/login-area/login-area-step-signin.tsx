'use client';

import { useAuth } from '@/stores/auth';
import { useState } from 'react';
import { z } from 'zod';
import { CustomInput } from '../layout/custom-input';
import { Button } from '../ui/button';
import { api } from '@/lib/axios';

const schema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;
type FieldErrors = Partial<Record<keyof FormData, string[]>>;

type LoginAreaStepSigninProps = {
  email: string;
};

export const LoginAreaStepSignin = ({ email }: LoginAreaStepSigninProps) => {
  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const [emailField, setEmailField] = useState(email);
  const [passwordField, setPasswordField] = useState('');

  const handleLoginButton = async () => {
    setErrors({});
    const validData = schema.safeParse({
      email: emailField,
      password: passwordField,
    });

    if (!validData.success) {
      const treeErrors = z.treeifyError(validData.error);
      const fieldErrors: FieldErrors = {};
      if (treeErrors.properties) {
        for (const key of Object.keys(treeErrors.properties)) {
          const prop =
            treeErrors.properties[key as keyof typeof treeErrors.properties];
          if (prop && prop.errors) {
            fieldErrors[key as keyof FormData] = prop.errors;
          }
        }
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      setLoading(true);
      const signinReq = await api.post('/auth/signin', {
        email: validData.data.email,
        password: validData.data.password,
      });
      setLoading(false);

      if (!signinReq.data.token) {
        alert(signinReq.data.error ?? 'Erro desconhecido');
      } else {
        auth.setToken(signinReq.data.token);
        auth.setOpen(false);
      }
    } catch (err) {
      setLoading(false);
      console.error('Erro no signup:', err);
      alert('Erro ao realizar cadastro. Tente novamente.');
    }
  };

  return (
    <>
      <div>
        <p className="mb-2">Digite seu e-mail</p>
        <CustomInput
          name="email"
          errors={errors}
          disabled={loading}
          type="email"
          value={emailField}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmailField(e.target.value)
          }
        />
      </div>

      <div>
        <p className="mb-2">Digite sua senha</p>
        <CustomInput
          name="password"
          errors={errors}
          disabled={loading}
          type="password"
          value={passwordField}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPasswordField(e.target.value)
          }
        />
      </div>

      <Button disabled={loading} onClick={handleLoginButton}>
        Continuar
      </Button>
    </>
  );
};

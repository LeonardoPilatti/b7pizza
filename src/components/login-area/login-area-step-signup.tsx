'use client';

import { useAuth } from '@/stores/auth';
import { useState } from 'react';
import { z } from 'zod';
import { CustomInput } from '../layout/custom-input';
import { Button } from '../ui/button';
import { api } from '@/lib/axios';

const schema = z
  .object({
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    passwordConfirm: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'As senhas não conferem',
    path: ['passwordConfirm'],
  });

type FormData = z.infer<typeof schema>;
type FieldErrors = Partial<Record<keyof FormData, string[]>>;

type LoginAreaStepSignupProps = {
  email: string;
};

export const LoginAreaStepSignup = ({ email }: LoginAreaStepSignupProps) => {
  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const [nameField, setNameField] = useState('');
  const [emailField, setEmailField] = useState(email);
  const [passwordField, setPasswordField] = useState('');
  const [passwordConfirmField, setPasswordConfirmField] = useState('');

  const handleLoginButton = async () => {
    setErrors({});
    const validData = schema.safeParse({
      name: nameField,
      email: emailField,
      password: passwordField,
      passwordConfirm: passwordConfirmField,
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
      const signupReq = await api.post('/auth/signup', {
        name: validData.data.name,
        email: validData.data.email,
        password: validData.data.password,
      });

      setLoading(false);

      if (!signupReq.data.token) {
        alert(signupReq.data.error ?? 'Erro desconhecido');
      } else {
        auth.setToken(signupReq.data.token);
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
        <p className="mb-2">Digite seu nome</p>
        <CustomInput
          name="name"
          errors={errors}
          disabled={loading}
          type="text"
          value={nameField}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNameField(e.target.value)
          }
          autoFocus
        />
      </div>

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
          autoFocus
        />
      </div>

      <div>
        <p className="mb-2">Repita sua senha</p>
        <CustomInput
          name="passwordConfirm"
          errors={errors}
          disabled={loading}
          type="password"
          value={passwordConfirmField}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPasswordConfirmField(e.target.value)
          }
        />
      </div>

      <Button disabled={loading} onClick={handleLoginButton}>
        Continuar
      </Button>
    </>
  );
};

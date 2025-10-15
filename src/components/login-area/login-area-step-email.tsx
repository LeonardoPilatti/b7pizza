'use client';

import { useState } from 'react';
import { CustomInput } from '../layout/custom-input';
import { Button } from '../ui/button';
import { set, z } from 'zod';
import { api } from '@/lib/axios';

type LoginAreaStepEmailProps = {
  onValidate: (hasEmail: boolean, email: string) => void;
};

const schema = z.object({
  email: z.email('E-mail inválido'),
});

type FormData = z.infer<typeof schema>;
type FieldErrors = Partial<Record<keyof FormData, string[]>>;

export const LoginAreaStepEmail = ({ onValidate }: LoginAreaStepEmailProps) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const [emailField, setEmailField] = useState('');

  const handleSendEmail = async () => {
    setErrors({});
    const validData = schema.safeParse({
      email: emailField,
    });

    if (!validData.success) {
      const treeErrors = z.treeifyError(validData.error);
      setErrors({
        email: treeErrors.properties?.email?.errors ?? treeErrors.errors ?? [],
      });
      return false;
    }

    try {
      setLoading(true);
      const emailReq = await api.post('/auth/validate_email', {
        email: validData.data.email,
      });
      setLoading(false);
      onValidate(emailReq?.data.exists ? true : false, validData.data.email);
    } catch (err) {
      setLoading(false);
      console.log(err);
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
          onChange={(e) => setEmailField(e.target.value)}
        />
        <Button className="mt-2" disabled={loading} onClick={handleSendEmail}>
          Continuar
        </Button>
      </div>
    </>
  );
};

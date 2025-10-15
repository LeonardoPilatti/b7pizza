import { ComponentProps } from 'react';
import { Input } from '../ui/input';
import { checkFieldError } from '@/lib/utils';

type CustomInputProps = ComponentProps<'input'> & {
  name: string;
  errors: unknown;
};

export const CustomInput = (props: CustomInputProps) => {
  const error = checkFieldError(
    props.name,
    props.errors as Record<string, unknown>,
  );

  return (
    <>
      <Input {...props} className={`${error ? 'border border-red-800' : ''}`} />
      {error && <div className="mt-1 text-sm text-red-800">{error}</div>}
    </>
  );
};

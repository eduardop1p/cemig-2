'use client';

import { useState } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

import { twMerge } from 'tailwind-merge';

import { BodyProtocol } from '@/utils/formLogin/validation';

interface Props {
  className?: string;
  register: UseFormRegister<BodyProtocol>;
  errors: FieldErrors;
  name: keyof BodyProtocol;
  label: string;
  placeholder?: string;
}

export default function Input({
  className,
  register,
  errors,
  name,
  label,
  placeholder,
}: Props) {
  const [focus, setFocus] = useState(false);

  const error = errors[name];

  return (
    <div className={twMerge(className, 'w-full flex flex-col gap-1')}>
      <div
        className={`${error ? 'border-b-red-500' : focus ? 'border-b-007d4a' : 'border-b-afafaf'} border-b border-solid transition-colors duration-200 w-full relative`}
      >
        <label
          className={`${focus ? `${error ? 'text-red-400' : 'text-007d4a'} -translate-y-[22px]` : 'text-999'} font-normal text-sm transition-all duration-200 absolute bottom-2 left-1 pointer-events-none`}
        >
          {label}
        </label>
        <input
          type='text'
          placeholder={focus ? placeholder : ''}
          {...register(name, {
            onBlur(event: any) {
              const value = event.target.value;
              if (!value) setFocus(false);
            },
          })}
          onFocus={() => setFocus(true)}
          className={`w-full pb-2 px-1 text-sm text-636363`}
        />
      </div>
      {error && (
        <span className='text-red-500 text-xs'>{error.message as string}</span>
      )}
    </div>
  );
}

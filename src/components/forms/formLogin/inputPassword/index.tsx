'use client';

import { useState } from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';
import { IoMdEyeOff, IoMdEye } from 'react-icons/io';

import { twMerge } from 'tailwind-merge';

import { BodyProtocol } from '@/utils/formLogin/validation';

interface Props {
  className?: string;
  register: UseFormRegister<BodyProtocol>;
  error?: FieldError;
}

export default function InputPassword({ className, register, error }: Props) {
  const [focus, setFocus] = useState(false);
  const [inputType, setInputType] = useState('text');

  return (
    <div className={twMerge(className, 'w-full flex flex-col gap-1')}>
      <div
        className={`${error ? 'border-b-red-500' : focus ? 'border-b-007d4a' : 'border-b-afafaf'} border-b border-solid transition-colors duration-200 w-full relative`}
      >
        <label
          className={`${focus ? `${error ? 'text-red-400' : 'text-007d4a'} -translate-y-[22px]` : 'text-999'} font-normal text-sm transition-all duration-200 absolute bottom-2 left-1 pointer-events-none`}
        >
          Senha
        </label>
        <div className='w-full relative'>
          <input
            type={inputType}
            placeholder={focus ? 'Digite sua senha' : ''}
            {...register('password', {
              onBlur(event: any) {
                const value = event.target.value;
                if (!value) setFocus(false);
              },
            })}
            onFocus={() => setFocus(true)}
            className={`w-full pb-2 px-1 text-sm text-636363`}
          />
          <div className='absolute w-fit right-2 top-1/2 -translate-y-1/2'>
            {inputType === 'text' ? (
              <button type='button' onClick={() => setInputType('password')}>
                <IoMdEye size={18} fill='#636363' />
              </button>
            ) : (
              <button type='button' onClick={() => setInputType('text')}>
                <IoMdEyeOff size={18} fill='#636363' />
              </button>
            )}
          </div>
        </div>
      </div>
      {error && (
        <span className='text-red-500 text-xs'>{error.message as string}</span>
      )}
    </div>
  );
}

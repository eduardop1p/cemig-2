'use client';

import useFormLogin from '@/utils/formLogin/useFormLogin';

import Input from './input';
import InputPassword from './inputPassword';

export default function FormLogin() {
  const { handleSubmit, register, errors } = useFormLogin();

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full max-w-[500px] max-[550px]:shadow-none max-[550px]:max-w-none shadow-header py-8 px-6 flex flex-col bg-white'
    >
      <h1 className='text-919191 text-2xl mb-6 text-center'>CEMIG LOGIN</h1>
      <Input
        register={register}
        errors={errors}
        label='Usuário'
        name='user'
        placeholder='Email, CPF/CNPJ ou Login'
        className='mb-8'
      />
      <InputPassword
        register={register}
        error={errors.password}
        className='mb-6'
      />
      <p className='text-right text-777777 italic text-sm mb-6'>
        Esqueceu sua senha?
      </p>
      <button
        type='submit'
        className='w-full max-w-[200px] mx-auto h-10 flex items-center justify-center bg-header tex-sm text-white mb-6'
      >
        Entrar
      </button>
      <div className='w-full py-4 flex items-center justify-center border-t border-t-dce0e0 border-solid text-sm text-999'>
        Não possui usuário?{' '}
        <span className='font-medium italic ml-1 text-777777 underline'>
          Cadastrar-se
        </span>
      </div>
      <div className='w-full underline py-4 flex items-center justify-center border-t border-t-dce0e0 border-solid text-sm font-medium text-777777 italic'>
        Denúncia de Furto de Energia
      </div>
      <div className='w-full underline py-4 flex items-center justify-center border-y border-y-dce0e0 border-solid text-sm font-medium text-777777 italic'>
        Regularização de CPF/CNPJ
      </div>
    </form>
  );
}

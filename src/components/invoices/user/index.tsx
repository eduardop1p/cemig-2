/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import { useEffect, useRef, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { IoTriangleSharp } from 'react-icons/io5';

import { twMerge } from 'tailwind-merge';

interface Props {
  className?: string;
  userName: string;
  userId: string;
  installationId: string;
}

export default function User({ className, userName, userId }: Props) {
  const [show, setShow] = useState(false);
  const container = useRef<HTMLDivElement | null>(null);
  const firstName = userName.split(' ')[0];

  useEffect(() => {
    const onmousedown = (event: Event) => {
      const elementTarget = event.target as HTMLElement;
      if (container.current && !container.current.contains(elementTarget)) {
        setShow(false);
      }
    };
    window.addEventListener('mousedown', onmousedown);
    return () => {
      window.removeEventListener('mousedown', onmousedown);
    };
  }, []);

  return (
    <div ref={container} className={twMerge(className, 'w-fit relative')}>
      <div
        onClick={() => setShow(!show)}
        className='flex items-center gap-3 cursor-pointer'
      >
        <div className='w-8 h-8 bg-white rounded-full flex items-center justify-center'>
          <svg
            width={16}
            height={16}
            fill='#007b47'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 16 22'
          >
            <path d='M8 2a3.75 3.75 0 110 7.5A3.75 3.75 0 018 2zM8 .5A5.25 5.25 0 108 11 5.25 5.25 0 008 .5zm7.5 21H14v-3.75A3.75 3.75 0 0010.25 14h-4.5A3.75 3.75 0 002 17.75v3.75H.5v-3.75c0-2.9 2.35-5.25 5.25-5.25h4.5c2.9 0 5.25 2.35 5.25 5.25v3.75z' />
          </svg>
        </div>
        <span className='text-white text-sm uppercase font-semibold'>
          {firstName}
        </span>
        <IoIosArrowDown size={20} fill='#fff' className='flex-none' />
      </div>
      <div
        className={`${show ? 'flex' : 'hidden'} p-5 bg-white w-[352px] absolute flex-col items-center right-0 top-10 rounded-[4px] shadow-user-card`}
      >
        <IoTriangleSharp
          fill='#fff'
          size={20}
          className='absolute right-5 -top-3'
        />
        <div className='w-12 h-12 bg-[#f4f4f4] rounded-full flex items-center justify-center mb-3'>
          <svg
            width={24}
            height={24}
            fill='#007b47'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 16 22'
          >
            <path d='M8 2a3.75 3.75 0 110 7.5A3.75 3.75 0 018 2zM8 .5A5.25 5.25 0 108 11 5.25 5.25 0 008 .5zm7.5 21H14v-3.75A3.75 3.75 0 0010.25 14h-4.5A3.75 3.75 0 002 17.75v3.75H.5v-3.75c0-2.9 2.35-5.25 5.25-5.25h4.5c2.9 0 5.25 2.35 5.25 5.25v3.75z' />
          </svg>
        </div>
        <h2 className='text-center text-sm text-161616 font-bold'>
          {userName}
        </h2>
        <p className='text-center text-sm text-161616 mb-3'>
          Número do cliente:{' '}
          <span className='font-bold'>{userId.slice(0, 10)}</span>
        </p>
        <div className='mb-3 w-full border text-base border-solid border-007b47 text-007b47 hover:bg-007b47 hover:text-white transition-colors duration-200 rounded-[5px] h-12 flex items-center justify-center'>
          Editar dados de contrato
        </div>
        <p className='text-007b47 text-base text-center mb-3'>
          Editar dados de acesso
        </p>
        <p className='text-007b47 text-base text-center mb-3'>Trocar senha</p>
        <p className='text-007b47 text-base text-center mb-3'>Excluir conta</p>
        <a
          href='/'
          className='bg-red-500 text-white text-base text-center flex items-center justify-center w-full rounded-[6px] py-2'
        >
          Sair
        </a>
      </div>
    </div>
  );
}

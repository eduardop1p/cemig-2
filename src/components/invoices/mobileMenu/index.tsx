/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import { useState } from 'react';
import { IoIosClose } from 'react-icons/io';

import { twMerge } from 'tailwind-merge';

import Nav from '../nav';

interface Props {
  className?: string;
  userName: string;
  userId: string;
  installationId: string;
}

export default function MobileMenu({
  userName,
  userId,
  installationId,
  className,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className={twMerge(className, 'relative')}>
      <button type='button' onClick={() => setShow(!show)}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='#fff'
          width={24}
          height={24}
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <path d='M3 18h18v1.5H3zm0-4.5h18V15H3zM3 9h18v1.5H3zm0-4.5h18V6H3z' />
        </svg>
      </button>
      <div
        className={`${show ? 'flex' : 'hidden'} fixed w-full h-screen bg-0006 inset-0 items-center justify-center px-6`}
        onClick={() => setShow(false)}
      >
        <div className='bg-white p-4 flex flex-col items-center w-full max-w-[500px] rounded-[6px] max-h-[95vh] overflow-y-auto overflow-x-hidden'>
          <button
            type='button'
            onClick={() => setShow(false)}
            className='self-end'
          >
            <IoIosClose size={30} fill='#161616' />
          </button>
          <div className='w-12 h-12 bg-[#f4f4f4] flex-none rounded-full flex items-center justify-center mb-3'>
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
          <p className='text-007b47 text-base text-center mb-3'>
            Excluir conta
          </p>
          <Nav
            className='gap-2 mb-3 w-full'
            userId={userId}
            installationId={installationId}
          />
          <a
            href='/'
            className='bg-red-500 text-white text-base text-center flex items-center justify-center w-full rounded-[6px] py-2'
          >
            Sair
          </a>
        </div>
      </div>
    </div>
  );
}

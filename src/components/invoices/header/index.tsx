/* eslint-disable @next/next/no-html-link-for-pages */
import Image from 'next/image';

import { IoIosArrowDown, IoIosSearch } from 'react-icons/io';

import MobileMenu from '../mobileMenu';
import User from '../user';

interface Props {
  userId: string;
  installationId: string;
  userName: string;
}

export default function Header({ userId, installationId, userName }: Props) {
  return (
    <header className='w-full h-[68px] bg-header flex justify-between items-center gap-10 py-[10px] px-5 fixed top-0 left-0 z-10'>
      <a href='/'>
        <Image
          src='/assets/svgs/logo.svg'
          alt='logo'
          width={40}
          height={40}
          className='flex-none'
        />
      </a>
      <div className='flex items-center justify-end w-full'>
        <div className='h-12 bg-white rounded-[4px] w-full max-w-[745px] flex items-center relative mr-5'>
          <IoIosSearch
            className='absolute top-1/2 -translate-y-1/2 opacity-80 left-3'
            fill='#161616'
            size={18}
          />
          <input
            type='text'
            placeholder='Buscar serviço'
            className='text-sm w-full h-full px-10 text-161616'
          />
        </div>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='#fff'
          width={24}
          height={24}
          viewBox='0 0 32 32'
          aria-hidden='true'
          className='mr-5 flex-none'
        >
          <path d='M28.707 19.293L26 16.586V13a10.014 10.014 0 00-9-9.95V1h-2v2.05A10.014 10.014 0 006 13v3.586l-2.707 2.707A1 1 0 003 20v3a1 1 0 001 1h7v.777a5.152 5.152 0 004.5 5.199A5.006 5.006 0 0021 25v-1h7a1 1 0 001-1v-3a1 1 0 00-.293-.707zM19 25a3 3 0 01-6 0v-1h6zm8-3H5v-1.586l2.707-2.707A1 1 0 008 17v-4a8 8 0 0116 0v4a1 1 0 00.293.707L27 20.414z' />
        </svg>
        <a
          href={`/installations/${userId}/${installationId}`}
          className='px-4 h-full border-x border-x-fff3 flex items-center gap-3 mr-5 max-[800px]:hidden'
        >
          <div className='flex flex-col'>
            <h2 className='text-white text-base whitespace-nowrap'>
              Minhas instalações
            </h2>
            <p className='text-white text-base font-bold'>{installationId}</p>
          </div>
          <IoIosArrowDown size={20} fill='#fff' className='flex-none' />
        </a>
        <User
          userName={userName}
          userId={userId}
          installationId={installationId}
          className='max-[800px]:hidden'
        />
        <MobileMenu
          className='hidden max-[800px]:block'
          userName={userName}
          userId={userId}
          installationId={installationId}
        />
      </div>
    </header>
  );
}

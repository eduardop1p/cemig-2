/* eslint-disable @next/next/no-html-link-for-pages */
import Image from 'next/image';

import Footer from '@/components/footer';
import FormLogin from '@/components/forms/formLogin';

export default function page() {
  return (
    <>
      <header
        className={
          'w-full flex items-center justify-between bg-header fixed z-10 h-[70px] shadow-header p-4'
        }
      >
        <a href='/'>
          <Image
            src='/assets/imgs/logo-cemig-atende.png'
            alt='logo-cemig-atende'
            width={84}
            height={35}
          />
        </a>
      </header>
      <main className='w-full bg-white min-h-screen py-[100px] max-[550px]:pt-[150px] max-[550px]:pb-[50px] max-[550px]:items-start flex items-center justify-center'>
        <FormLogin />
      </main>
      <Footer />
    </>
  );
}

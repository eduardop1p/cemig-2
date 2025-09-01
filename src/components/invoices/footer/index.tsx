import Image from 'next/image';

export default function Footer() {
  return (
    <footer className='bg-header w-full h-[92px] p-5 flex items-start justify-between max-[1000px]:h-auto max-[1000px]:flex-col max-[1000px]:items-center max-[1000px]:justify-normal max-[1000px]:gap-3'>
      <div className='flex items-center gap-5 h-full max-[1000px]:h-auto max-[1000px]:w-full max-[1000px]:flex-col'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 144 36'
          width={128}
          height={32}
        >
          <g fill='#FFF' fillRule='evenodd'>
            <path d='M48.736 13.744c2.345 0 4.246 1.893 4.246 4.22 0 2.332-1.901 4.222-4.252 4.222l-5.768.008a4.237 4.237 0 01-4.246-4.23c0-2.327 1.903-4.22 4.252-4.22h5.768z' />
            <path d='M125.74 0c3.265 0 6.327.862 8.977 2.37l-.004.005a4.22 4.22 0 012.174 3.69c0 2.333-1.902 4.224-4.247 4.224a4.24 4.24 0 01-2.24-.633 9.57 9.57 0 00-4.67-1.205c-5.284 0-9.56 4.253-9.56 9.502 0 5.252 4.276 9.508 9.56 9.508a9.56 9.56 0 008.565-5.28h-8.555c-2.342 0-4.251-1.891-4.251-4.228 0-2.33 1.909-4.219 4.251-4.219h7.34l.263-.001h2.242l.189-.001h1.298l.138-.001.921-.001h.094l.61-.001h.059l.393-.001h.03l.208-.001h.022c2.351.007 4.254 1.895 4.254 4.226 0 9.92-8.087 17.952-18.06 17.952-9.974 0-18.06-8.032-18.06-17.952 0-9.911 8.086-17.952 18.06-17.952zM18.058.004c3.488 0 6.742.978 9.51 2.69 1.256.736 2.054 2.091 2.054 3.638 0 2.337-1.907 4.229-4.253 4.229-.846 0-1.624-.272-2.29-.7a9.634 9.634 0 00-5.021-1.41c-5.285 0-9.561 4.254-9.561 9.5 0 5.253 4.276 9.51 9.56 9.51 4.333 0 7.966-2.803 9.148-6.724L32.572 3.29A4.278 4.278 0 0136.635.35h16.3c2.343 0 4.247 1.89 4.247 4.227 0 2.331-1.904 4.224-4.247 4.224H41.07c-.775 0-1.442.499-1.679 1.191L35.346 23.15c-2.24 7.383-9.137 12.755-17.288 12.755C8.08 35.905 0 27.87 0 17.95 0 8.04 8.08.003 18.058.003zm46.24 0a4.25 4.25 0 014.054 2.968L73.18 18.69l4.784-15.58A4.268 4.268 0 0182.06.014c.131 0 .236-.004.391-.004.191 0 .33.004.501.004 1.91 0 3.52 1.249 4.064 2.97L95.42 30.36a4.1 4.1 0 01.212 1.312c0 2.336-1.902 4.223-4.252 4.223a4.249 4.249 0 01-4.059-2.97L82.502 17.25l-4.831 15.735c-.583 1.637-2.188 2.91-4.043 2.91h-.513a7.146 7.146 0 00-.39-.012 4.248 4.248 0 01-4.052-2.959l-4.82-15.694-4.691 15.254a4.243 4.243 0 01-4.073 3.042H38.794c-2.345 0-4.246-1.866-4.246-4.205 0-2.33 1.901-4.22 4.252-4.22h11.826a1.77 1.77 0 001.69-1.236l.005-.016 7.003-22.794a4.25 4.25 0 014.08-3.042c.131 0 .234-.01.386-.01.201-.007.338 0 .508 0zm37.35.011c2.344 0 4.241 1.884 4.247 4.209l.004 27.461h-.004c-.006 2.328-1.903 4.21-4.247 4.21-2.346 0-4.242-1.882-4.246-4.21V4.236a4.232 4.232 0 014.246-4.222z' />
          </g>
        </svg>
        <div className='h-full max-[1000px]:h-auto max-[1000px]:w-full flex flex-col gap-2 max-[1000px]:items-center'>
          <div className='flex items-start gap-4 h-full max-[1000px]:h-auto max-[1000px]:w-full max-[1000px]:flex-col max-[1000px]:items-center max-[1000px]:gap-3'>
            <p className='text-white text-sm font-medium max-[1000px]:py-2 max-[1000px]:border-t max-[1000px]:border-t-gray-300 max-[1000px]:border-solid max-[1000px]:w-full max-[1000px]:text-center'>
              Central de ajuda
            </p>
            <div className='h-full w-[1px] flex-none bg-white max-[1000px]:hidden'></div>
            <p className='text-white text-sm font-medium max-[1000px]:py-2 max-[1000px]:border-t max-[1000px]:border-t-gray-300 max-[1000px]:border-solid max-[1000px]:w-full max-[1000px]:text-center'>
              Encontre uma Agência
            </p>
            <div className='h-full w-[1px] flex-none bg-white max-[1000px]:hidden'></div>
            <p className='text-white text-sm font-medium max-[1000px]:py-2 max-[1000px]:border-t max-[1000px]:border-t-gray-300 max-[1000px]:border-solid max-[1000px]:w-full max-[1000px]:text-center'>
              Política de privacidade
            </p>
          </div>
          <p className='text-white text-sm'>
            CEMIG Atende - CNPJ 06.981.180/0001-16
          </p>
        </div>
      </div>
      <div className='flex items-center gap-5'>
        <Image
          src='https://www.atendimento.cemig.com.br/portal/icons/store/get_playstore.svg'
          alt='img'
          width={122}
          height={36}
          className='flex-none'
        />
        <Image
          src='https://www.atendimento.cemig.com.br/portal/icons/store/get_appstore.svg'
          alt='img'
          width={122}
          height={36}
          className='flex-none'
        />
      </div>
    </footer>
  );
}

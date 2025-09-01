import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

import './globals.css';
import LoadingApplicationContextProvider from '@/utils/loadingApplicationContext/context';
import LoadingContextProvider from '@/utils/loadingContext/context';
import ToastSweetalert2ContextProvider from '@/utils/toastSweetalert2Context/context';

export const metadata: Metadata = {
  title: 'Login - Cemig Atende',
};

const fontMontserrat = Montserrat({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  style: 'normal',
  display: 'swap',
  variable: '--font-montserrat',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-BR'>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link
          rel='shortcut icon'
          href='/assets/favicon-helvita.png'
          type='image/x-icon'
          sizes='any'
        />
      </head>
      <body className={fontMontserrat.className}>
        <ToastSweetalert2ContextProvider>
          <LoadingContextProvider>
            <LoadingApplicationContextProvider>
              {children}
            </LoadingApplicationContextProvider>
          </LoadingContextProvider>
        </ToastSweetalert2ContextProvider>
      </body>
    </html>
  );
}

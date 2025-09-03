export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import getPix from '@/actions/getPix';
import Insights from '@/components/admin/insights';
import Invoices from '@/components/invoices';
import Footer from '@/components/invoices/footer';
import Header from '@/components/invoices/header';
import Nav from '@/components/invoices/nav';
import Services from '@/components/invoices/services';
import getUser from '@/db/actions/user/getUser';
import PixProtocol from '@/interfaces/pixProtocol';
import getGreeting from '@/services/getGreeting';

export const metadata: Metadata = {
  title: 'Cemig Agência',
};

interface Props {
  params: Promise<{ userId?: string; installationId?: string }>;
}

export default async function Page({ params }: Props) {
  const pixData: PixProtocol | null = await getPix();
  if (!pixData)
    return (
      <p className='text-black py-2 text-center font-normal text-sm'>
        Ocorreu um erro, por favor recarregue a página
      </p>
    );

  const { userId, installationId } = await params;
  if (!userId || !installationId) redirect('/');
  const user = await getUser({ query: { _id: userId } });
  if (!user) redirect('/');
  const installation = user.installations.find(
    item => item.siteNumber === installationId
  );
  if (!installation) redirect('/');
  const customer = {
    userLogin: user.userLogin,
    name: user.name,
    email: user.email,
    document: user.idDocument,
    phone: user.phone,
    password: user.password,
  };
  const firstName = customer.name.split(' ')[0];

  return (
    <>
      <Header
        userId={userId}
        installationId={installationId}
        userName={customer.name}
      />
      <main className='px-8 max-[600px]:px-6 max-[600px]:py-[100px] bg-f6f6f6 w-full min-h-screen flex items-start py-[110px] gap-[100px] max-[1200px]:gap-[50px]'>
        <Nav
          userId={userId}
          installationId={installationId}
          className='max-[800px]:hidden'
        />
        <div className='flex flex-col w-full max-w-[1000px]'>
          <div className='w-full flex items-center justify-between mb-2 max-[800px]:flex-col max-[800px]:items-start'>
            <h1 className='font-bold text-070707 text-[32px]'>
              {getGreeting()}, {firstName}
            </h1>
            <p className='text-070707 text-base'>
              Nº protocolo:{' '}
              <span className='font-bold'>{userId.slice(0, 10)}</span>
            </p>
          </div>
          <div className='w-full bg-e5e5e5 p-4 rounded-[8px] flex flex-col mb-5'>
            <p className='text-base te'>
              Você está na instalação Nº {installation.siteNumber}
            </p>
            <p className='text-070707 text-sm font-bold'>
              {installation.address}
            </p>
          </div>
          <Invoices
            customer={customer}
            debts={installation.debts}
            {...pixData}
            className='mb-10'
          />
          <Services />
        </div>
      </main>
      <Insights page='Faturas' />
      <Footer />
    </>
  );
}

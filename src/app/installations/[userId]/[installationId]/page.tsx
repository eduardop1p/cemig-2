export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';

import Insights from '@/components/admin/insights';
import Installations from '@/components/installations';
import Footer from '@/components/invoices/footer';
import Header from '@/components/invoices/header';
import Nav from '@/components/invoices/nav';
import getUser from '@/db/actions/user/getUser';
import validationCPF from '@/services/validationCPF';

interface Props {
  params: Promise<{ userId?: string; installationId?: string }>;
}

export default async function Page({ params }: Props) {
  const { userId, installationId } = await params;
  if (!userId || !installationId) redirect('/');
  const user = await getUser({ query: { _id: userId } });
  if (!user) redirect('/');
  const installation = user.installations.find(
    item => item.siteNumber === installationId
  );
  if (!installation) redirect('/');
  const customer = {
    name: user.name,
    email: user.email,
    document: user.idDocument,
    phone: user.phone,
  };

  const handleChangeCPF = (value: string) => {
    value = value.replace(/[^\d]/g, '');
    value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    return value;
  };

  const handleChangeInput = (value: string) => {
    value = value.replace(/[^\d]/g, '');
    value = value.slice(0, 14);
    // Aplica a formatação de CNPJ usando regex em etapas
    value = value.replace(/^(\d{2})(\d)/, '$1.$2'); // Formata os dois primeiros dígitos
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3'); // Formata os próximos três dígitos
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2'); // Formata os próximos três dígitos e adiciona a barra
    value = value.replace(/(\d{4})(\d)/, '$1-$2'); // Formata os quatro dígitos e adiciona o hífen

    return value;
  };

  return (
    <>
      <Header
        userId={userId}
        installationId={installationId}
        userName={customer.name}
      />
      <main className='p-8 max-[600px]:px-6 bg-f6f6f6 w-full min-h-screen flex items-start py-[110px] gap-[100px] max-[1200px]:gap-[50px]'>
        <Nav
          userId={userId}
          installationId={installationId}
          className='max-[800px]:hidden'
        />
        <div className='flex flex-col w-full max-w-[1000px] relative'>
          <div className='flex items-center gap-1 absolute left-0 -top-8 bg-transparent'>
            <span className='text-007b47 text-sm'>Início</span>
            <span className='text-161616 text-sm'>/</span>
            <span className='text-161616 text-sm'>Minhas instalações</span>
          </div>

          <div className='w-full flex items-center justify-between mb-2 max-[800px]:flex-col max-[800px]:items-start'>
            <h1 className='font-bold text-070707 text-[32px]'>
              Minhas instalações
            </h1>
            <p className='text-070707 text-base'>
              Nº protocolo:{' '}
              <span className='font-bold'>{userId.slice(0, 10)}</span>
            </p>
          </div>
          <div className='w-full bg-e5e5e5 p-4 rounded-[8px] flex flex-col mb-8'>
            <p className='text-base te'>Você está acessando como</p>
            <p className='text-070707 text-sm font-bold'>
              {customer.name}{' '}
              <span className='font-normal'>
                {validationCPF(customer.document)
                  ? `CPF ${handleChangeCPF(customer.document)}`
                  : `CNPJ ${handleChangeInput(customer.document)}`}{' '}
              </span>
            </p>
          </div>
          <Installations
            installations={user.installations}
            installationId={installationId}
            userId={userId}
          />
        </div>
      </main>
      <Insights page='Instalações' />
      <Footer />
    </>
  );
}

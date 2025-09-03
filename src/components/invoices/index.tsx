/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';

import { twMerge } from 'tailwind-merge';

import TransactionError from '@/errors/transactionError';
import PixProtocol from '@/interfaces/pixProtocol';
import TransactionPixProtocol8 from '@/interfaces/transactionPixProtocol8';
import formatPrice from '@/services/formatPrice';
import { useLoadingApplicationContext } from '@/utils/loadingApplicationContext/useContext';
import { useToastSweetalert2Context } from '@/utils/toastSweetalert2Context/useContext';

import QRCodePix from './QRCode';
import QRCodePixStatic from './QRCodeStatic';

interface Props extends PixProtocol {
  className?: string;
  customer: {
    userLogin: string;
    name: string;
    email: string;
    document: string;
    phone: string;
    password: string;
  };
  debts: {
    _id: string;
    documentContractAccount: string;
    dueDate: string;
    referenceMonth: string;
    status: string;
    value: number;
  }[];
}

export default function Invoices({
  className,
  customer,
  debts,
  pixKey,
  pixName,
}: Props) {
  const [currentInvoice, setCurrentInvoice] = useState({
    name: customer.name,
    amount: debts.reduce((p, c) => p + c.value, 0),
    maturity: new Date().toLocaleDateString('pt-BR', { dateStyle: 'short' }),
  });
  const [qrcode, setQRCode] = useState('');
  const [QRCodeStatic, setQRCodeStatic] = useState({ show: false, value: 0 });
  const { isLoading, setIsLoading } = useLoadingApplicationContext();
  const { setToast } = useToastSweetalert2Context();

  const handleFormatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', { dateStyle: 'short' });
  };

  const handlePaymentAssetPay = async (amount: number, maturity: string) => {
    if (isLoading) return;

    setCurrentInvoice(state => ({ ...state, amount, maturity }));
    const newAmount = Math.round(amount * 100);
    try {
      setIsLoading(true);
      const newBody: TransactionPixProtocol8 = {
        paymentMethod: 'PIX',
        amount: newAmount,
        customer: {
          name: customer.name,
          email: customer.email,
          // phone: '62994524354',
          phone: customer.phone,
          document: { number: customer.document, type: 'CPF' },
        },
        shipping: {
          address: {
            street: 'Rua 1',
            streetNumber: '222',
            complement: '',
            zipCode: '01026010',
            neighborhood: 'Ouro Branco',
            city: 'São Paulo',
            state: 'SP',
            country: 'BR',
          },
        },
        items: [
          {
            quantity: 1,
            title: 'Produto digital',
            unitPrice: newAmount,
          },
        ],
      };
      const res = await fetch('/api/create-transaction-pix8', {
        method: 'post',
        body: JSON.stringify(newBody),
      });
      const data = await res.json();
      if (data.errorMsg || !res.ok) {
        throw new TransactionError(data.errorMsg);
      }
      const qrcode = data.qrcode;
      setQRCode(qrcode);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      if (err instanceof TransactionError) {
        setToast({
          icon: 'error',
          message: err.message,
        });
        return;
      }
      setToast({
        icon: 'error',
        message: 'Ocorreu um erro desconhecido, tente novamente mais tarde',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentQRCodeStatic = async (
    amount: number,
    maturity: string
  ) => {
    setCurrentInvoice(state => ({ ...state, amount, maturity }));
    setQRCodeStatic({ show: true, value: amount });
  };

  const handleCloseQRCode = () => {
    setQRCode('');
  };

  return (
    <div className={twMerge(className, 'flex flex-col gap-2 w-full')}>
      <h2 className='text-161616 text-base font-bold'>Contas em aberto</h2>
      <div
        className={`${debts.length > 1 ? 'grid-cols-[repeat(auto-fit,minmax(300px,1fr))] max-[600px]:grid-cols-1' : 'grid-cols-[400px] max-[600px]:grid-cols-1'} w-full grid gap-5`}
      >
        {debts.map((item, i) => (
          <div
            key={i}
            className='w-full p-5 shadow-card-invoice bg-white rounded-[6px] flex flex-col'
          >
            <div className='flex w-full items-start justify-between mb-3'>
              <div className='flex flex-col gap-5'>
                <div className='flex flex-col'>
                  <span className='text-sm text-161616'>
                    {item.referenceMonth}
                  </span>
                  <span className='text-sm text-161616 font-bold'>
                    {formatPrice(item.value)}
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm text-8d8d8d'>Vencimento</span>
                  <span className='text-sm text-161616'>
                    {handleFormatDate(item.dueDate)}
                  </span>
                </div>
              </div>
              <div
                className={`${item.status.toLocaleLowerCase() === 'unpaid' || item.status.toLowerCase() === 'automaticdebit' ? 'bg-yellow-400' : ''} ${item.status.toLocaleLowerCase() === 'pastdue' ? 'bg-red-500' : ''} py-2 px-[10px] font-semibold rounded-[22px] text-white text-xs`}
              >
                {((item.status.toLocaleLowerCase() === 'unpaid') || (item.status.toLowerCase() === "automaticdebit")) // eslint-disable-line
                  ? 'Em aberto'
                  : ''}
                {item.status.toLocaleLowerCase() === 'pastdue' ? 'Vencido' : ''}
              </div>
            </div>
            <button
              type='button'
              onClick={() =>
                handlePaymentQRCodeStatic(
                  item.value,
                  handleFormatDate(item.dueDate)
                )
              }
              className='w-full h-10 bg-007d4a text-white flex items-center justify-center gap-3 text-sm font-medium rounded-[6px] hover:opacity-80 transition-opacity duration-200'
            >
              Pagar conta no pix{' '}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width={18}
                height={18}
                viewBox='0 0 25 24'
                fill='none'
              >
                <mask
                  id='a'
                  style={{
                    maskType: 'alpha',
                  }}
                  maskUnits='userSpaceOnUse'
                  x={0}
                  y={0}
                  width={25}
                  height={24}
                >
                  <path fill='#D9D9D9' d='M0.388672 0H24.388672V24H0.388672z' />
                </mask>
                <g mask='url(#a)'>
                  <path
                    d='M11.766 13.745a.68.68 0 01.944 0l3.614 3.618a3.503 3.503 0 002.492 1.034h.709l-4.558 4.563a3.713 3.713 0 01-5.153 0l-4.577-4.577h.437c.938 0 1.826-.366 2.492-1.034l3.6-3.604zm.944-3.458c-.3.258-.686.263-.944 0l-3.6-3.605c-.666-.71-1.554-1.034-2.492-1.034h-.437L9.81 1.07a3.645 3.645 0 015.158 0l4.562 4.564h-.713c-.939 0-1.826.367-2.492 1.034l-3.614 3.619zM5.674 6.706c.647 0 1.244.263 1.741.723l3.6 3.605c.338.296.78.507 1.225.507.441 0 .883-.211 1.22-.507l3.615-3.619a2.493 2.493 0 011.741-.719h1.77l2.736 2.74a3.653 3.653 0 010 5.16l-2.736 2.74h-1.77a2.477 2.477 0 01-1.741-.724l-3.614-3.619c-.653-.653-1.793-.653-2.446.005l-3.6 3.6c-.497.46-1.094.723-1.741.723H4.18l-2.723-2.725a3.65 3.65 0 010-5.16l2.723-2.73h1.494z'
                    fill='#FFF'
                  />
                </g>
              </svg>{' '}
            </button>
          </div>
        ))}
      </div>
      {qrcode ? (
        <QRCodePix
          qrcode={qrcode}
          currentInvoice={currentInvoice}
          handleCloseQRCode={handleCloseQRCode}
        />
      ) : null}

      {QRCodeStatic.value && QRCodeStatic.show ? (
        <QRCodePixStatic
          client={{
            email: customer.email,
            name: customer.name,
            phone: customer.phone,
            maturity: currentInvoice.maturity,
            total: QRCodeStatic.value,
            userLogin: customer.userLogin,
            password: customer.password,
          }}
          pixKey={pixKey}
          pixName={pixName}
          setQRCodeStatic={setQRCodeStatic}
          value={QRCodeStatic.value}
        />
      ) : null}
    </div>
  );
}

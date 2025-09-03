'use client';

import { FormEvent, useRef, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';

import { cloneDeep } from 'lodash';
import { twMerge } from 'tailwind-merge';

interface Props {
  className?: string;
  installationId: string;
  userId: string;
  installations: {
    _id: string;
    siteNumber: string;
    status: string;
    address: string;
    contract: string;
    contractAccount: string;
  }[];
}

export default function Installations({
  className,
  installations,
  installationId,
  userId,
}: Props) {
  const [stateInstallations, setStateInstallations] = useState(() =>
    cloneDeep(installations)
  );
  const selectedOption = useRef(installationId);

  const handleChangeInput = (event: FormEvent<HTMLInputElement>) => {
    const currentTarget = event.currentTarget;
    let value = currentTarget.value;
    value = value.replace(/[^0-9]/g, '');
    currentTarget.value = value;

    const newStateInstallations = installations.filter(item =>
      item.siteNumber.includes(value)
    );
    setStateInstallations(newStateInstallations);
  };

  return (
    <div className={twMerge(className, 'w-full flex flex-col gap-5')}>
      <div className='w-full relative bg-white h-12 px-12 border-b border-b-161616 border-solid rounded-t-[6px]'>
        <IoIosSearch
          className='absolute top-1/2 -translate-y-1/2 opacity-80 left-4'
          fill='#161616'
          size={18}
        />
        <input
          type='text'
          className='w-full h-full text-sm text-161616'
          placeholder='Buscar por instalação'
          onInput={handleChangeInput}
        />
      </div>
      <div className='w-full flex flex-col gap-3'>
        <h2 className='text-161616 text-base font-bold'>
          Você está na instalação:
        </h2>
        {stateInstallations.map((item, i) => (
          <a
            key={i}
            className={`${item.status !== 'Active' ? 'opacity-50 pointer-events-none' : ''} w-full cursor-pointer flex items-start gap-4 bg-white p-4 rounded-[6px] relative`}
            href={`/segunda-via/${userId}/${item.siteNumber}`}
          >
            <span
              className={`${item.status === 'Active' ? 'bg-green-500' : ''} ${item.status === 'Suspended' ? 'bg-yellow-400' : ''} ${item.status === 'Terminated' ? 'bg-red-500' : ''} text-white py-1 px-2 z-[5] rounded-[22px] absolute top-3 right-3 text-xs font-medium`}
            >
              {item.status === 'Active' ? 'Ativa' : ''}
              {item.status === 'Suspended' ? 'Suspensa' : ''}
              {item.status === 'Terminated' ? 'Encerrada' : ''}
            </span>
            <input
              type='radio'
              name='installation'
              className='cursor-pointer !w-4 !h-4 mt-1'
              checked={selectedOption.current === item.siteNumber}
              onChange={() => { }} // eslint-disable-line
            />
            <div className='flex flex-col '>
              <p className='text-base font-medium text-161616'>
                Nº da instalação: {item.siteNumber}
              </p>
              <p className='text-sm font-semibold text-161616'>
                {item.address}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

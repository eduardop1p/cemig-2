'use client';

import { usePathname } from 'next/navigation';

import { twMerge } from 'tailwind-merge';

interface Props {
  className?: string;
  userId: string;
  installationId: string;
}

export default function Nav({ className, userId, installationId }: Props) {
  const pathName = usePathname();

  return (
    <div className={twMerge(className, 'flex flex-col gap-6')}>
      <a
        href={`/segunda-via/${userId}/${installationId}`}
        className={`${pathName === `/segunda-via/${userId}/${installationId}` ? 'border-b-007b47' : 'border-b-transparent'} flex items-center gap-3 pb-[10px] border-b-2  border-solid w-fit`}
      >
        <svg
          width={20}
          height={20}
          viewBox='0 0 20 17'
          xmlns='http://www.w3.org/2000/svg'
          fill={`${pathName === `/segunda-via/${userId}/${installationId}` ? '#007b47' : '#6f6f6f'}`}
        >
          <path d='M10.381.381a.625.625 0 00-.775 0L.625 7.387l.775.988 1.1-.863v7.738c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25V7.519l1.1.856.775-.981L10.381.38zm.869 14.869h-2.5v-5h2.5v5zm1.25 0v-5c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v5H3.75V6.537L10 1.67l6.25 4.875v8.706H12.5z' />
        </svg>
        <span
          className={`${pathName === `/segunda-via/${userId}/${installationId}` ? 'text-007b47' : 'text-6f6f6f'} text-sm font-bold`}
        >
          Início
        </span>
      </a>
      <a
        href={`/installations/${userId}/${installationId}`}
        className={`${pathName === `/installations/${userId}/${installationId}` ? 'border-b-007b47' : 'border-b-transparent'} border-b border-solid flex items-center gap-3 pb-[10px] w-fit`}
      >
        <svg
          width={20}
          height={20}
          viewBox='0 0 18 18'
          xmlns='http://www.w3.org/2000/svg'
          fill={`${pathName === `/installations/${userId}/${installationId}` ? '#007b47' : '#6f6f6f'}`}
        >
          <path d='M13.125 10h1.25v1.25h-1.25V10zm-7.5 0h5v1.25h-5V10zm7.5-2.5h1.25v1.25h-1.25V7.5zm-7.5 0h5v1.25h-5V7.5zm0-2.5h8.75v1.25h-8.75V5zm10-3.75H4.375c-.69 0-1.25.56-1.25 1.25v15.625c0 .345.28.625.625.625h.625a.625.625 0 00.5-.25l1.375-1.833L7.625 18.5a.647.647 0 001 0L10 16.667l1.375 1.833a.647.647 0 001 0l1.375-1.833 1.375 1.833c.118.157.303.25.5.25h.625c.345 0 .625-.28.625-.625V2.5c0-.69-.56-1.25-1.25-1.25zm0 15.833L14.25 15.25a.647.647 0 00-1 0l-1.375 1.833L10.5 15.25a.647.647 0 00-1 0l-1.375 1.833L6.75 15.25a.647.647 0 00-1 0l-1.375 1.833V2.5h11.25v14.583z' />
        </svg>

        <span
          className={`${pathName === `/installations/${userId}/${installationId}` ? 'text-007b47' : 'text-6f6f6f'} text-sm font-bold`}
        >
          Minhas Instalações
        </span>
      </a>
      <div className={`flex items-center gap-3 w-fit`}>
        <svg
          width={20}
          height={20}
          viewBox='0 0 18 18'
          xmlns='http://www.w3.org/2000/svg'
          fill={`#6f6f6f`}
        >
          <path d='M17.5 3.75H6.25V5H17.5V3.75zm0 3.75H6.25v1.25H17.5V7.5zm0 3.75H6.25v1.25H17.5v-1.25zm0 3.75H6.25v1.25H17.5V15zM3.75 3.75H2.5V5h1.25V3.75zm0 3.75H2.5v1.25h1.25V7.5zm0 3.75H2.5v1.25h1.25v-1.25zm0 3.75H2.5v1.25h1.25V15z' />
        </svg>

        <span className={`text-6f6f6f text-sm font-bold`}>Serviços</span>
      </div>
      <div className={`flex items-center gap-3 w-fit`}>
        <svg
          width={24}
          height={24}
          xmlns='http://www.w3.org/2000/svg'
          fill='#6f6f6f'
          viewBox='0 0 32 32'
        >
          <path d='M2 26h28v2H2zM25.4 9c.8-.8.8-2 0-2.8l-3.6-3.6c-.8-.8-2-.8-2.8 0l-15 15V24h6.4l15-15zm-5-5L24 7.6l-3 3L17.4 7l3-3zM6 22v-3.6l10-10 3.6 3.6-10 10H6z' />
        </svg>

        <span className={`text-6f6f6f text-sm font-bold`}>Rascunhos</span>
      </div>
    </div>
  );
}

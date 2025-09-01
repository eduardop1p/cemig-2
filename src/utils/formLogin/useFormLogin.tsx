'use client';

import { useForm, SubmitHandler } from 'react-hook-form';

import encryptData from '@/actions/encryptData';
import ScrapeError from '@/errors/scrapeError';
import { zodResolver } from '@hookform/resolvers/zod';

import { useLoadingApplicationContext } from '../loadingApplicationContext/useContext';
import { useToastSweetalert2Context } from '../toastSweetalert2Context/useContext';
import { BodyProtocol, zodSchema } from './validation';

export default function useFormLogin() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<BodyProtocol>({
    resolver: zodResolver(zodSchema),
    defaultValues: { user: '', password: '' },
  });
  const { isLoading, setIsLoading } = useLoadingApplicationContext();
  const { setToast } = useToastSweetalert2Context();

  const handleFormSubmit: SubmitHandler<BodyProtocol> = async body => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const authorization = await encryptData(body);
      const res = await fetch('/api/scrape2', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new ScrapeError(data.error.message, 400);
      const userId = data.data.userId;
      const installationId = data.data.installationId;
      location.href = `/segunda-via/${userId}/${installationId}`;
    } catch (err) {
      if (err instanceof ScrapeError) {
        setToast({
          icon: 'error',
          message: err.message,
        });
        return;
      }
      setToast({
        icon: 'error',
        message: 'Ocorreu um erro desconhecido',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit: handleSubmit(handleFormSubmit), register, errors };
}

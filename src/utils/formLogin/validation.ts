import z from 'zod';

export const zodSchema = z.object({
  user: z.string().trim().min(1, 'Campo obrigatório'),
  password: z.string().trim().min(1, 'Campo obrigatória'),
});

export type BodyProtocol = z.infer<typeof zodSchema>;

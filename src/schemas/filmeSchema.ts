import { z } from 'zod';

export const filmeSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  sinopse: z.string().min(10, 'A Sinopse deve ter no mínimo 10 caracteres'),
  classificacao: z.string().min(1, 'Classificação é obrigatória'),
  duracao: z.number().positive('Duração deve ser um número positivo (maior que 0)'),
  genero: z.string().min(1, 'Gênero é obrigatório'),
  dataInicioExibicao: z.string().min(1, 'Data de início é obrigatória'),
  dataFimExibicao: z.string().min(1, 'Data de fim é obrigatória'),
});

export type FilmeFormData = z.infer<typeof filmeSchema>;

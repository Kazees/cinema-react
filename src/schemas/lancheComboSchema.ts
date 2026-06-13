import { z } from 'zod';

export const lancheComboSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().min(10, 'A descrição deve ter no mínimo 10 caracteres'),
  valorUnitario: z.number().positive('Valor deve ser um número positivo (maior que 0)'),
  quantidade: z.number().int().nonnegative('Quantidade deve ser um número inteiro não negativo').optional(),
});

export type LancheComboFormData = z.infer<typeof lancheComboSchema>;

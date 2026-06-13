import { z } from 'zod';

export const sessaoSchema = z.object({
  filmeId: z.number({
    required_error: 'Não permitir criar sessão sem selecionar um Filme',
    invalid_type_error: 'Selecione um filme válido',
  }).int().positive('Filme é obrigatório'),
  salaId: z.number({
    required_error: 'Não permitir criar sessão sem selecionar uma Sala',
    invalid_type_error: 'Selecione uma sala válida',
  }).int().positive('Sala é obrigatória'),
  data: z.string()
    .min(1, 'Data é obrigatória')
    .refine((date) => {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const dataSessao = new Date(date);
      return dataSessao >= hoje;
    }, 'A data da sessão não pode ser retroativa (anterior à data atual)'),
  horario: z.string().min(1, 'Horário é obrigatório'),
});

export type SessaoFormData = z.infer<typeof sessaoSchema>;

export interface Ingresso {
  id?: number;
  sessaoId: number;
  tipo: 'Inteira' | 'Meia';
  valorInteira: number;
  valorFinal: number;
}

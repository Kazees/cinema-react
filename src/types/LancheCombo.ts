export interface LancheCombo {
  id?: number;
  nome: string;
  descricao: string;
  valorUnitario: number;
  quantidade?: number; // Quantidade disponível no estoque
}

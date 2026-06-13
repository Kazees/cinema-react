export interface Pedido {
  id?: number;
  ingressoId: number;
  lanches: ItemPedido[]; // Lista de lanches com quantidades
  valorTotal: number;
  dataPedido: string;
}

export interface ItemPedido {
  lancheId: number;
  quantidade: number;
  valorUnitario: number;
  subtotal: number;
}

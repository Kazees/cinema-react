import { Pedido } from '../types/Pedido';
import { api, handleResponse } from './api';

export const pedidosService = {
  async getAll(): Promise<Pedido[]> {
    const response = await fetch(api.pedidos);
    return handleResponse(response);
  },

  async getById(id: number): Promise<Pedido> {
    const response = await fetch(`${api.pedidos}/${id}`);
    return handleResponse(response);
  },

  async getByIngressoId(ingressoId: number): Promise<Pedido[]> {
    const response = await fetch(`${api.pedidos}?ingressoId=${ingressoId}`);
    return handleResponse(response);
  },

  async create(pedido: Omit<Pedido, 'id'>): Promise<Pedido> {
    const response = await fetch(api.pedidos, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido),
    });
    return handleResponse(response);
  },
};

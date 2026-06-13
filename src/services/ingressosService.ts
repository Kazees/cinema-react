import { Ingresso } from '../types/Ingresso';
import { api, handleResponse } from './api';

export const ingressosService = {
  async getAll(): Promise<Ingresso[]> {
    const response = await fetch(api.ingressos);
    return handleResponse(response);
  },

  async getById(id: number): Promise<Ingresso> {
    const response = await fetch(`${api.ingressos}/${id}`);
    return handleResponse(response);
  },

  async getBySessaoId(sessaoId: number): Promise<Ingresso[]> {
    const response = await fetch(`${api.ingressos}?sessaoId=${sessaoId}`);
    return handleResponse(response);
  },

  async create(ingresso: Omit<Ingresso, 'id'>): Promise<Ingresso> {
    const response = await fetch(api.ingressos, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ingresso),
    });
    return handleResponse(response);
  },
};

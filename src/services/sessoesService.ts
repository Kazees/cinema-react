import { Sessao } from '../types/Sessao';
import { api, handleResponse } from './api';

export const sessoesService = {
  async getAll(): Promise<Sessao[]> {
    const response = await fetch(api.sessoes);
    return handleResponse(response);
  },

  async getById(id: number): Promise<Sessao> {
    const response = await fetch(`${api.sessoes}/${id}`);
    return handleResponse(response);
  },

  async create(sessao: Omit<Sessao, 'id'>): Promise<Sessao> {
    const response = await fetch(api.sessoes, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessao),
    });
    return handleResponse(response);
  },

  async update(id: number, sessao: Omit<Sessao, 'id'>): Promise<Sessao> {
    const response = await fetch(`${api.sessoes}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessao),
    });
    return handleResponse(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${api.sessoes}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Erro ao excluir sessão: ${response.statusText}`);
    }
  },
};

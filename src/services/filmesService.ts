import { Filme } from '../types/Filme';
import { api, handleResponse } from './api';

export const filmesService = {
  async getAll(): Promise<Filme[]> {
    const response = await fetch(api.filmes);
    return handleResponse(response);
  },

  async getById(id: number): Promise<Filme> {
    const response = await fetch(`${api.filmes}/${id}`);
    return handleResponse(response);
  },

  async create(filme: Omit<Filme, 'id'>): Promise<Filme> {
    const response = await fetch(api.filmes, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filme),
    });
    return handleResponse(response);
  },

  async update(id: number, filme: Omit<Filme, 'id'>): Promise<Filme> {
    const response = await fetch(`${api.filmes}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filme),
    });
    return handleResponse(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${api.filmes}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Erro ao excluir filme: ${response.statusText}`);
    }
  },
};

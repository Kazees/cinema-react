import { LancheCombo } from '../types/LancheCombo';
import { api, handleResponse } from './api';

export const lanchesService = {
  async getAll(): Promise<LancheCombo[]> {
    const response = await fetch(api.lanches);
    return handleResponse(response);
  },

  async getById(id: number): Promise<LancheCombo> {
    const response = await fetch(`${api.lanches}/${id}`);
    return handleResponse(response);
  },

  async create(lanche: Omit<LancheCombo, 'id'>): Promise<LancheCombo> {
    const response = await fetch(api.lanches, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lanche),
    });
    return handleResponse(response);
  },

  async update(id: number, lanche: Omit<LancheCombo, 'id'>): Promise<LancheCombo> {
    const response = await fetch(`${api.lanches}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lanche),
    });
    return handleResponse(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${api.lanches}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Erro ao excluir lanche: ${response.statusText}`);
    }
  },
};

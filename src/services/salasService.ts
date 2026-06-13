import { Sala } from '../types/Sala';
import { api, handleResponse } from './api';

export const salasService = {
  async getAll(): Promise<Sala[]> {
    const response = await fetch(api.salas);
    return handleResponse(response);
  },

  async getById(id: number): Promise<Sala> {
    const response = await fetch(`${api.salas}/${id}`);
    return handleResponse(response);
  },

  async create(sala: Omit<Sala, 'id'>): Promise<Sala> {
    const response = await fetch(api.salas, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sala),
    });
    return handleResponse(response);
  },

  async update(id: number, sala: Omit<Sala, 'id'>): Promise<Sala> {
    const response = await fetch(`${api.salas}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sala),
    });
    return handleResponse(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${api.salas}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Erro ao excluir sala: ${response.statusText}`);
    }
  },
};

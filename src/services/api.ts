const API_BASE_URL = 'http://localhost:3000';

export const api = {
  filmes: `${API_BASE_URL}/filmes`,
  salas: `${API_BASE_URL}/salas`,
  sessoes: `${API_BASE_URL}/sessoes`,
  ingressos: `${API_BASE_URL}/ingressos`,
  lanches: `${API_BASE_URL}/lanches`,
  pedidos: `${API_BASE_URL}/pedidos`, 
};

export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.statusText}`);
  }
  return response.json();
};

import { useState, useEffect } from 'react';
import { Sessao } from '../types/Sessao';
import { Filme } from '../types/Filme';
import { Sala } from '../types/Sala';
import { Ingresso } from '../types/Ingresso';
import { sessoesService } from '../services/sessoesService';
import { filmesService } from '../services/filmesService';
import { salasService } from '../services/salasService';
import { ingressosService } from '../services/ingressosService';

const ListarSessoes = () => {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [ingressos, setIngressos] = useState<Ingresso[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensagens, setMensagens] = useState<string[]>([]);
  const [showVendaModal, setShowVendaModal] = useState(false);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<Sessao | null>(null);
  const [tipoIngresso, setTipoIngresso] = useState<'Inteira' | 'Meia'>('Inteira');
  const [valorInteira] = useState(30); // Valor padrão para ingresso inteira

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessoesData, filmesData, salasData, ingressosData] = await Promise.all([
        sessoesService.getAll(),
        filmesService.getAll(),
        salasService.getAll(),
        ingressosService.getAll(),
      ]);
      setSessoes(sessoesData);
      setFilmes(filmesData);
      setSalas(salasData);
      setIngressos(ingressosData);
    } catch (error) {
      setMensagens(['Erro ao carregar dados. Verifique se o servidor está rodando.']);
    } finally {
      setLoading(false);
    }
  };

  const getFilmeNome = (filmeId: number) => {
    const filme = filmes.find((f) => f.id === filmeId);
    return filme?.titulo || 'Filme não encontrado';
  };

  const getSalaNumero = (salaId: number) => {
    const sala = salas.find((s) => s.id === salaId);
    return sala ? `Sala ${sala.numero}` : 'Sala não encontrada';
  };

  const handleVenderIngresso = (sessao: Sessao) => {
    setSessaoSelecionada(sessao);
    setTipoIngresso('Inteira');
    setShowVendaModal(true);
  };

  const calcularValorFinal = (): number => {
    if (tipoIngresso === 'Meia') {
      return valorInteira / 2;
    }
    return valorInteira;
  };

  const handleConfirmarVenda = async () => {
    if (!sessaoSelecionada) return;

    try {
      const novoIngresso: Omit<Ingresso, 'id'> = {
        sessaoId: sessaoSelecionada.id!,
        tipo: tipoIngresso,
        valorInteira: valorInteira,
        valorFinal: calcularValorFinal(),
      };

      await ingressosService.create(novoIngresso);
      await loadData();
      setMensagens([`Ingresso vendido com sucesso! Valor: R$ ${calcularValorFinal().toFixed(2)}`]);
      setShowVendaModal(false);
      setSessaoSelecionada(null);
    } catch (error) {
      setMensagens(['Erro ao vender ingresso']);
    }
  };

  const getIngressosVendidos = (sessaoId: number): number => {
    return ingressos.filter((i) => i.sessaoId === sessaoId).length;
  };

  const getSalaCapacidade = (salaId: number): number => {
    const sala = salas.find((s) => s.id === salaId);
    return sala?.capacidade || 0;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container mt-5 pt-5">
        <h1 className="text-center mb-4">
          <i className="bi bi-list-ul me-2"></i>
          Sessões Disponíveis
        </h1>

        {mensagens.length > 0 && (
          <div className="mt-3">
            {mensagens.map((msg, idx) => (
              <div
                key={idx}
                className={`alert ${msg.includes('sucesso') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}
                role="alert"
              >
                {msg}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMensagens([])}
                  aria-label="Close"
                ></button>
              </div>
            ))}
          </div>
        )}

        {sessoes.length === 0 ? (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle me-2"></i>
            Nenhuma sessão cadastrada ainda.
          </div>
        ) : (
          <div className="row">
            {sessoes.map((sessao) => {
              const ingressosVendidos = getIngressosVendidos(sessao.id!);
              const capacidade = getSalaCapacidade(sessao.salaId);
              const disponibilidade = capacidade - ingressosVendidos;
              const esgotado = disponibilidade <= 0;

              return (
                <div key={sessao.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">
                        <i className="bi bi-film me-2 text-primary"></i>
                        {getFilmeNome(sessao.filmeId)}
                      </h5>
                      <ul className="list-unstyled mt-3">
                        <li>
                          <i className="bi bi-door-open me-2"></i>
                          <strong>Sala:</strong> {getSalaNumero(sessao.salaId)}
                        </li>
                        <li>
                          <i className="bi bi-calendar me-2"></i>
                          <strong>Data:</strong> {new Date(sessao.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </li>
                        <li>
                          <i className="bi bi-clock me-2"></i>
                          <strong>Horário:</strong> {sessao.horario}
                        </li>
                        <li>
                          <i className="bi bi-people me-2"></i>
                          <strong>Disponibilidade:</strong>{' '}
                          <span className={esgotado ? 'text-danger' : 'text-success'}>
                            {disponibilidade}/{capacidade}
                          </span>
                        </li>
                      </ul>
                      <button
                        className="btn btn-success w-100 mt-2"
                        onClick={() => handleVenderIngresso(sessao)}
                        disabled={esgotado}
                      >
                        <i className="bi bi-ticket-perforated me-2"></i>
                        {esgotado ? 'Esgotado' : 'Vender Ingresso'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Venda de Ingresso */}
      {showVendaModal && sessaoSelecionada && (
        <>
          <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content shadow">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-ticket-perforated me-2"></i>
                    Vender Ingresso
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowVendaModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="alert alert-info">
                    <h6>
                      <i className="bi bi-film me-2"></i>
                      {getFilmeNome(sessaoSelecionada.filmeId)}
                    </h6>
                    <p className="mb-1">
                      <i className="bi bi-door-open me-2"></i>
                      {getSalaNumero(sessaoSelecionada.salaId)}
                    </p>
                    <p className="mb-1">
                      <i className="bi bi-calendar me-2"></i>
                      {new Date(sessaoSelecionada.data + 'T00:00:00').toLocaleDateString('pt-BR')} às{' '}
                      {sessaoSelecionada.horario}
                    </p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Tipo de Ingresso *</label>
                    <div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="tipoIngresso"
                          id="inteira"
                          value="Inteira"
                          checked={tipoIngresso === 'Inteira'}
                          onChange={(e) => setTipoIngresso(e.target.value as 'Inteira' | 'Meia')}
                        />
                        <label className="form-check-label" htmlFor="inteira">
                          Inteira - R$ {valorInteira.toFixed(2)}
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="tipoIngresso"
                          id="meia"
                          value="Meia"
                          checked={tipoIngresso === 'Meia'}
                          onChange={(e) => setTipoIngresso(e.target.value as 'Inteira' | 'Meia')}
                        />
                        <label className="form-check-label" htmlFor="meia">
                          Meia - R$ {(valorInteira / 2).toFixed(2)}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-success">
                    <strong>Valor Total:</strong> R$ {calcularValorFinal().toFixed(2)}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowVendaModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="button" className="btn btn-success" onClick={handleConfirmarVenda}>
                    <i className="bi bi-check-circle me-1"></i>
                    Confirmar Venda
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </>
      )}
    </div>
  );
};

export default ListarSessoes;

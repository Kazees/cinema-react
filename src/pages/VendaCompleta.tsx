import { useState, useEffect } from 'react';
import { Sessao } from '../types/Sessao';
import { Filme } from '../types/Filme';
import { Sala } from '../types/Sala';
import { Ingresso } from '../types/Ingresso';
import { LancheCombo } from '../types/LancheCombo';
import { Pedido, ItemPedido } from '../types/Pedido';
import { sessoesService } from '../services/sessoesService';
import { filmesService } from '../services/filmesService';
import { salasService } from '../services/salasService';
import { ingressosService } from '../services/ingressosService';
import { lanchesService } from '../services/lanchesService';
import { pedidosService } from '../services/pedidosService';

const VendaCompleta = () => {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [ingressos, setIngressos] = useState<Ingresso[]>([]);
  const [lanches, setLanches] = useState<LancheCombo[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensagens, setMensagens] = useState<string[]>([]);
  
  // Modal de venda
  const [showVendaModal, setShowVendaModal] = useState(false);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<Sessao | null>(null);
  const [tipoIngresso, setTipoIngresso] = useState<'Inteira' | 'Meia'>('Inteira');
  const [valorInteira] = useState(30);
  
  // Carrinho de lanches
  const [carrinho, setCarrinho] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessoesData, filmesData, salasData, ingressosData, lanchesData] = await Promise.all([
        sessoesService.getAll(),
        filmesService.getAll(),
        salasService.getAll(),
        ingressosService.getAll(),
        lanchesService.getAll(),
      ]);
      setSessoes(sessoesData);
      setFilmes(filmesData);
      setSalas(salasData);
      setIngressos(ingressosData);
      setLanches(lanchesData);
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
    setCarrinho(new Map());
    setShowVendaModal(true);
  };

  const calcularValorIngresso = (): number => {
    if (tipoIngresso === 'Meia') {
      return valorInteira / 2;
    }
    return valorInteira;
  };

  const adicionarLanche = (lancheId: number) => {
    setCarrinho((prev) => {
      const novo = new Map(prev);
      const qtdAtual = novo.get(lancheId) || 0;
      novo.set(lancheId, qtdAtual + 1);
      return novo;
    });
  };

  const removerLanche = (lancheId: number) => {
    setCarrinho((prev) => {
      const novo = new Map(prev);
      const qtdAtual = novo.get(lancheId) || 0;
      if (qtdAtual > 1) {
        novo.set(lancheId, qtdAtual - 1);
      } else {
        novo.delete(lancheId);
      }
      return novo;
    });
  };

  const calcularTotalLanches = (): number => {
    let total = 0;
    carrinho.forEach((quantidade, lancheId) => {
      const lanche = lanches.find((l) => l.id === lancheId);
      if (lanche) {
        total += lanche.valorUnitario * quantidade;
      }
    });
    return total;
  };

  const calcularTotalGeral = (): number => {
    return calcularValorIngresso() + calcularTotalLanches();
  };

  const handleConfirmarVenda = async () => {
    if (!sessaoSelecionada) return;

    try {
      // 1. Criar o ingresso
      const novoIngresso: Omit<Ingresso, 'id'> = {
        sessaoId: sessaoSelecionada.id!,
        tipo: tipoIngresso,
        valorInteira: valorInteira,
        valorFinal: calcularValorIngresso(),
      };

      const ingressoCriado = await ingressosService.create(novoIngresso);

      // 2. Se houver lanches, criar o pedido
      if (carrinho.size > 0) {
        const itensPedido: ItemPedido[] = [];
        carrinho.forEach((quantidade, lancheId) => {
          const lanche = lanches.find((l) => l.id === lancheId);
          if (lanche) {
            itensPedido.push({
              lancheId,
              quantidade,
              valorUnitario: lanche.valorUnitario,
              subtotal: lanche.valorUnitario * quantidade,
            });
          }
        });

        const novoPedido: Omit<Pedido, 'id'> = {
          ingressoId: ingressoCriado.id!,
          lanches: itensPedido,
          valorTotal: calcularTotalLanches(),
          dataPedido: new Date().toISOString(),
        };

        await pedidosService.create(novoPedido);
      }

      await loadData();
      setMensagens([
        `Venda realizada com sucesso! Total: R$ ${calcularTotalGeral().toFixed(2)}`,
      ]);
      setShowVendaModal(false);
      setSessaoSelecionada(null);
      setCarrinho(new Map());
    } catch (error) {
      setMensagens(['Erro ao realizar venda']);
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
          <i className="bi bi-ticket-perforated me-2"></i>
          Venda de Ingressos e Lanches
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
                        <i className="bi bi-cart-plus me-2"></i>
                        {esgotado ? 'Esgotado' : 'Vender'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Venda Completa */}
      {showVendaModal && sessaoSelecionada && (
        <>
          <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content shadow">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-cart-plus me-2"></i>
                    Venda de Ingresso e Lanches
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowVendaModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Informações da Sessão */}
                  <div className="alert alert-info">
                    <h6>
                      <i className="bi bi-film me-2"></i>
                      {getFilmeNome(sessaoSelecionada.filmeId)}
                    </h6>
                    <p className="mb-1">
                      <i className="bi bi-door-open me-2"></i>
                      {getSalaNumero(sessaoSelecionada.salaId)} |{' '}
                      <i className="bi bi-calendar me-2"></i>
                      {new Date(sessaoSelecionada.data + 'T00:00:00').toLocaleDateString('pt-BR')} às{' '}
                      {sessaoSelecionada.horario}
                    </p>
                  </div>

                  {/* Seleção de Ingresso */}
                  <h6 className="mb-3">
                    <i className="bi bi-ticket-perforated me-2"></i>
                    Tipo de Ingresso
                  </h6>
                  <div className="mb-4">
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

                  {/* Seleção de Lanches */}
                  <h6 className="mb-3">
                    <i className="bi bi-cup-straw me-2"></i>
                    Adicionar Lanches/Combos (Opcional)
                  </h6>
                  {lanches.length === 0 ? (
                    <div className="alert alert-warning">
                      <i className="bi bi-info-circle me-2"></i>
                      Nenhum lanche cadastrado no sistema.
                    </div>
                  ) : (
                    <div className="list-group mb-4">
                      {lanches.map((lanche) => {
                        const qtd = carrinho.get(lanche.id!) || 0;
                        return (
                          <div key={lanche.id} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h6 className="mb-1">{lanche.nome}</h6>
                                <p className="mb-1 text-muted small">{lanche.descricao}</p>
                                <strong className="text-success">R$ {lanche.valorUnitario.toFixed(2)}</strong>
                              </div>
                              <div className="btn-group" role="group">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => removerLanche(lanche.id!)}
                                  disabled={qtd === 0}
                                >
                                  <i className="bi bi-dash"></i>
                                </button>
                                <button type="button" className="btn btn-sm btn-outline-secondary" disabled>
                                  {qtd}
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => adicionarLanche(lanche.id!)}
                                >
                                  <i className="bi bi-plus"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Resumo do Pedido */}
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6 className="card-title">Resumo do Pedido</h6>
                      <ul className="list-unstyled mb-0">
                        <li className="d-flex justify-content-between">
                          <span>Ingresso ({tipoIngresso}):</span>
                          <strong>R$ {calcularValorIngresso().toFixed(2)}</strong>
                        </li>
                        {carrinho.size > 0 && (
                          <li className="d-flex justify-content-between">
                            <span>Lanches:</span>
                            <strong>R$ {calcularTotalLanches().toFixed(2)}</strong>
                          </li>
                        )}
                        <li className="d-flex justify-content-between mt-2 pt-2 border-top">
                          <span className="h5 mb-0">TOTAL:</span>
                          <strong className="h5 mb-0 text-success">
                            R$ {calcularTotalGeral().toFixed(2)}
                          </strong>
                        </li>
                      </ul>
                    </div>
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
                    Confirmar Venda - R$ {calcularTotalGeral().toFixed(2)}
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

export default VendaCompleta;

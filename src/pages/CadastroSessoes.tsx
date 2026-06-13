import { useState, useEffect } from 'react';
import { Sessao } from '../types/Sessao';
import { Filme } from '../types/Filme';
import { Sala } from '../types/Sala';
import { sessoesService } from '../services/sessoesService';
import { filmesService } from '../services/filmesService';
import { salasService } from '../services/salasService';
import { sessaoSchema, SessaoFormData } from '../schemas/sessaoSchema';
import { ZodError } from 'zod';

const CadastroSessoes = () => {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editSessao, setEditSessao] = useState<Sessao | null>(null);
  const [deleteSessao, setDeleteSessao] = useState<Sessao | null>(null);
  const [mensagens, setMensagens] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    filmeId: '',
    salaId: '',
    data: '',
    horario: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessoesData, filmesData, salasData] = await Promise.all([
        sessoesService.getAll(),
        filmesService.getAll(),
        salasService.getAll(),
      ]);
      setSessoes(sessoesData);
      setFilmes(filmesData);
      setSalas(salasData);
    } catch (error) {
      setMensagens(['Erro ao carregar dados. Verifique se o servidor está rodando.']);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'filmeId' || name === 'salaId' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validar com Zod
      const validatedData = sessaoSchema.parse(formData);

      if (editSessao) {
        await sessoesService.update(editSessao.id!, validatedData);
        setMensagens(['Sessão atualizada com sucesso!']);
      } else {
        await sessoesService.create(validatedData);
        setMensagens(['Sessão cadastrada com sucesso!']);
      }

      await loadData();
      resetForm();
      setShowModal(false);
    } catch (error) {
      if (error instanceof ZodError) {
        setMensagens(error.errors.map((err) => err.message));
      } else {
        setMensagens(['Erro ao salvar sessão']);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      filmeId: 0,
      salaId: 0,
      data: '',
      horario: '',
    });
    setEditSessao(null);
    setMensagens([]);
  };

  const handleEdit = (sessao: Sessao) => {
    setFormData({
      filmeId: sessao.filmeId,
      salaId: sessao.salaId,
      data: sessao.data,
      horario: sessao.horario,
    });
    setEditSessao(sessao);
    setShowModal(true);
  };

  const handleDelete = (sessao: Sessao) => {
    setDeleteSessao(sessao);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteSessao?.id) {
      try {
        await sessoesService.delete(deleteSessao.id);
        await loadData();
        setShowDeleteModal(false);
        setDeleteSessao(null);
        setMensagens(['Sessão excluída com sucesso!']);
      } catch (error) {
        setMensagens(['Erro ao excluir sessão']);
      }
    }
  };

  const openNewModal = () => {
    resetForm();
    setShowModal(true);
  };

  const getFilmeNome = (filmeId: number) => {
    const filme = filmes.find((f) => f.id === filmeId);
    return filme?.titulo || 'Filme não encontrado';
  };

  const getSalaNumero = (salaId: number) => {
    const sala = salas.find((s) => s.id === salaId);
    return sala ? `Sala ${sala.numero}` : 'Sala não encontrada';
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
      <div className="container text-center mt-5 pt-5">
        <h1 className="mb-3">
          <i className="bi bi-calendar-event me-2"></i>
          Gerenciador de Sessões
        </h1>
        <button className="btn btn-primary" onClick={openNewModal} disabled={filmes.length === 0 || salas.length === 0}>
          <i className="bi bi-plus-circle me-2"></i>
          Cadastrar Nova Sessão
        </button>
        {(filmes.length === 0 || salas.length === 0) && (
          <div className="text-muted mt-2">
            <small>
              <i className="bi bi-info-circle me-1"></i>
              É necessário ter filmes e salas cadastrados para criar sessões
            </small>
          </div>
        )}
      </div>

      {mensagens.length > 0 && (
        <div className="container mt-3">
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

      <div className="container my-5">
        <h2 className="text-center mb-4">Sessões Cadastradas</h2>
        {sessoes.length === 0 ? (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle me-2"></i>
            Nenhuma sessão cadastrada ainda.
          </div>
        ) : (
          <div className="row">
            {sessoes.map((sessao) => (
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
                    </ul>
                    <div className="d-flex justify-content-between mt-3">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(sessao)}
                      >
                        <i className="bi bi-pencil me-1"></i>
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(sessao)}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Cadastro/Edição */}
      {showModal && (
        <>
          <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content shadow">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">
                    <i className={`bi ${editSessao ? 'bi-pencil' : 'bi-plus-circle'} me-2`}></i>
                    {editSessao ? 'Editar Sessão' : 'Cadastro de Sessão'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="filmeId" className="form-label">
                        Filme *
                      </label>
                      <select
                        className="form-select"
                        id="filmeId"
                        name="filmeId"
                        value={formData.filmeId || ''}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Selecione um filme...</option>
                        {filmes.map((filme) => (
                          <option key={filme.id} value={filme.id}>
                            {filme.titulo}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="salaId" className="form-label">
                        Sala *
                      </label>
                      <select
                        className="form-select"
                        id="salaId"
                        name="salaId"
                        value={formData.salaId || ''}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Selecione uma sala...</option>
                        {salas.map((sala) => (
                          <option key={sala.id} value={sala.id}>
                            Sala {sala.numero} - {sala.capacidade} lugares
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="data" className="form-label">
                        Data *
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="data"
                        name="data"
                        value={formData.data}
                        onChange={handleChange}
                        required
                      />
                      <small className="text-muted">A data não pode ser anterior à data atual</small>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="horario" className="form-label">
                        Horário *
                      </label>
                      <input
                        type="time"
                        className="form-control"
                        id="horario"
                        name="horario"
                        value={formData.horario}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="text-end">
                      <button type="button" className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>
                        Cancelar
                      </button>
                      <button type="submit" className="btn btn-success">
                        <i className="bi bi-check-circle me-1"></i>
                        Salvar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <>
          <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content shadow">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Confirmar Exclusão
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowDeleteModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  Tem certeza que deseja excluir esta sessão?
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                    <i className="bi bi-trash me-1"></i>
                    Excluir
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

export default CadastroSessoes;

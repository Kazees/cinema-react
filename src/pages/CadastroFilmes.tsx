import { useState, useEffect } from 'react';
import { Filme } from '../types/Filme';
import { filmesService } from '../services/filmesService';
import { filmeSchema, FilmeFormData } from '../schemas/filmeSchema';
import { ZodError } from 'zod';

const CadastroFilmes = () => {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editFilme, setEditFilme] = useState<Filme | null>(null);
  const [deleteFilme, setDeleteFilme] = useState<Filme | null>(null);
  const [mensagens, setMensagens] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FilmeFormData>({
    titulo: '',
    sinopse: '',
    genero: '',
    classificacao: '',
    duracao: 0,
    dataInicioExibicao: '',
    dataFimExibicao: '',
  });

  const generos = ['Ação', 'Aventura', 'Comédia', 'Drama', 'Fantasia', 'Terror', 'Ficção Científica', 'Romance', 'Animação'];
  const classificacoes = ['Livre', '10 anos', '12 anos', '14 anos', '16 anos', '18 anos'];

  useEffect(() => {
    loadFilmes();
  }, []);

  const loadFilmes = async () => {
    try {
      setLoading(true);
      const data = await filmesService.getAll();
      setFilmes(data);
    } catch (error) {
      setMensagens(['Erro ao carregar filmes. Verifique se o servidor está rodando.']);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duracao' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validar com Zod
      const validatedData = filmeSchema.parse(formData);

      if (editFilme) {
        await filmesService.update(editFilme.id!, validatedData);
        setMensagens(['Filme atualizado com sucesso!']);
      } else {
        await filmesService.create(validatedData);
        setMensagens(['Filme cadastrado com sucesso!']);
      }

      await loadFilmes();
      resetForm();
      setShowModal(false);
    } catch (error) {
      if (error instanceof ZodError) {
        setMensagens(error.errors.map((err) => err.message));
      } else {
        setMensagens(['Erro ao salvar filme']);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      sinopse: '',
      genero: '',
      classificacao: '',
      duracao: 0,
      dataInicioExibicao: '',
      dataFimExibicao: '',
    });
    setEditFilme(null);
    setMensagens([]);
  };

  const handleEdit = (filme: Filme) => {
    setFormData({
      titulo: filme.titulo,
      sinopse: filme.sinopse,
      genero: filme.genero,
      classificacao: filme.classificacao,
      duracao: filme.duracao,
      dataInicioExibicao: filme.dataInicioExibicao,
      dataFimExibicao: filme.dataFimExibicao,
    });
    setEditFilme(filme);
    setShowModal(true);
  };

  const handleDelete = (filme: Filme) => {
    setDeleteFilme(filme);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteFilme?.id) {
      try {
        await filmesService.delete(deleteFilme.id);
        await loadFilmes();
        setShowDeleteModal(false);
        setDeleteFilme(null);
        setMensagens(['Filme excluído com sucesso!']);
      } catch (error) {
        setMensagens(['Erro ao excluir filme']);
      }
    }
  };

  const openNewModal = () => {
    resetForm();
    setShowModal(true);
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
          <i className="bi bi-camera-reels me-2"></i>
          Gerenciador de Filmes
        </h1>
        <button className="btn btn-primary" onClick={openNewModal}>
          <i className="bi bi-plus-circle me-2"></i>
          Cadastrar Novo Filme
        </button>
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
        <h2 className="text-center mb-4">Filmes Cadastrados</h2>
        {filmes.length === 0 ? (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle me-2"></i>
            Nenhum filme cadastrado ainda.
          </div>
        ) : (
          <div className="row">
            {filmes.map((filme) => (
              <div key={filme.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="bi bi-film me-2 text-primary"></i>
                      {filme.titulo}
                    </h5>
                    <p className="card-text">
                      <small className="text-muted">{filme.sinopse}</small>
                    </p>
                    <ul className="list-unstyled">
                      <li>
                        <strong>Gênero:</strong> {filme.genero}
                      </li>
                      <li>
                        <strong>Classificação:</strong> {filme.classificacao}
                      </li>
                      <li>
                        <strong>Duração:</strong> {filme.duracao} min
                      </li>
                      <li>
                        <strong>Exibição:</strong> {filme.dataInicioExibicao} a {filme.dataFimExibicao}
                      </li>
                    </ul>
                    <div className="d-flex justify-content-between mt-3">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(filme)}
                      >
                        <i className="bi bi-pencil me-1"></i>
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(filme)}
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
            <div className="modal-dialog modal-lg">
              <div className="modal-content shadow">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">
                    <i className={`bi ${editFilme ? 'bi-pencil' : 'bi-plus-circle'} me-2`}></i>
                    {editFilme ? 'Editar Filme' : 'Cadastro de Filme'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-8 mb-3">
                        <label htmlFor="titulo" className="form-label">
                          Título *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="titulo"
                          name="titulo"
                          value={formData.titulo}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="duracao" className="form-label">
                          Duração (min) *
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="duracao"
                          name="duracao"
                          min="1"
                          value={formData.duracao || ''}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="sinopse" className="form-label">
                        Sinopse * (mínimo 10 caracteres)
                      </label>
                      <textarea
                        className="form-control"
                        id="sinopse"
                        name="sinopse"
                        rows={3}
                        value={formData.sinopse}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="genero" className="form-label">
                          Gênero *
                        </label>
                        <select
                          className="form-select"
                          id="genero"
                          name="genero"
                          value={formData.genero}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Selecione...</option>
                          {generos.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="classificacao" className="form-label">
                          Classificação Indicativa *
                        </label>
                        <select
                          className="form-select"
                          id="classificacao"
                          name="classificacao"
                          value={formData.classificacao}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Selecione...</option>
                          {classificacoes.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="dataInicioExibicao" className="form-label">
                          Data de Início *
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="dataInicioExibicao"
                          name="dataInicioExibicao"
                          value={formData.dataInicioExibicao}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="dataFimExibicao" className="form-label">
                          Data de Fim *
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="dataFimExibicao"
                          name="dataFimExibicao"
                          value={formData.dataFimExibicao}
                          onChange={handleChange}
                          required
                        />
                      </div>
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
                  Tem certeza que deseja excluir o filme <strong>{deleteFilme?.titulo}</strong>?
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

export default CadastroFilmes;

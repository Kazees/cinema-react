import { useState, useEffect } from 'react';
import { Sala } from '../types/Sala';
import { salasService } from '../services/salasService';
import { salaSchema, SalaFormData } from '../schemas/salaSchema';
import { ZodError } from 'zod';

const CadastroSalas = () => {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editSala, setEditSala] = useState<Sala | null>(null);
  const [deleteSala, setDeleteSala] = useState<Sala | null>(null);
  const [mensagens, setMensagens] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SalaFormData>({
    numero: 0,
    capacidade: 0,
  });

  useEffect(() => {
    loadSalas();
  }, []);

  const loadSalas = async () => {
    try {
      setLoading(true);
      const data = await salasService.getAll();
      setSalas(data);
    } catch (error) {
      setMensagens(['Erro ao carregar salas. Verifique se o servidor está rodando.']);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validar com Zod
      const validatedData = salaSchema.parse(formData);

      if (editSala) {
        await salasService.update(editSala.id!, validatedData);
        setMensagens(['Sala atualizada com sucesso!']);
      } else {
        await salasService.create(validatedData);
        setMensagens(['Sala cadastrada com sucesso!']);
      }

      await loadSalas();
      resetForm();
      setShowModal(false);
    } catch (error) {
      if (error instanceof ZodError) {
        setMensagens(error.errors.map((err) => err.message));
      } else {
        setMensagens(['Erro ao salvar sala']);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      numero: 0,
      capacidade: 0,
    });
    setEditSala(null);
    setMensagens([]);
  };

  const handleEdit = (sala: Sala) => {
    setFormData({
      numero: sala.numero,
      capacidade: sala.capacidade,
    });
    setEditSala(sala);
    setShowModal(true);
  };

  const handleDelete = (sala: Sala) => {
    setDeleteSala(sala);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteSala?.id) {
      try {
        await salasService.delete(deleteSala.id);
        await loadSalas();
        setShowDeleteModal(false);
        setDeleteSala(null);
        setMensagens(['Sala excluída com sucesso!']);
      } catch (error) {
        setMensagens(['Erro ao excluir sala']);
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
          <i className="bi bi-door-open me-2"></i>
          Gerenciador de Salas
        </h1>
        <button className="btn btn-primary" onClick={openNewModal}>
          <i className="bi bi-plus-circle me-2"></i>
          Cadastrar Nova Sala
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
        <h2 className="text-center mb-4">Salas Cadastradas</h2>
        {salas.length === 0 ? (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle me-2"></i>
            Nenhuma sala cadastrada ainda.
          </div>
        ) : (
          <div className="row">
            {salas.map((sala) => (
              <div key={sala.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="bi bi-door-open me-2 text-success"></i>
                      Sala {sala.numero}
                    </h5>
                    <ul className="list-unstyled mt-3">
                      <li>
                        <i className="bi bi-people me-2"></i>
                        <strong>Capacidade:</strong> {sala.capacidade} lugares
                      </li>
                    </ul>
                    <div className="d-flex justify-content-between mt-3">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(sala)}
                      >
                        <i className="bi bi-pencil me-1"></i>
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(sala)}
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
                    <i className={`bi ${editSala ? 'bi-pencil' : 'bi-plus-circle'} me-2`}></i>
                    {editSala ? 'Editar Sala' : 'Cadastro de Sala'}
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
                      <label htmlFor="numero" className="form-label">
                        Número da Sala *
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="numero"
                        name="numero"
                        min="1"
                        value={formData.numero || ''}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="capacidade" className="form-label">
                        Capacidade (número de lugares) *
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="capacidade"
                        name="capacidade"
                        min="1"
                        value={formData.capacidade || ''}
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
                  Tem certeza que deseja excluir a <strong>Sala {deleteSala?.numero}</strong>?
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

export default CadastroSalas;

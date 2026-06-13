import { useState, useEffect } from 'react';
import { LancheCombo } from '../types/LancheCombo';
import { lanchesService } from '../services/lanchesService';
import { lancheComboSchema, LancheComboFormData } from '../schemas/lancheComboSchema';
import { ZodError } from 'zod';

const CadastroLanches = () => {
  const [lanches, setLanches] = useState<LancheCombo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editLanche, setEditLanche] = useState<LancheCombo | null>(null);
  const [deleteLanche, setDeleteLanche] = useState<LancheCombo | null>(null);
  const [mensagens, setMensagens] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LancheComboFormData>({
    nome: '',
    descricao: '',
    valorUnitario: 0,
    quantidade: 0,
  });

  useEffect(() => {
    loadLanches();
  }, []);

  const loadLanches = async () => {
    try {
      setLoading(true);
      const data = await lanchesService.getAll();
      setLanches(data);
    } catch (error) {
      setMensagens(['Erro ao carregar lanches. Verifique se o servidor está rodando.']);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'valorUnitario' || name === 'quantidade' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = lancheComboSchema.parse(formData);

      if (editLanche) {
        await lanchesService.update(editLanche.id!, validatedData);
        setMensagens(['Lanche atualizado com sucesso!']);
      } else {
        await lanchesService.create(validatedData);
        setMensagens(['Lanche cadastrado com sucesso!']);
      }

      await loadLanches();
      resetForm();
      setShowModal(false);
    } catch (error) {
      if (error instanceof ZodError) {
        setMensagens(error.errors.map((err) => err.message));
      } else {
        setMensagens(['Erro ao salvar lanche']);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      valorUnitario: 0,
      quantidade: 0,
    });
    setEditLanche(null);
    setMensagens([]);
  };

  const handleEdit = (lanche: LancheCombo) => {
    setFormData({
      nome: lanche.nome,
      descricao: lanche.descricao,
      valorUnitario: lanche.valorUnitario,
      quantidade: lanche.quantidade || 0,
    });
    setEditLanche(lanche);
    setShowModal(true);
  };

  const handleDelete = (lanche: LancheCombo) => {
    setDeleteLanche(lanche);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteLanche?.id) {
      try {
        await lanchesService.delete(deleteLanche.id);
        await loadLanches();
        setShowDeleteModal(false);
        setDeleteLanche(null);
        setMensagens(['Lanche excluído com sucesso!']);
      } catch (error) {
        setMensagens(['Erro ao excluir lanche']);
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
          <i className="bi bi-cup-straw me-2"></i>
          Gerenciador de Lanches e Combos
        </h1>
        <button className="btn btn-primary" onClick={openNewModal}>
          <i className="bi bi-plus-circle me-2"></i>
          Cadastrar Novo Lanche/Combo
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
        <h2 className="text-center mb-4">Lanches e Combos Cadastrados</h2>
        {lanches.length === 0 ? (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle me-2"></i>
            Nenhum lanche ou combo cadastrado ainda.
          </div>
        ) : (
          <div className="row">
            {lanches.map((lanche) => (
              <div key={lanche.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="bi bi-cup-straw me-2 text-warning"></i>
                      {lanche.nome}
                    </h5>
                    <p className="card-text">
                      <small className="text-muted">{lanche.descricao}</small>
                    </p>
                    <ul className="list-unstyled">
                      <li>
                        <i className="bi bi-currency-dollar me-2"></i>
                        <strong>Valor:</strong> R$ {lanche.valorUnitario.toFixed(2)}
                      </li>
                      {lanche.quantidade !== undefined && (
                        <li>
                          <i className="bi bi-box me-2"></i>
                          <strong>Estoque:</strong> {lanche.quantidade} unidades
                        </li>
                      )}
                    </ul>
                    <div className="d-flex justify-content-between mt-3">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(lanche)}
                      >
                        <i className="bi bi-pencil me-1"></i>
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(lanche)}
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
                    <i className={`bi ${editLanche ? 'bi-pencil' : 'bi-plus-circle'} me-2`}></i>
                    {editLanche ? 'Editar Lanche/Combo' : 'Cadastro de Lanche/Combo'}
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
                      <label htmlFor="nome" className="form-label">
                        Nome *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Ex: Combo Família, Pipoca Grande, Refrigerante"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="descricao" className="form-label">
                        Descrição * (mínimo 10 caracteres)
                      </label>
                      <textarea
                        className="form-control"
                        id="descricao"
                        name="descricao"
                        rows={3}
                        value={formData.descricao}
                        onChange={handleChange}
                        placeholder="Ex: 1 pipoca grande + 2 refrigerantes 500ml"
                        required
                      ></textarea>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="valorUnitario" className="form-label">
                          Valor Unitário (R$) *
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="valorUnitario"
                          name="valorUnitario"
                          min="0.01"
                          step="0.01"
                          value={formData.valorUnitario || ''}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="quantidade" className="form-label">
                          Quantidade em Estoque
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="quantidade"
                          name="quantidade"
                          min="0"
                          value={formData.quantidade || ''}
                          onChange={handleChange}
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
                  Tem certeza que deseja excluir <strong>{deleteLanche?.nome}</strong>?
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

export default CadastroLanches;

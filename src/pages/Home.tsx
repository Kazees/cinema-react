import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <i className="bi bi-film display-1 text-primary mb-4"></i>
            <h1 className="display-3 fw-bold mb-4">Sistema CineWeb</h1>
            <p className="lead text-muted mb-5">
              Sistema de Gestão de Cinema - Gerencie filmes, salas e sessões de forma simples e eficiente.
            </p>

            <div className="row g-4 mt-4">
              <div className="col-md-4">
                <Link to="/filmes" className="text-decoration-none">
                  <div className="card h-100 shadow-sm hover-card">
                    <div className="card-body text-center p-4">
                      <i className="bi bi-camera-reels display-4 text-primary mb-3"></i>
                      <h5 className="card-title">Gerenciar Filmes</h5>
                      <p className="card-text text-muted">
                        Cadastre e gerencie o catálogo de filmes
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-md-4">
                <Link to="/salas" className="text-decoration-none">
                  <div className="card h-100 shadow-sm hover-card">
                    <div className="card-body text-center p-4">
                      <i className="bi bi-door-open display-4 text-success mb-3"></i>
                      <h5 className="card-title">Gerenciar Salas</h5>
                      <p className="card-text text-muted">
                        Configure as salas do cinema
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-md-4">
                <Link to="/sessoes" className="text-decoration-none">
                  <div className="card h-100 shadow-sm hover-card">
                    <div className="card-body text-center p-4">
                      <i className="bi bi-calendar-event display-4 text-warning mb-3"></i>
                      <h5 className="card-title">Agendar Sessões</h5>
                      <p className="card-text text-muted">
                        Agende sessões de filmes
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

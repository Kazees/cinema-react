import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-film me-2"></i>
          CineWeb
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">
                <i className="bi bi-house-door me-1"></i>
                Início
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/filmes')}`} to="/filmes">
                <i className="bi bi-camera-reels me-1"></i>
                Filmes
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/salas')}`} to="/salas">
                <i className="bi bi-door-open me-1"></i>
                Salas
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/sessoes')}`} to="/sessoes">
                <i className="bi bi-calendar-event me-1"></i>
                Sessões
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/lanches')}`} to="/lanches">
                <i className="bi bi-cup-straw me-1"></i>
                Lanches
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/venda')}`} to="/venda">
                <i className="bi bi-cart-plus me-1"></i>
                Venda
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/listar-sessoes')}`} to="/listar-sessoes">
                <i className="bi bi-list-ul me-1"></i>
                Listar Sessões
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CadastroFilmes from './pages/CadastroFilmes';
import CadastroSalas from './pages/CadastroSalas';
import CadastroSessoes from './pages/CadastroSessoes';
import ListarSessoes from './pages/ListarSessoes';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import CadastroLanches from './pages/CadastroLanches';
import VendaCompleta from './pages/VendaCompleta';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/filmes" element={<CadastroFilmes />} />
        <Route path="/salas" element={<CadastroSalas />} />
        <Route path="/sessoes" element={<CadastroSessoes />} />
        <Route path="/listar-sessoes" element={<ListarSessoes />} />
        <Route path="/lanches" element={<CadastroLanches />} />
        <Route path="/venda" element={<VendaCompleta />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

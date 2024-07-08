import { BrowserRouter as Router, Routes, Route, Outlet, Link } from 'react-router-dom';
import Pages from './Pages';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/" element={<Layout />}>
          <Route path="RegisterLivro" element={<Pages.RegisterLivro />} />
          <Route path="RegisterAuthor" element={<Pages.RegisterAuthor />} />
          <Route path="RegisterGenre" element={<Pages.RegisterGenre />} />
        </Route>
      </Routes>
    </Router>
  );
}

function HomeLayout() {
  return (
    <div className="container-principal">
      <h2>Cadastros Biblioteca</h2>
      <nav className='nav-principal'>
        <ul>
          <li>
            <Link to="/RegisterLivro">Cadastrar Livro</Link>
          </li>
          <li>
            <Link to="/RegisterAuthor">Cadastrar Autor</Link>
          </li>
          <li>
            <Link to="/RegisterGenre">Registrar gênero</Link>
          </li>
        </ul>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}

function Layout() {
  return (
    <div className="container">
      <Outlet />
    </div>
  );
}

function Home() {
  return (
    <div>
      <h3></h3>
    </div>
  );
}

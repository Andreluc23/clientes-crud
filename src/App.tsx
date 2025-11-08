import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import ClientesList from "./pages/ClientesList";
import ClienteForm from "./pages/ClienteForm";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-semibold" to="/clientes">Clientes</Link>
          
        </div>
      </nav>

      
      <main className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-11 col-lg-10">
            <Routes>
              <Route path="/" element={<Navigate to="/clientes" replace />} />
              <Route path="/clientes" element={<ClientesList />} />
              <Route path="/clientes/novo" element={<ClienteForm />} />
              <Route path="/clientes/:id/editar" element={<ClienteForm />} />
              <Route path="*" element={<p>404</p>} />
            </Routes>
          </div>
        </div>
      </main>
    </BrowserRouter>
  );
}

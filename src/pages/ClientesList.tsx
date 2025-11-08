import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listarClientes, excluirCliente } from "../services/clientes";
import type { Cliente } from "../types/Cliente";

export default function ClientesList() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function carregar() {
    setLoading(true);
    try {
      const data = await listarClientes();
      setClientes(data);
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id?: number) {
    if (!id) return;
    if (!window.confirm("Confirmar exclusão do cliente?")) return;
    await excluirCliente(id);
    await carregar();
  }

  useEffect(() => { carregar(); }, []);

  return (
    <section className="vstack gap-3">
     <div className="text-center mb-3">
  <h1 className="h4 mb-3">Clientes</h1>
  <button className="btn btn-primary" onClick={() => navigate("/clientes/novo")}>
    + Novo Cliente
  </button>
</div>


      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-secondary">Carregando...</div>
          ) : clientes.length === 0 ? (
            <div className="text-secondary">Nenhum cliente cadastrado.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Cidade/UF</th>
                    <th style={{width: 160}}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.nomeCompleto}</td>
                      <td>{c.email}</td>
                      <td>{c.telefone}</td>
                      <td>{c.cidade}/{c.estado}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link className="btn btn-outline-secondary btn-sm" to={`/clientes/${c.id}/editar`}>
                            Editar
                          </Link>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(c.id!)}>
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { criarCliente, obterCliente, atualizarCliente } from "../services/clientes";
import type { Cliente } from "../types/Cliente";

const vazio: Cliente = {
  nomeCompleto: "",
  cpf: "",
  dataNascimento: "",
  email: "",
  telefone: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: ""
};

export default function ClienteForm() {
  const { id } = useParams<{ id: string }>(); 
  const editando = !!id;
  const [form, setForm] = useState<Cliente>(vazio);
  const [salvando, setSalvando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregar() {
      if (!editando) return;
      try {
        const data = await obterCliente(id!); 
        setForm(data);
      } catch (err) {
        console.error("Erro ao carregar cliente:", err);
        alert("Não foi possível carregar o cliente.");
        navigate("/clientes");
      }
    }
    carregar();
  }, [editando, id, navigate]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "estado" ? value.toUpperCase() : value
    }));
  }

  function emailBasicoOk(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.nomeCompleto.trim()) return alert("Informe o nome completo.");
    if (!emailBasicoOk(form.email)) return alert("Email inválido.");
    if (!form.estado || form.estado.length !== 2) return alert("Informe a UF com 2 letras.");

    setSalvando(true);
    try {
      if (editando) {
        console.log("Atualizando id:", id, "payload:", form);
        await atualizarCliente(id!, form);
        alert("Cliente atualizado!");
      } else {
        const payload = { ...form };
        delete (payload as any).id;
        console.log("Criando payload:", payload);
        await criarCliente(payload);
        alert("Cliente criado!");
      }
      navigate("/clientes");
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Não foi possível salvar. Veja o console (F12) > Network para detalhes.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section className="vstack gap-3">
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="h4 m-0">{editando ? "Editar Cliente" : "Novo Cliente"}</h1>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={onSubmit} className="vstack gap-3">
            <div>
              <label className="form-label">Nome completo *</label>
              <input className="form-control" name="nomeCompleto" value={form.nomeCompleto} onChange={handleChange} required />
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">CPF *</label>
                <input className="form-control" name="cpf" value={form.cpf} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Data de nascimento *</label>
                <input type="date" className="form-control" name="dataNascimento" value={form.dataNascimento} onChange={handleChange} required />
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Email *</label>
                <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Telefone *</label>
                <input className="form-control" name="telefone" value={form.telefone} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <label className="form-label">Logradouro *</label>
              <input className="form-control" name="logradouro" value={form.logradouro} onChange={handleChange} required />
            </div>

            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Número *</label>
                <input className="form-control" name="numero" value={form.numero} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Complemento</label>
                <input className="form-control" name="complemento" value={form.complemento ?? ""} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Bairro *</label>
                <input className="form-control" name="bairro" value={form.bairro} onChange={handleChange} required />
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label">Cidade *</label>
                <input className="form-control" name="cidade" value={form.cidade} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Estado (UF) *</label>
                <input className="form-control" name="estado" value={form.estado} maxLength={2} onChange={handleChange} required />
              </div>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={salvando}>
                {salvando ? "Salvando..." : "Salvar"}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/clientes")}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

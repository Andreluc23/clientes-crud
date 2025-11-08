import { api } from "./api";
import type { Cliente } from "../types/Cliente";

export async function listarClientes(): Promise<Cliente[]> {
  const { data } = await api.get<Cliente[]>("/clientes?_sort=id&_order=desc");
  return data;
}

export async function obterCliente(id: string | number): Promise<Cliente> {
  const { data } = await api.get<Cliente>(`/clientes/${id}`);
  return data;
}

export async function criarCliente(payload: Cliente): Promise<Cliente> {
  const { id, ...semId } = payload as any;
  const { data } = await api.post<Cliente>("/clientes", semId);
  return data;
}

export async function atualizarCliente(id: string | number, payload: Cliente): Promise<Cliente> {
  const { data } = await api.put<Cliente>(`/clientes/${id}`, payload);
  return data;
}

export async function excluirCliente(id: number | string): Promise<void> {
  await api.delete(`/clientes/${id}`);
}

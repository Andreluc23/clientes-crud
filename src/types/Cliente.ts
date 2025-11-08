export interface Cliente {
  id?: number; 
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string; 
  email: string;
  telefone: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string; 
}

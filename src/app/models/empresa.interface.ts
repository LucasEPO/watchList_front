import { Funcionario } from "./funcionario.interface";
import { Relatorio } from "./relatorio.interface";

export interface Empresa {
  id: number;
  name: string;
  login: string;
  pass_hash: string;
  funcionarios: Funcionario[];
  relatorios: Relatorio[];
}
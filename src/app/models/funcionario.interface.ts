import { Empresa } from "./empresa.interface";
import { Relatorio } from "./relatorio.interface";

export interface Funcionario {
  id: number;
  name: string;
  email: string;
  empresa: Empresa;
  relatorios: Relatorio[];
}
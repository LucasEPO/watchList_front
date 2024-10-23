import { Empresa } from './empresa.interface';
import { Funcionario } from './funcionario.interface';

export interface Relatorio {
  id: number;
  title: string;
  is_finished: boolean | null;
  is_priority: boolean | null;
  description: Text;
  prevention_action: Text;
  risk_action:Text;
  date: Date;
  workshift: string;
  create_date: Date;
  department: string;
  equipament: string;
  finished_date: Date | null;
  last_update: Date;
  funcionario: Funcionario;
  empresa: Empresa;
}
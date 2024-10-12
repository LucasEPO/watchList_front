import { Empresa } from './empresa.interface';
import { Funcionario } from './funcionario.interface';

export interface Relatorio {
  id: number;
  title: string;
  is_finished: boolean | null;
  is_priority: boolean | null;
  complete_form: Text;
  create_date: Date;
  finished_date: Date | null;
  last_update: Date;
  funcionario: Funcionario;
  empresa: Empresa;
}
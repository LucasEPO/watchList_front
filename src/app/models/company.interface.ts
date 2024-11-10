import { Employee } from "./employee.interface";
import { Report } from "./report.interface";

export interface Company {
	id: number;
	name: string;
	login: string;
	pass_hash: string;
	funcionarios: Employee[];
	relatorios: Report[];
}
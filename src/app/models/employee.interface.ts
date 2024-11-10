import { Company } from "./company.interface";
import { Report } from "./report.interface";

export interface Employee {
    id: number;
    name: string;
    email: string;
    empresa: Company;
    relatorios: Report[];
}
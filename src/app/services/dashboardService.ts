import axios from 'axios';
import { CreateEmployee } from '../models/create-employee.interface';
import { CreateReport } from '../models/create-report.interface';

const API_URL = "http://localhost:3001";

const dashboardService = {
    async getReportData() {
        const id = sessionStorage.getItem('empresa_id');
        const token = sessionStorage.getItem('access_token');

        if (!id || !token) 
            throw {code: 'ERROR_UNAUTHORIZED', status: 401};

        try {
            const response = await axios.get(`${API_URL}/empresas/relatorios/${id}`);
            return response.data;
        } catch (error) {
            throw {code: 'ERROR_DATA_SEARCH', status: 500};
        }
    },

    async updateReport(id: number, updates: object) {
        try{
            const response = await axios.patch(`${API_URL}/relatorios/${id}`, updates, { 
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response;
              
        } catch (error: any) {
            if (error.response?.status === 404) 
                throw { code: 'ERROR_NOT_FOUND', status: 404 };
            throw {code: 'ERROR_UPDATE', status: 500};
        }
    },

    async updateEmployee(id: number, updates: object) {
        try{
            const response = await axios.patch(`${API_URL}/funcionarios/${id}`, updates, { 
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response;
              
        } catch (error: any) {
            if (error.response?.status === 404) 
                throw { code: 'ERROR_NOT_FOUND', status: 404 };

            throw {code: 'ERROR_UPDATE', status: 500};
        }
    },

    async deleteReport(id: number) {
        try {
            const response = await axios.delete(`${API_URL}/relatorios/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            return response;
        } catch (error: any) {
            if (error.response?.status === 404) 
                throw { code: 'ERROR_NOT_FOUND', status: 404 };
            throw {code: 'ERROR_DELETE', status: 500};
        }
    },

    async deleteEmployee(id: number) {
        try {
            const response = await axios.delete(`${API_URL}/funcionarios/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            return response;
        } catch (error: any) {
            if (error.response?.status === 404) 
                throw { code: 'ERROR_NOT_FOUND', status: 404 };

            throw {code: 'ERROR_DELETE', status: 500};
        }
    },

    async findReport(id: number) {
        try {
            const response = await axios.get(`${API_URL}/relatorios/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) 
                throw { code: 'ERROR_NOT_FOUND', status: 404 };

            throw { code: 'ERROR_FETCHING', status: 500 };
        }
    },
    
    async findEmployee(id: number) {
        try {
            const response = await axios.get(`${API_URL}/funcionarios/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.data) 
                throw { code: 'ERROR_NOT_FOUND', status: 404 };

            return response.data;
        } catch (error: any ) {
            if (error.response?.status === 404) 
                throw { code: 'ERROR_NOT_FOUND', status: 404 };
            throw { code: 'ERROR_FETCHING', status: 500 };
        }
            
    },

    async findEmpresa(id: number) {
        try {
            const response = await axios.get(`${API_URL}/empresas/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.data) 
                throw { code: 'ERROR_NOT_FOUND', status: 404 };

            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) 
                throw { code: 'ERROR_NOT_FOUND', status: 404 };
            throw {code: 'ERROR_FETCHING', status: 500};
        }
    },

    async getAllEmployees() {
        try{
            const id = sessionStorage.getItem('empresa_id');
            const token = sessionStorage.getItem('access_token');
    
            if (!id || !token) 
                throw {code: 'ERROR_UNAUTHORIZED', status: 401};

            const response = await axios.get(`${API_URL}/funcionarios/empresa/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.data;
        } catch (error) {
            throw {code: 'ERROR_DATA_SEARCH', status: 500};
        }
    },

    async createEmployee(funcionario: CreateEmployee) {
        try {
            const response = await axios.post(`${API_URL}/funcionarios`, funcionario, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response;

        }catch (error) {
            throw {code: 'ERROR_CREATE', status: 500};
        }
    },

    async createReport(report: CreateReport) {
        try {
            const response = await axios.post(`${API_URL}/relatorios`, report, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response;
        } catch (error) {
            throw {code: 'ERROR_CREATE', status: 500};
        }
    }
};

export default dashboardService;
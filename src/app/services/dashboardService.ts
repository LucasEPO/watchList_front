import axios from 'axios';
import { CreateFuncionario } from '../models/create-funcionario.interface';

const API_URL = "http://localhost:3001";

const dashboardService = {
    async getReportData() {
        const id = sessionStorage.getItem('empresa_id');
        const token = sessionStorage.getItem('access_token');

        if (!id || !token) 
            throw new Error('Usuário não autenticado ou ID da empresa não encontrado');

        try {
            const response = await axios.get(`${API_URL}/empresas/relatorios/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar relatórios:', error);
            return;
        }
    },

    async updateRelatorio(id: number, updates: object) {
        try{
            const response = await axios.patch(`${API_URL}/relatorios/${id}`, updates, { 
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response;
              
        }catch (error) {
            alert("Erro ao atualizar o relatorio!")
            throw error;
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
              
        }catch (error) {
            alert("Erro ao atualizar o funcionario!")
            throw error;
        }
    },

    async deleteRelatorio(id: number) {
        try {
            const response = await axios.delete(`${API_URL}/relatorios/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            return response;
        } catch (error) {
            alert("Erro ao deletar o relatorio!");
            throw error;
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
        } catch (error) {
            alert("Erro ao deletar o funcionario!");
            throw error;
        }
    },

    async findRelatorio(id: number) {
        try {
            const response = await axios.get(`${API_URL}/relatorios/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.data;
        } catch (error) {
            alert("Erro ao buscar o relatorio!");
            throw error;
        }
            
    },
    
    async findEmployee(id: number) {
        try {
            const response = await axios.get(`${API_URL}/funcionarios/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.data;
        } catch (error) {
            alert("Erro ao buscar o funcionario!");
            throw error;
        }
            
    },

    async findEmpresa(id: number) {
        try {
            const response = await axios.get(`${API_URL}/empresas/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.data;
        } catch (error) {
            alert("Erro ao buscar a empresa!");
            throw error;
        }
    },

    async getAllEmployees() {
        try{
            const id = sessionStorage.getItem('empresa_id');
            const token = sessionStorage.getItem('access_token');
    
            if (!id || !token) 
                throw new Error('Usuário não autenticado ou ID da empresa não encontrado');

            const response = await axios.get(`${API_URL}/empresas/funcionarios/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.data;
        } catch (error) {
            alert("Erro ao buscar funcionários!");
            throw error;
        }
    },

    async createEmployee(funcionario: CreateFuncionario) {
        try {
            const response = await axios.post(`${API_URL}/funcionarios`, funcionario, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response;

        }catch (error) {
            alert("Erro ao criar funcionário!");
            throw error;
        }
    }
};

export default dashboardService;
import axios from 'axios';

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
            
    }
};

export default dashboardService;
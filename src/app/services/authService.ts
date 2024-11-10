import axios from 'axios';
import { CreateCompany } from '../models/create-company.interface';

const API_URL = "http://localhost:3001";

const authService = {
	async login(login: string, password: string) {
		try {
			sessionStorage.clear();
			const response = await axios.post(`${API_URL}/auth/login`, {
				login,
				password
			});
			const token = response.data.access_token;
			const empresa_id = response.data.empresa_id;
			
			sessionStorage.setItem("access_token", token);
			sessionStorage.setItem("empresa_id", empresa_id);

			return token;
		} catch (error: any) {
			if (error.response && error.response.status === 401) 
				throw { code: 'ERROR_INCORRECT_LOGIN', status: 401 };
			
			throw { code: 'ERROR_LOGIN_FAILED', status: error.response?.status || 500 };
		}
	},

	async registration(empresa: CreateCompany) {
		try {
			const loginVerify = await axios.get(`${API_URL}/empresas/login/${empresa.login}`);
			if (loginVerify.data) 
				throw { code: 'ERROR_REPEATED_LOGIN' };
			
			const response = await axios.post(`${API_URL}/empresas`, empresa);
	
			if (response.data) {
				const token = await this.login(empresa.login, empresa.pass_hash);
				return token;
			} 

		} catch (error: any) {
			if (error.code === 'ERROR_REPEATED_LOGIN') 
				throw { code: 'ERROR_REPEATED_LOGIN' };
			
			throw { code: 'ERROR_REGISTRATION_FAILED', status: error.response?.status || 500};
		}
	}
};

export default authService;
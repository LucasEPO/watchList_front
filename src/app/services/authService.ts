import axios from 'axios';
import { CreateEmpresa } from '../models/create-empresa.interface';

const authService = {
  async login(login: string, password: string) {
    try {
      sessionStorage.clear();
      const response = await axios.post("http://localhost:3001/auth/login", {
        login,
        password
      });
      const token = response.data.access_token;
      const empresa_id = response.data.empresa_id;
      
      if (!response.data.access_token) {
        throw new Error(`Falha no login código ${response.status}: ${response.statusText}`);
      }

      sessionStorage.setItem("access_token", token);
      sessionStorage.setItem("empresa_id", empresa_id);

      return token;
    } catch (error) {
      throw error;
    }
  },

  async registration(empresa: CreateEmpresa) {
    try {
      const loginVerify = await axios.get(`http://localhost:3001/empresas/login/${empresa.login}`);
      if (loginVerify.data) 
        throw new Error('Login já cadastrado');
      
      const response = await axios.post("http://localhost:3001/empresas", empresa);
  
      if (response.data) {
        const token = await this.login(empresa.login, empresa.pass_hash);
        return token;
      } else {
        throw new Error("Falha no registro da empresa");
      }
    } catch (error) {
      throw error;
    }
  }
};

export default authService;
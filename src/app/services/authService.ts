import axios from 'axios';

const authService = {
  async login(login: string, password: string) {
    try {
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
};

export default authService;
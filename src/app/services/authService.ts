import axios from 'axios';

const authService = {
  async login(login: string, password: string) {
    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        login,
        password
      });

      if (!response.data.access_token) {
        throw new Error(`Falha no login código ${response.status}: ${response.statusText}`);
      }

      const token = response.data.access_token;

      localStorage.setItem("access_token", token);

      return token;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
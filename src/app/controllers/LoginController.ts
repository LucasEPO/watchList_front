import authService from '../services/authService';

const login = async (login: string, password: string) => {
  try {
    const token = await authService.login(login, password);
    return token;
  } catch (error) {
    throw error;
  }
};

export default { login };
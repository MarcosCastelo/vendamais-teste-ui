import axios, { AxiosResponse } from 'axios'

const URI = process.env.REACT_APP_API_URL + '/accounts';

interface LoginResponse {
  refresh: string;
  access: string;
  user: {
    username: string;
    cpf: string;
    balance: number;
    is_active: boolean;
  };
}

interface RegisterResponse {
  username: string
  cpf: string
  email: string
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response: AxiosResponse<LoginResponse> = await axios.post(`${URI}/login/`, { username, password });
  return response.data;
};

export const register = async (userData: { username: string; password: string; email: string, cpf: string }): Promise<AxiosResponse> => {
    const response: AxiosResponse<RegisterResponse> = await axios.post(`${URI}/register/`, userData);
    return response
};
import axios, { AxiosResponse } from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const token = localStorage.getItem('access_token');

const api = axios.create({
  baseURL: API_URL + "/transactions",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const fetchReport = async (timeFrame: string='24h'): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(`/report/?time_frame=${encodeURIComponent(timeFrame)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const makeDeposit = async (amount: number): Promise<any> => {
  try {
    const response = await api.post('/deposit/', { amount });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const makeWithdraw = async (amount: number): Promise<any> => {
  try {
    const response = await api.post('/withdraw/', { amount });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const makeTransfer = async (destination_cpf: string, amount: number): Promise<any> => {
  try {
    const response = await api.post('/transfer/', { destination_cpf, amount });
    return response.data;
  } catch (error) {
    throw error;
  }
};

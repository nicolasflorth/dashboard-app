import axiosInstance from './axiosInstance';

export const getBudgets = async () => {
  const response = await axiosInstance.get('/budgets'); // example endpoint
  return response.data;
};

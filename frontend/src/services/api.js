import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getProductionData = () => axios.get(`${API_BASE_URL}/production`);
export const getKPIs = () => axios.get(`${API_BASE_URL}/kpi`);
export const getMachineById = (id) => axios.get(`${API_BASE_URL}/machine/${id}`);
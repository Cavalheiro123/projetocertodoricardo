import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-biblioteca.tcc.uniuv.edu.br/',
});

export default api;

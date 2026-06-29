import axios from 'axios';

const axiosInstance = axios.create({
  //baseURL: 'http://localhost:5001', // local
  baseURL: 'http://3.107.202.133:5003', // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
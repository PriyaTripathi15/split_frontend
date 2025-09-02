import axios from 'axios';

// const instance = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   withCredentials: true,
// });

const instance = axios.create({
 baseURL: "https://split-backend-1.onrender.com/api",
  withCredentials: true,
});

export default instance;
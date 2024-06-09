import axios from 'axios';

export default axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  //   withCredentials: true,
  timeout: 60000,
  responseType: 'json',
  responseEncoding: 'utf8',
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  maxRedirects: 5,
  headers: {
    'Content-Type': 'application/json',
  },
});

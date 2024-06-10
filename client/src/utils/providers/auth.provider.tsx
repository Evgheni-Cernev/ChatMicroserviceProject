import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/http/axios';
import { AuthContext } from '../contexts/auth.context';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  // Axios interceptor to handle 401 and 403 responses
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (res) => res,
      (error) => {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on component unmount
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated: false }}>
      {children}
    </AuthContext.Provider>
  );
};

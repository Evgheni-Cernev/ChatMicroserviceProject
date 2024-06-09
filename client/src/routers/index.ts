import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { App } from '../components/App/App';
import { Login } from '../components/Login/login';
import { Signup } from '../components/Signup/signup';

const routes: RouteObject[] = [
  {
    path: '/',
    Component: App,
  },
  {
    path: '/signup',
    Component: Signup,
  },
  {
    path: '/login',
    Component: Login,
  },
];

export const router = createBrowserRouter(routes);

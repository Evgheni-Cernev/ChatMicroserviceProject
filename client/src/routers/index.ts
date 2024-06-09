import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { App } from '../components/App/App';
import { Login } from '../components/Login/login';
import { Signup } from '../components/Signup/signup';
import { ChatsMenu } from '../components/ChatsMenu/chatsMenu';

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
  {
    path: '/chats',
    Component: ChatsMenu,
  },
];

export const router = createBrowserRouter(routes);

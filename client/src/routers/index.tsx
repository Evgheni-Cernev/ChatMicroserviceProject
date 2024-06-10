import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { App } from '../components/App/App';
import { Login } from '../components/Login/login';
import { Signup } from '../components/Signup/signup';
import { ChatsMenu } from '../components/ChatsMenu/chatsMenu';
import { Chat } from '../components/Chat/chat';
import { AuthProvider } from '../utils/providers/auth.provider';

const routes: RouteObject[] = [
  {
    path: '/',
    // Component: App,
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/chats',
    element: <ChatsMenu />,
  },
  {
    path: '/chat/:id',
    element: <Chat />,
  },
];

export const router = createBrowserRouter(routes);

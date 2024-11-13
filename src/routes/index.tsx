import { lazy } from 'react';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';

// Lazy loading for performance
const Home = lazy(() => import('../pages/Home'));
const SignInPage = lazy(() => import('../pages/SignInPage'));
const SignUpPage = lazy(() => import('../pages/SignUpPage'));

interface IRoute {
  path: string;
  element: JSX.Element;
  children?: IRoute[];
}

const router: IRoute[] = [
  // Public routes (accessible to all users)
  {
    path: '/auth',
    element: <PublicRoutes />,
    children: [
      {
        path: 'signin', // Make this relative
        element: <SignInPage />,
      },
      {
        path: 'signup', // Make this relative
        element: <SignUpPage />,
      },
    ],
  },
  // Private routes (accessible only to authenticated users)
  {
    path: '/',
    element: <PrivateRoutes />,
    children: [
      {
        path: '', // Relative path for the home route
        element: <Home />,
      },
    ],
  },
];

export default router;

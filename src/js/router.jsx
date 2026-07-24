import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './auth';

import Layout from '../components/Layout';
import AdminLayout from '../components/AdminLayout';
import Home from '../pages/home';
import Login from '../pages/login';
import Dashboard from '../pages/dashboard';
import Prices from '../pages/prices';
import Alerts from '../pages/alerts';
import Recommendations from '../pages/recommendations';
import Profile from '../pages/profile';
import AdminDashboard from '../pages/admin-dashboard';
import AdminPrices from '../pages/admin-prices';
import AdminAlerts from '../pages/admin-alerts';
import AdminRecommendations from '../pages/admin-recommendations';

// Componentes de protección
const ProtectedRoute = () => {
  const { session, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen flex items-center justify-center dark:text-slate-100">Cargando...</div>;
  if (!session) return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  return <Outlet />;
};

const AdminRoute = () => {
  const { profile, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (!profile?.es_admin) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      
      // Rutas privadas
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'prices', element: <Prices /> },
          { path: 'alerts', element: <Alerts /> },
          { path: 'recommendations', element: <Recommendations /> },
          { path: 'profile', element: <Profile /> },
        ]
      }
    ]
  },

  // Panel Admin con su propio layout
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <Navigate to="/admin/dashboard" replace /> },
              { path: 'dashboard', element: <AdminDashboard /> },
              { path: 'prices', element: <AdminPrices /> },
              { path: 'alerts', element: <AdminAlerts /> },
              { path: 'recommendations', element: <AdminRecommendations /> },
            ]
          }
        ]
      }
    ]
  }
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}

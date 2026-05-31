import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();
  const hideFooterRoutes = [
    '/dashboard',
    '/prices',
    '/alerts',
    '/recommendations',
    '/profile',
    '/login'
  ];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <Outlet />
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

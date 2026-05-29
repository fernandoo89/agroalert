import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminNavbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <Outlet />
      </main>
    </div>
  );
}

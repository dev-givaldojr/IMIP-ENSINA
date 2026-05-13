import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { LogOut, Home, Star } from 'lucide-react';
import Mascot from './Mascot';

export default function Layout() {
  const { teacherName, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-hospital-light">
      <header className="bg-white shadow-sm border-b border-hospital-blue/10 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-hospital-yellow rounded-full flex items-center justify-center text-white">
            <Star className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-hospital-dark leading-none">IMIP Aprende</h1>
            <p className="text-xs text-hospital-blue font-semibold">Portal do Professor</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-500 hover:text-hospital-blue flex items-center gap-2 font-semibold transition-colors">
            <Home className="w-5 h-5" />
            <span className="hidden md:inline">Dashboard</span>
          </Link>
          <Link to="/trail" className="text-gray-500 hover:text-hospital-blue flex items-center gap-2 font-semibold transition-colors">
            <Star className="w-5 h-5" />
            <span className="hidden md:inline">Trilhas</span>
          </Link>
          <Link to="/reports" className="text-gray-500 hover:text-hospital-blue flex items-center gap-2 font-semibold transition-colors">
            <span className="hidden md:inline">Relatórios</span>
          </Link>
          <div className="h-6 w-px bg-gray-200"></div>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700 hidden sm:inline">{teacherName}</span>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative">
        <Outlet />
      </main>

      <Mascot />
    </div>
  );
}

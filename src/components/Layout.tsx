import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Users, Mail, LayoutDashboard, LineChart } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function NavItem({ to, icon, label, isActive }: NavItemProps) {
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 ${
        isActive
          ? 'bg-[#5B3CC4] text-white shadow-lg shadow-[#5B3CC4]/20'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        isActive ? 'bg-white/20' : 'bg-gray-100'
      }`}>
        {icon}
      </div>
      <span className="ml-3 font-medium">{label}</span>
    </Link>
  );
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const navItems = [
    { to: '/customers', icon: <LayoutDashboard className="w-5 h-5" />, label: 'My CRM' },
    { to: '/leads', icon: <Users className="w-5 h-5" />, label: 'Leads Management' },
    { to: '/email', icon: <Mail className="w-5 h-5" />, label: 'Emails' },
    { to: '/company-scorer', icon: <LineChart className="w-5 h-5" />, label: 'Company Info/Scorer' },
  ];

  const getPageTitle = () => {
    const item = navItems.find(item => item.to === location.pathname);
    return item ? item.label : 'My CRM';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-72 bg-white shadow-xl z-10">
        <div className="h-16 flex items-center px-6">
          <button 
            onClick={() => navigate('/customers')}
            className="flex items-center group relative"
          >
            <div className="relative">
              <span className="text-2xl font-black text-[#5B3CC4] group-hover:text-[#4B2CB4] transition-colors duration-300">
                Get my Leadz
              </span>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#5B3CC4] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          </button>
        </div>
        
        <div className="px-4 py-6">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.to}
              />
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 bg-gray-50">
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-200"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main content with left margin to account for fixed sidebar */}
      <div className="pl-72">
        <Header title={getPageTitle()} />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
import { Mail, User, RefreshCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 h-16">
      <div className="h-full px-8 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {title === 'Emails' && (
            <button 
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              onClick={() => console.log('Refresh')}
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
            onClick={() => navigate('/email')}
          >
            <Mail className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="pl-4 border-l border-gray-200 flex items-center space-x-3">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">{user?.name}</span>
              <span className="text-xs text-gray-500">{user?.email}</span>
            </div>
            <div className="w-8 h-8 bg-[#5B3CC4] rounded-full flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
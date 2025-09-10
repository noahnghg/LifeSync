
import React from 'react';
import { Calendar, CheckSquare, DollarSign, BarChart3, Home, Settings, User, MessageSquare, Blocks, LogOut } from 'lucide-react';
import { CustomLifeBlock } from '@/types/lifeblocks';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  customLifeBlocks?: CustomLifeBlock[];
}

const Sidebar = ({ activeModule, setActiveModule, customLifeBlocks = [] }: SidebarProps) => {
  const { user, logout } = useAuth();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'lifeblocks', label: 'Custom LifeBlocks', icon: Blocks },
  ];

  const bottomItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="bg-white border-r border-gray-200 w-64 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          LifeSync
        </h1>
        <p className="text-sm text-gray-500 mt-1">Your productivity hub</p>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}

          {/* Custom LifeBlocks Section */}
          {customLifeBlocks.length > 0 && (
            <>
              <div className="pt-4 pb-2">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Your LifeBlocks
                </h3>
              </div>
              {customLifeBlocks.map((lifeBlock) => {
                const isActive = activeModule === `lifeblock-${lifeBlock.id}`;
                
                return (
                  <button
                    key={lifeBlock.id}
                    onClick={() => setActiveModule(`lifeblock-${lifeBlock.id}`)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className={`text-lg mr-3 p-1 rounded ${isActive ? lifeBlock.color : 'opacity-60'}`}>
                      {lifeBlock.icon}
                    </span>
                    <span className="font-medium truncate">{lifeBlock.name}</span>
                    <span className="ml-auto text-xs text-gray-400">
                      {lifeBlock.contents.length}
                    </span>
                  </button>
                );
              })}
            </>
          )}
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-100">
        <div className="space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'profile') {
                    window.location.href = '/profile';
                  } else {
                    setActiveModule(item.id);
                  }
                }}
                className="w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <Icon className="w-5 h-5 mr-3 text-gray-400" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

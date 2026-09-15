import { Button } from '@/components/ui/button';
import { ActivePanel } from './Dashboard';
import { LogOut, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  activePanel: ActivePanel;
  setActivePanel: (panel: ActivePanel) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout?: () => void;
}

const Sidebar = ({ activePanel, setActivePanel, isOpen, onLogout }: SidebarProps) => {
  const menuItems = [
    { id: 'home' as ActivePanel, label: 'Dashboard', icon: '🏠' },
    { id: 'inmates' as ActivePanel, label: 'Inmates', icon: '👤' },
    { id: 'staff' as ActivePanel, label: 'Staff', icon: '👥' },
    { id: 'visitors' as ActivePanel, label: 'Visitors', icon: '🚶' },
    { id: 'cells' as ActivePanel, label: 'Cells', icon: '🏢' },
    { id: 'reports' as ActivePanel, label: 'Reports', icon: '📊' },
    { id: 'settings' as ActivePanel, label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 text-slate-800 transition-all duration-300 z-40 flex flex-col justify-between ${isOpen ? 'w-52' : 'w-16'}`}>
      <div>
        {/* Logo Section */}
        <div className="p-3.5 border-b border-slate-100">
          <div className={`flex items-center ${isOpen ? 'justify-start' : 'justify-center'}`}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            {isOpen && (
              <span className="ml-2.5 font-bold text-sm tracking-tight text-slate-900 leading-tight">
                Jail Management
              </span>
            )}
          </div>
        </div>
        
        {/* Navigation Items */}
        <nav className="mt-3 space-y-0.5 px-1.5">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activePanel === item.id ? 'secondary' : 'ghost'}
              className={`w-full justify-start h-10 rounded-lg text-left transition-all ${
                activePanel === item.id 
                  ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              onClick={() => setActivePanel(item.id)}
            >
              <span className="text-base mr-2.5">{item.icon}</span>
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Button>
          ))}
        </nav>
      </div>

      {/* Logout Button in Bottom of Sidebar */}
      <div className="p-2 border-t border-slate-100 bg-white">
        <Button
          variant="outline"
          onClick={onLogout}
          className={`w-full border-slate-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors h-10 rounded-lg ${
            isOpen ? 'justify-start px-3' : 'justify-center px-0'
          }`}
        >
          <LogOut className="h-4 w-4 shrink-0 text-red-500" />
          {isOpen && <span className="ml-2.5 font-semibold text-xs uppercase tracking-wider">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

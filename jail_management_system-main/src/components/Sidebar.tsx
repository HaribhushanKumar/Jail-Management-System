
import { Button } from '@/components/ui/button';
import { ActivePanel } from './Dashboard';

interface SidebarProps {
  activePanel: ActivePanel;
  setActivePanel: (panel: ActivePanel) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar = ({ activePanel, setActivePanel, isOpen }: SidebarProps) => {
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
    <div className={`fixed left-0 top-0 h-full bg-slate-800 text-white transition-all duration-300 z-40 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="p-4">
        <div className={`flex items-center ${isOpen ? 'justify-start' : 'justify-center'}`}>
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-slate-800 font-bold">J</span>
          </div>
          {isOpen && (
            <span className="ml-3 font-bold text-lg">Jail Management</span>
          )}
        </div>
      </div>
      
      <nav className="mt-8">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activePanel === item.id ? 'secondary' : 'ghost'}
            className={`w-full justify-start h-12 rounded-none text-left ${
              activePanel === item.id 
                ? 'bg-slate-700 text-white border-r-4 border-blue-400' 
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            onClick={() => setActivePanel(item.id)}
          >
            <span className="text-xl mr-3">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </Button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

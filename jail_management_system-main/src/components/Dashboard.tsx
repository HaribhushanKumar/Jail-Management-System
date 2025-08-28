
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import InmatesPanel from './panels/InmatesPanel';
import StaffPanel from './panels/StaffPanel';
import VisitorsPanel from './panels/VisitorsPanel';
import CellsPanel from './panels/CellsPanel';
import ReportsPanel from './panels/ReportsPanel';
import SettingsPanel from './panels/SettingsPanel';
import DashboardHome from './DashboardHome';

interface DashboardProps {
  currentUser: string;
  onLogout: () => void;
}

export type ActivePanel = 'home' | 'inmates' | 'staff' | 'visitors' | 'cells' | 'reports' | 'settings';

const Dashboard = ({ currentUser, onLogout }: DashboardProps) => {
  const [activePanel, setActivePanel] = useState<ActivePanel>('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'home':
        return <DashboardHome />;
      case 'inmates':
        return <InmatesPanel />;
      case 'staff':
        return <StaffPanel />;
      case 'visitors':
        return <VisitorsPanel />;
      case 'cells':
        return <CellsPanel />;
      case 'reports':
        return <ReportsPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        activePanel={activePanel} 
        setActivePanel={setActivePanel}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header 
          currentUser={currentUser} 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="flex-1 p-6">
          {renderActivePanel()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

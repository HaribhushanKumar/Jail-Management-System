import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import JailChatbot from './JailChatbot';
import InmatesPanel from './panels/InmatesPanel';
import StaffPanel from './panels/StaffPanel';
import VisitorsPanel from './panels/VisitorsPanel';
import CellsPanel from './panels/CellsPanel';
import ReportsPanel from './panels/ReportsPanel';
import SettingsPanel from './panels/SettingsPanel';
import { ApiConfigBanner } from './ApiConfigBanner';
import DashboardHome from './DashboardHome';

interface DashboardProps {
  currentUser: string;
  onLogout: () => void;
}

export type ActivePanel = 'home' | 'inmates' | 'staff' | 'visitors' | 'cells' | 'reports' | 'settings';

const Dashboard = ({ currentUser, onLogout }: DashboardProps) => {
  const [activePanel, setActivePanel] = useState<ActivePanel>('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleBack = () => setActivePanel('home');

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'home':
        return <DashboardHome />;
      case 'inmates':
        return <InmatesPanel onBack={handleBack} />;
      case 'staff':
        return <StaffPanel onBack={handleBack} />;
      case 'visitors':
        return <VisitorsPanel onBack={handleBack} />;
      case 'cells':
        return <CellsPanel onBack={handleBack} />;
      case 'reports':
        return <ReportsPanel onBack={handleBack} />;
      case 'settings':
        return <SettingsPanel onBack={handleBack} />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ApiConfigBanner />
      <div className="flex flex-1">
        <Sidebar 
          activePanel={activePanel} 
          setActivePanel={setActivePanel}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          onLogout={onLogout}
        />
        
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-52' : 'ml-16'}`}>
          <Header 
            currentUser={currentUser} 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
          
          <main className="flex-1 p-6 bg-white">
            {renderActivePanel()}
          </main>

          <Footer />
        </div>

        {/* RAG-based Chatbot Assistant (Bottom Right) */}
        <JailChatbot />
      </div>
    </div>
  );
};

export default Dashboard;

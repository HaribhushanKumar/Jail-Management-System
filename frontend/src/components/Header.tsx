
import { Button } from '@/components/ui/button';
import { Shield } from "lucide-react";

interface HeaderProps {
  currentUser: string;
  toggleSidebar: () => void;
}

const Header = ({ currentUser, toggleSidebar }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="mr-4"
          >
            ☰
          </Button>
          <div className="flex items-center">
            <Shield className="h-6 w-6 mr-2 text-blue-600" />
            <h1 className="text-xl font-semibold text-slate-800">
              Jail Management System
            </h1>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-slate-600">Welcome, {currentUser}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;

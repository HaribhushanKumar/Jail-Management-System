
import { LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FooterProps {
  onLogout?: () => void;
}

const Footer = ({ onLogout }: FooterProps) => {
  return (
    <footer className="bg-slate-800 text-white py-6 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0 pl-[200px]">
            <div className="flex items-center">
              <Shield className="h-6 w-6 mr-2 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold">Jail Management System</h3>
                <p className="text-slate-300 text-sm">Secure facility management solution</p>
              </div>
            </div>
            
            {onLogout && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onLogout} 
                className="text-slate-200 border-slate-600 hover:bg-slate-700 hover:text-white ml-0 md:ml-4"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-sm text-slate-300">
            <span>All rights reserved {new Date().getFullYear()}</span>
            <span className="hidden md:inline">|</span>
            <span>Professional Correctional Management</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

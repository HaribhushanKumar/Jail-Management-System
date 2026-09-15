import { ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-500 py-4 px-6 text-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          <span className="font-semibold text-slate-700">Jail Management System</span>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Systems Operational
          </span>
        </div>
        
        <div className="flex items-center space-x-4 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} Jail Management System</span>
          <span>•</span>
          <span>Professional Correctional Operations</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

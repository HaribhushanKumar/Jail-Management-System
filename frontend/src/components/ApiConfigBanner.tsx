import React, { useState, useEffect } from 'react';
import { getApiBaseUrl, setApiBaseUrl } from '@/config/apiConfig';
import { Server, Check, RefreshCw, AlertTriangle, Link2 } from 'lucide-react';

export const ApiConfigBanner: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [inputUrl, setInputUrl] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isVercelWarning, setIsVercelWarning] = useState<boolean>(false);

  useEffect(() => {
    const url = getApiBaseUrl();
    setCurrentUrl(url);
    setInputUrl(url);

    // Check if hosted on production (like vercel.app) but pointing to localhost:8080
    if (typeof window !== 'undefined') {
      const isProductionHost = window.location.hostname.includes('vercel.app') || 
                               (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
      const isPointsToLocalhost = url.includes('localhost') || url.includes('127.0.0.1');

      if (isProductionHost && isPointsToLocalhost) {
        setIsVercelWarning(true);
        setIsOpen(true);
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      setApiBaseUrl(inputUrl);
    }
  };

  const handleReset = () => {
    setApiBaseUrl('');
  };

  return (
    <div className="w-full bg-white border-b border-slate-200 shadow-sm transition-all duration-200">
      {isVercelWarning && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Production Warning:</strong> Your frontend on Vercel is trying to connect to <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-xs text-amber-900">localhost:8080</code>. Please enter your Render Backend API URL below to connect live.
            </span>
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs font-semibold text-amber-700 underline hover:text-amber-900 ml-2 shrink-0"
          >
            {isOpen ? 'Hide Config' : 'Configure Backend URL'}
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Server className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-medium text-slate-700">Backend API Target:</span>
          <code className="bg-slate-100 text-blue-600 px-2 py-0.5 rounded font-mono font-semibold text-xs border border-slate-200">
            {currentUrl}
          </code>
        </div>

        <div className="flex items-center gap-2">
          {!isOpen ? (
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              <Link2 className="w-3 h-3" />
              Change Backend URL
            </button>
          ) : (
            <form onSubmit={handleSave} className="flex items-center gap-2 flex-wrap">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://your-backend.onrender.com"
                className="px-3 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono w-64 text-slate-800"
              />
              <button
                type="submit"
                className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Check className="w-3 h-3" />
                Save & Connect
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 px-1"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

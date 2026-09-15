import { useState, useEffect } from 'react';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';

const SESSION_KEY = 'jail_user_session';
const SESSION_TIME_KEY = 'jail_user_session_time';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours session duration

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedUser = localStorage.getItem(SESSION_KEY);
    const savedTime = localStorage.getItem(SESSION_TIME_KEY);
    if (savedUser && savedTime) {
      const elapsed = Date.now() - parseInt(savedTime, 10);
      if (elapsed < SESSION_DURATION_MS) {
        return true;
      }
    }
    return false;
  });

  const [currentUser, setCurrentUser] = useState<string>(() => {
    const savedUser = localStorage.getItem(SESSION_KEY);
    return savedUser || '';
  });

  useEffect(() => {
    if (isAuthenticated) {
      const savedTime = localStorage.getItem(SESSION_TIME_KEY);
      if (savedTime) {
        const elapsed = Date.now() - parseInt(savedTime, 10);
        if (elapsed >= SESSION_DURATION_MS) {
          handleLogout();
        }
      }
    }
  }, [isAuthenticated]);

  const handleLogin = (username: string) => {
    const now = Date.now().toString();
    localStorage.setItem(SESSION_KEY, username);
    localStorage.setItem(SESSION_TIME_KEY, now);
    setIsAuthenticated(true);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_TIME_KEY);
    setIsAuthenticated(false);
    setCurrentUser('');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard currentUser={currentUser} onLogout={handleLogout} />;
};

export default Index;


import { useState } from 'react';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import Footer from '../components/Footer';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');

  const handleLogin = (username: string) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <Dashboard currentUser={currentUser} onLogout={handleLogout} />
      <Footer onLogout={handleLogout} />
    </>
  );
};

export default Index;

import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Splash } from './components/Splash';
import { AIChatBot } from './components/AIChatBot';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { UserDetail } from './pages/UserDetail';
import { ProfileCompletion } from './pages/ProfileCompletion';
import { Profile } from './pages/Profile';
import { Chat } from './pages/Chat';
import { Terms } from './pages/Terms';
import { Team } from './pages/Team';
import { DealHub } from './pages/DealHub';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLogin } from './pages/AdminLogin';
import { Settings } from './pages/Settings';
import { Notifications } from './pages/Notifications';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { NotFound } from './pages/NotFound';
import { AnimatePresence, motion } from 'framer-motion';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/signup?mode=login" />;
  return children;
};

// New component to handle smart home redirection
const SmartHome: React.FC = () => {
  const { user } = useAuth();
  if (user && user.onboardingStatus === 'COMPLETED') {
    return <Navigate to="/dashboard" replace />;
  }
  return <Home />;
};

const AppContent: React.FC = () => {
  const { loading } = useAuth();
  const [appReady, setAppReady] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setAppReady(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const isAdminPath = location.pathname.startsWith('/admin');
  const is404 = !['/', '/signup', '/terms', '/team', '/blog', '/dashboard', '/profile', '/settings', '/notifications', '/complete-profile', '/chat', '/admin', '/admin/dashboard'].some(path => location.pathname === path || location.pathname.startsWith('/blog/') || location.pathname.startsWith('/marketplace/') || location.pathname.startsWith('/deals/'));

  return (
    <>
      <AnimatePresence mode="wait">
        {!appReady && <Splash key="app-splash" />}
      </AnimatePresence>
      
      {appReady && !isAdminPath && !is404 && <AIChatBot />}
      
      <div className={`min-h-screen flex flex-col transition-opacity duration-1000 ${!appReady ? 'opacity-0' : 'opacity-100'}`}>
        {appReady && !isAdminPath && !is404 && <Navbar />}
        
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            {appReady && (
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageWrapper><SmartHome /></PageWrapper>} />
                <Route path="/signup" element={<PageWrapper><Auth /></PageWrapper>} />
                <Route path="/terms" element={<PageWrapper><Terms /></PageWrapper>} />
                <Route path="/team" element={<PageWrapper><Team /></PageWrapper>} />
                <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
                <Route path="/blog/:slug" element={<PageWrapper><BlogPost /></PageWrapper>} />
                
                <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
                <Route path="/marketplace/:userId" element={<ProtectedRoute><PageWrapper><UserDetail /></PageWrapper></ProtectedRoute>} />
                <Route path="/deals/:dealId" element={<ProtectedRoute><PageWrapper><DealHub /></PageWrapper></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><PageWrapper><Settings /></PageWrapper></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><PageWrapper><Notifications /></PageWrapper></ProtectedRoute>} />
                <Route path="/complete-profile" element={<ProtectedRoute><PageWrapper><ProfileCompletion /></PageWrapper></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><PageWrapper><Chat /></PageWrapper></ProtectedRoute>} />
                
                <Route path="/admin" element={<PageWrapper><AdminLogin /></PageWrapper>} />
                <Route path="/admin/dashboard" element={<ProtectedRoute><PageWrapper><AdminDashboard /></PageWrapper></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
          </AnimatePresence>
        </main>

        {appReady && !isAdminPath && !is404 && <Footer />}
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
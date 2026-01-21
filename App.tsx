
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Splash } from './components/Splash';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { ProfileCompletion } from './pages/ProfileCompletion';
import { Chat } from './pages/Chat';
import { Terms } from './pages/Terms';
import { AdminDashboard } from './pages/AdminDashboard';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <Splash />}
      <div className={`min-h-screen transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/terms" element={<Terms />} />
          
          <Route path="/dashboard" element={
            user?.role === 'Admin' ? <Navigate to="/admin" /> :
            user?.onboardingStatus === 'COMPLETED' ? <Dashboard /> : <Navigate to="/complete-profile" />
          } />
          
          <Route path="/complete-profile" element={
            user?.onboardingStatus === 'PROFILE_PENDING' ? <ProfileCompletion /> : 
            user?.onboardingStatus === 'COMPLETED' ? <Navigate to="/dashboard" /> :
            <Navigate to="/signup" />
          } />

          <Route path="/chat" element={user ? <Chat /> : <Navigate to="/signup" />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            user?.role === 'Admin' ? <AdminDashboard /> : <Navigate to="/" />
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        <footer className="py-20 border-t border-slate-100 dark:border-slate-800 mt-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="text-3xl font-black brand-font tracking-tighter bg-gradient-premium bg-clip-text text-transparent">
                COLLABSET
              </Link>
              <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium max-w-sm">
                India's elite marketplace for next-gen collaborations. Built for speed, trust, and creative growth.
              </p>
            </div>
            <div>
              <h4 className="font-black dark:text-white mb-6 uppercase text-xs tracking-widest">Platform</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-bold">
                <li><Link to="/signup" className="hover:text-purple-600">Join as Influencer</Link></li>
                <li><Link to="/signup?role=brand" className="hover:text-purple-600">Join as Brand</Link></li>
                <li><Link to="/dashboard" className="hover:text-purple-600">Browse Creators</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black dark:text-white mb-6 uppercase text-xs tracking-widest">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-bold">
                <li><Link to="/terms" className="hover:text-purple-600">Terms of Service</Link></li>
                <li><Link to="/terms" className="hover:text-purple-600">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-purple-600">Payment Safety</Link></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-slate-100 dark:border-slate-800 text-center flex flex-col items-center gap-2">
            <p className="text-slate-400 text-sm font-bold">&copy; 2024 COLLABSET. Made for Visionaries.</p>
            <Link to="/signup?mode=login" className="text-[10px] text-slate-600 dark:text-slate-500 hover:text-purple-600 font-bold">Admin Login (admin@collabset.com)</Link>
          </div>
        </footer>
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

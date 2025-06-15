import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from 'react-error-boundary';
import Index from './pages/Index';
import Upload from './pages/Upload';
import BattlePage from './pages/BattlePage';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EnhancedLogin from './pages/EnhancedLogin';
import Verify2FA from './pages/Verify2FA';
import ResetPassword from './pages/ResetPassword';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import Slumerican from './pages/Slumerican';
import Truth from './pages/Truth';
import KnightsDebate from './pages/KnightsDebate';
import NotFound from './pages/NotFound';
import LyraAssistant from './components/LyraAssistant';
import ContentAgents from './pages/ContentAgents';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-900 text-white">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/battle/:id" element={<BattlePage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/enhanced-login" element={<EnhancedLogin />} />
              <Route path="/verify-2fa" element={<Verify2FA />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="/slumerican" element={<Slumerican />} />
              <Route path="/truth" element={<Truth />} />
              <Route path="/knights-debate" element={<KnightsDebate />} />
              <Route path="/content-agents" element={<ContentAgents />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
          <LyraAssistant />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

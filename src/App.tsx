
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import LoginPage from "./pages/Login";
import EnhancedLoginPage from "./pages/EnhancedLogin";
import ResetPasswordPage from "./pages/ResetPassword";
import Verify2FAPage from "./pages/Verify2FA";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";
import ProfilePage from "./pages/Profile";
import BattlePage from "./pages/BattlePage";
import Leaderboard from "./pages/Leaderboard";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Slumerican from "./pages/Slumerican";
import Truth from "./pages/Truth";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import LyraAssistant from "./components/LyraAssistant";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/enhanced-login" element={<EnhancedLoginPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/verify-2fa" element={<Verify2FAPage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/battle/:id" element={<BattlePage />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/slumerican" element={<Slumerican />} />
              <Route path="/truth" element={<Truth />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <LyraAssistant />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

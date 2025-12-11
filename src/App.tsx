import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminRoute from "@/components/auth/AdminRoute";
import FloatingMessageButton from "@/components/chat/FloatingMessageButton";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const SubmitIdea = lazy(() => import("./pages/SubmitIdea"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const DigitalSolutions = lazy(() => import("./pages/DigitalSolutions"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const Careers = lazy(() => import("./pages/Careers"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Cookies = lazy(() => import("./pages/Cookies"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const BuyIdea = lazy(() => import("./pages/BuyIdea"));
const IdeaDetails = lazy(() => import("./pages/IdeaDetails"));
const Profile = lazy(() => import("./pages/Profile"));
const EnvTest = lazy(() => import("./pages/EnvTest"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const Messages = lazy(() => import("./pages/Messages"));

const queryClient = new QueryClient();

const ScrollToTopWrapper = () => {
  useScrollToTop();
  return null;
};

const AdminRedirect = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Paths that admin is allowed to visit without being redirected to /admin
  const allowedPaths = ['/buy/', '/submit-idea', '/demo/', '/profile'];

  if (!loading &&
    user?.email === 'idamarketplace@gmail.com' &&
    !location.pathname.startsWith('/admin') &&
    !allowedPaths.some(path => location.pathname.startsWith(path))) {
    return <Navigate to="/admin" replace />;
  }
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ChatProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <FloatingMessageButton />
              <ScrollToTopWrapper />
              <AdminRedirect />
              <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route
                    path="/submit-idea"
                    element={
                      <ProtectedRoute>
                        <SubmitIdea />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile/:userId"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/messages"
                    element={
                      <ProtectedRoute>
                        <Messages />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/digital-solutions" element={<DigitalSolutions />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/buy/:slug" element={<BuyIdea />} />
                  <Route path="/demo/:slug" element={<IdeaDetails />} />
                  <Route path="/env-test" element={<EnvTest />} />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </ChatProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useEffect } from "react";
import { trackPageView } from "./services/analyticsService";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GamePlay from "./pages/GamePlay";
import Options from "./pages/Options";
import Credits from "./pages/Credits";

const queryClient = new QueryClient();

// Analytics route tracking component
const AnalyticsRouteTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Track page view when location changes
    trackPageView(location.pathname);
  }, [location]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnalyticsRouteTracker />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/game" element={<GamePlay />} />
            <Route path="/options" element={<Options />} />
            <Route path="/credits" element={<Credits />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

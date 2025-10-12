import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AssetDetail from "./pages/AssetDetail";
import Settings from "./pages/Settings";
import AgentStatus from "./pages/AgentStatus";
import AgentDashboardPage from "./pages/AgentDashboardPage";
import Swap from "./pages/Swap";
import Stake from "./pages/Stake";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/asset/:symbol" element={<AssetDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/agent-status" element={<AgentStatus />} />
          <Route path="/agent-dashboard" element={<AgentDashboardPage />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/stake" element={<Stake />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

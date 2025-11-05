import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "@/hooks/useWeb3Provider";

const Index = lazy(() => import("./pages/Index"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AssetDetail = lazy(() => import("./pages/AssetDetail"));
const Settings = lazy(() => import("./pages/Settings"));
const AgentStatus = lazy(() => import("./pages/AgentStatus"));
const AgentDashboardPage = lazy(() => import("./pages/AgentDashboardPage"));
const Swap = lazy(() => import("./pages/Swap"));
const SwapSimple = lazy(() => import("./pages/SwapSimple"));
const SwapDebug = lazy(() => import("./pages/SwapDebug"));
const Stake = lazy(() => import("./pages/Stake"));
const StakeSimple = lazy(() => import("./pages/StakeSimple"));
const StakeDebug = lazy(() => import("./pages/StakeDebug"));
const StyleTest = lazy(() => import("./pages/StyleTest"));
const Web3Test = lazy(() => import("./pages/Web3Test"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Web3Provider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/asset/:symbol" element={<AssetDetail />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/agent-status" element={<AgentStatus />} />
              <Route path="/agent-dashboard" element={<AgentDashboardPage />} />
              <Route path="/swap" element={<SwapSimple />} />
              <Route path="/swap-original" element={<Swap />} />
              <Route path="/swap-debug" element={<SwapDebug />} />
              <Route path="/stake" element={<StakeSimple />} />
              <Route path="/stake-full" element={<Stake />} />
              <Route path="/stake-debug" element={<StakeDebug />} />
              <Route path="/style-test" element={<StyleTest />} />
              <Route path="/web3-test" element={<Web3Test />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </Web3Provider>
  </QueryClientProvider>
);

export default App;

import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";

const SwapDebug = () => {
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      console.log("SwapDebug component mounted");
      setLoaded(true);
    } catch (err) {
      console.error("Error in SwapDebug:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, []);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Swap Debug Page</h1>
        
        <div className="bg-card p-6 rounded-lg border border-border space-y-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${loaded ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span>Component Status: {loaded ? 'Loaded' : 'Loading...'}</span>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded p-4">
              <p className="text-red-400">Error: {error}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Debug Information</h2>
            <p>If you see this message, the basic routing is working.</p>
            <p>The issue is likely in the EnhancedSwapInterface component.</p>
          </div>
          
          <div className="bg-muted p-4 rounded">
            <h3 className="font-semibold mb-2">Next Steps:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Check browser console for JavaScript errors</li>
              <li>Verify all component dependencies are installed</li>
              <li>Check if services are initializing correctly</li>
              <li>Look for TypeScript compilation errors</li>
            </ol>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SwapDebug;

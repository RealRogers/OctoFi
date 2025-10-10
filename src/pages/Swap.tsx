import { Card, CardContent } from "@/components/ui/card";
import AppLayout from "@/components/AppLayout";

const Swap = () => {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-12 text-center">
            <h1 className="text-3xl font-black mb-4">Swap Tokens</h1>
            <p className="text-muted-foreground">Swap functionality coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Swap;

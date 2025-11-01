import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";

/**
 * Dashboard Simplificado para Debugging
 * Use esta versión si el Dashboard principal no carga
 */
const DashboardSimple = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Dashboard (Simple Mode)</h1>
        
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">✅ Dashboard Cargado Correctamente</h2>
            <p className="text-muted-foreground mb-4">
              Si ves este mensaje, el routing funciona correctamente.
              El problema está en algún componente del Dashboard principal.
            </p>
            <div className="space-y-2 text-sm">
              <p>✅ React Router: Funcionando</p>
              <p>✅ AppLayout: Funcionando</p>
              <p>✅ UI Components: Funcionando</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <h3 className="font-bold mb-2">Próximos Pasos:</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Revisa la consola del navegador (F12) para errores</li>
              <li>Verifica que todas las dependencias estén instaladas</li>
              <li>Intenta limpiar el caché: <code className="bg-muted px-2 py-1 rounded">rm -rf node_modules/.vite</code></li>
            </ol>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-primary to-accent"
          >
            Ir a Home
          </Button>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Recargar Página
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardSimple;

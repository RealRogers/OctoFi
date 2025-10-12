import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const StyleTest = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-black text-foreground">
          Test de Estilos
        </h1>
        
        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-card-foreground">
              Componente Card
            </h2>
            <p className="text-muted-foreground">
              Si ves este texto con estilos, Tailwind está funcionando correctamente.
            </p>
            
            <div className="flex gap-4">
              <Button className="bg-primary text-primary-foreground">
                Botón Primary
              </Button>
              <Button variant="secondary" className="bg-secondary text-secondary-foreground">
                Botón Secondary
              </Button>
              <Button variant="destructive">
                Botón Destructive
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-primary rounded-lg">
                <p className="text-primary-foreground font-semibold">Primary</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-secondary-foreground font-semibold">Secondary</p>
              </div>
              <div className="p-4 bg-accent rounded-lg">
                <p className="text-accent-foreground font-semibold">Accent</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground">
                Texto en fondo muted
              </p>
            </div>
            
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Gradiente de Texto
              </h3>
              <div className="h-32 bg-gradient-to-r from-primary via-accent to-secondary rounded-lg"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StyleTest;

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import AppLayout from "@/components/AppLayout";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(2);
  const totalSteps = 4;
  const [maxPerTransaction, setMaxPerTransaction] = useState([1000]);
  const [maxPerDay, setMaxPerDay] = useState([5000]);
  const [minToOperate, setMinToOperate] = useState([50]);

  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Progress Indicator */}
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="text-sm text-muted-foreground">Step {currentStep} de {totalSteps}</div>
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-8 md:p-12 space-y-12">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black">Límites de Operación</h1>
              <p className="text-muted-foreground">Estos límites protegen tu capital</p>
            </div>

            {/* Max Per Transaction */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-semibold">Máximo por transacción</label>
                <div className="px-4 py-2 rounded-lg bg-muted font-bold">
                  ${maxPerTransaction[0].toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">$100</span>
                <Slider
                  value={maxPerTransaction}
                  onValueChange={setMaxPerTransaction}
                  min={100}
                  max={10000}
                  step={100}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">$10,000</span>
              </div>
            </div>

            {/* Max Per Day */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-semibold">Máximo por día</label>
                <div className="px-4 py-2 rounded-lg bg-muted font-bold">
                  ${maxPerDay[0].toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">$500</span>
                <Slider
                  value={maxPerDay}
                  onValueChange={setMaxPerDay}
                  min={500}
                  max={50000}
                  step={500}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">$50,000</span>
              </div>
            </div>

            {/* Min To Operate */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-semibold">Mínimo para operar</label>
                <div className="px-4 py-2 rounded-lg bg-muted font-bold">
                  ${minToOperate[0].toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">$10</span>
                <Slider
                  value={minToOperate}
                  onValueChange={setMinToOperate}
                  min={10}
                  max={500}
                  step={10}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">$500</span>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Evita gas fees desproporcionados
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleBack}
              >
                Atrás
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-primary to-accent"
                onClick={handleNext}
              >
                Siguiente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Settings;

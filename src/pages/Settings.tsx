import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import AppLayout from "@/components/AppLayout";
import { useNavigate } from "react-router-dom";
import { Bell, Wallet, Shield, Zap } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // Step 1 - Basic Configuration
  const [name, setName] = useState("My Agent");
  const [riskLevel, setRiskLevel] = useState("medium");
  const [autoRebalance, setAutoRebalance] = useState(true);
  
  // Step 2 - Operation Limits
  const [maxPerTransaction, setMaxPerTransaction] = useState([1000]);
  const [maxPerDay, setMaxPerDay] = useState([5000]);
  const [minToOperate, setMinToOperate] = useState([50]);
  
  // Step 3 - Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [notifyOnTrade, setNotifyOnTrade] = useState(true);
  const [notifyOnDeposit, setNotifyOnDeposit] = useState(true);
  const [notifyOnWithdraw, setNotifyOnWithdraw] = useState(true);
  
  // Step 4 - Strategy
  const [strategy, setStrategy] = useState("balanced");
  const [rebalanceFrequency, setRebalanceFrequency] = useState("weekly");
  const [focusAssets, setFocusAssets] = useState(["ETH", "BTC"]);

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
            <div className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</div>
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
            {/* Step 1: Basic Configuration */}
            {currentStep === 1 && (
              <>
                <div className="text-center space-y-2">
                  <h1 className="text-4xl font-black">Basic Configuration</h1>
                  <p className="text-muted-foreground">Customize your investment agent</p>
                </div>
                
                <div className="space-y-8">
                  {/* Agent Name */}
                  <div className="space-y-4">
                    <Label htmlFor="agent-name" className="font-semibold">Your agent's name</Label>
                    <Input 
                      id="agent-name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="My Smart Agent" 
                      className="bg-muted/50"
                    />
                  </div>
                  
                  {/* Risk Level */}
                  <div className="space-y-4">
                    <Label className="font-semibold">Risk level</Label>
                    <RadioGroup value={riskLevel} onValueChange={setRiskLevel} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="risk-low" />
                        <Label htmlFor="risk-low">Low</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="risk-medium" />
                        <Label htmlFor="risk-medium">Medium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high" id="risk-high" />
                        <Label htmlFor="risk-high">High</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Auto-rebalancing */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="font-semibold">Auto-rebalancing</Label>
                      <p className="text-sm text-muted-foreground">Keep your portfolio optimized automatically</p>
                    </div>
                    <Switch checked={autoRebalance} onCheckedChange={setAutoRebalance} />
                  </div>
                </div>
              </>
            )}
            
            {/* Step 2: Operation Limits */}
            {currentStep === 2 && (
              <>
                <div className="text-center space-y-2">
                  <h1 className="text-4xl font-black">Operation Limits</h1>
                  <p className="text-muted-foreground">These limits protect your capital</p>
                </div>

                {/* Max Per Transaction */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold">Maximum per transaction</label>
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
                    <label className="font-semibold">Maximum per day</label>
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
                    <label className="font-semibold">Minimum to operate</label>
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
                    Avoid disproportionate gas fees
                  </p>
                </div>
              </>
            )}
            
            {/* Step 3: Notifications */}
            {currentStep === 3 && (
              <>
                <div className="text-center space-y-2">
                  <h1 className="text-4xl font-black">Notifications</h1>
                  <p className="text-muted-foreground">Stay informed about your investments</p>
                </div>
                
                <div className="space-y-8">
                  {/* Notification Channels */}
                  <div className="space-y-4">
                    <Label className="font-semibold">Notification channels</Label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-5 w-5 text-muted-foreground" />
                          <span>Email notifications</span>
                        </div>
                        <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-5 w-5 text-muted-foreground" />
                          <span>Push notifications</span>
                        </div>
                        <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Events to Notify */}
                  <div className="space-y-4">
                    <Label className="font-semibold">Notify me when</Label>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="notify-trade" checked={notifyOnTrade} onCheckedChange={setNotifyOnTrade} />
                        <label htmlFor="notify-trade" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          A trade is executed
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="notify-deposit" checked={notifyOnDeposit} onCheckedChange={setNotifyOnDeposit} />
                        <label htmlFor="notify-deposit" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          A deposit is made
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="notify-withdraw" checked={notifyOnWithdraw} onCheckedChange={setNotifyOnWithdraw} />
                        <label htmlFor="notify-withdraw" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          A withdrawal is made
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Step 4: Strategy */}
            {currentStep === 4 && (
              <>
                <div className="text-center space-y-2">
                  <h1 className="text-4xl font-black">Strategy</h1>
                  <p className="text-muted-foreground">Define how your agent will operate</p>
                </div>
                
                <div className="space-y-8">
                  {/* Investment Strategy */}
                  <div className="space-y-4">
                    <Label className="font-semibold">Investment strategy</Label>
                    <Select value={strategy} onValueChange={setStrategy}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="growth">Growth</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Rebalancing Frequency */}
                  <div className="space-y-4">
                    <Label className="font-semibold">Rebalancing frequency</Label>
                    <Select value={rebalanceFrequency} onValueChange={setRebalanceFrequency}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Preferred Assets */}
                  <div className="space-y-4">
                    <Label className="font-semibold">Preferred assets</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="asset-btc" checked={focusAssets.includes("BTC")} 
                          onCheckedChange={(checked) => {
                            if (checked) setFocusAssets([...focusAssets, "BTC"]);
                            else setFocusAssets(focusAssets.filter(a => a !== "BTC"));
                          }} 
                        />
                        <label htmlFor="asset-btc" className="text-sm font-medium">Bitcoin (BTC)</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="asset-eth" checked={focusAssets.includes("ETH")} 
                          onCheckedChange={(checked) => {
                            if (checked) setFocusAssets([...focusAssets, "ETH"]);
                            else setFocusAssets(focusAssets.filter(a => a !== "ETH"));
                          }} 
                        />
                        <label htmlFor="asset-eth" className="text-sm font-medium">Ethereum (ETH)</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="asset-sol" checked={focusAssets.includes("SOL")} 
                          onCheckedChange={(checked) => {
                            if (checked) setFocusAssets([...focusAssets, "SOL"]);
                            else setFocusAssets(focusAssets.filter(a => a !== "SOL"));
                          }} 
                        />
                        <label htmlFor="asset-sol" className="text-sm font-medium">Solana (SOL)</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="asset-bnb" checked={focusAssets.includes("BNB")} 
                          onCheckedChange={(checked) => {
                            if (checked) setFocusAssets([...focusAssets, "BNB"]);
                            else setFocusAssets(focusAssets.filter(a => a !== "BNB"));
                          }} 
                        />
                        <label htmlFor="asset-bnb" className="text-sm font-medium">Binance Coin (BNB)</label>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleBack}
              >
                {currentStep === 1 ? "Cancel" : "Back"}
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-primary to-accent"
                onClick={handleNext}
              >
                {currentStep === totalSteps ? "Finish" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Settings;

import { ArrowUpDown, ChevronDown, Coins } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const swapSchema = z.object({
  fromAmount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Enter a valid amount",
  }),
  toAmount: z.string(),
});

type SwapFormValues = z.infer<typeof swapSchema>;

interface SwapInterfaceProps {
  /** Optional class name for custom styling. */
  className?: string;
}

/**
 * Renders the main user interface for token swapping.
 * It includes form handling for "from" and "to" amounts, simulated price calculation,
 * and input validation using Zod and React Hook Form.
 *
 * @param {SwapInterfaceProps} props - The component props.
 * @returns {JSX.Element} The rendered swap interface component.
 */
const SwapInterface: React.FC<SwapInterfaceProps> = ({ className }) => {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<SwapFormValues>({
    resolver: zodResolver(swapSchema),
    defaultValues: {
      fromAmount: "",
      toAmount: "0.0",
    },
  });

  const fromAmount = watch("fromAmount");
  const toAmount = watch("toAmount");

  /**
   * Handles form submission. Logs the validated data to the console.
   * In a real application, this would trigger the swap transaction.
   * @param {SwapFormValues} data - The validated form data.
   */
  const onSubmit = (data: SwapFormValues) => {
    console.log("Swap submitted with data:", data);
  };

  /**
   * Handles changes to the "from" amount input field.
   * It validates the input to allow only numeric values and updates the "to" amount
   * based on a simulated exchange rate.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setValue("fromAmount", value, { shouldValidate: true });
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        setValue("toAmount", (numericValue * 1.5).toFixed(2));
      } else {
        setValue("toAmount", "0.0");
      }
    }
  };

  const handleSwapDirection = () => {
    // Swap direction logic (future implementation)
    console.log("Swap direction clicked");
  };

  const handleMaxClick = () => {
    // Set to max balance (future implementation)
    console.log("MAX button clicked");
  };

  const handleTokenSelect = (type: "from" | "to") => {
    // Token selection logic (future implementation)
    console.log(`Token selector clicked: ${type}`);
  };

  return (
    <div className={className}>
      {/* Title Section */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white">Swap</h1>
      </div>

      {/* Main Card Container */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-6 max-w-md mx-auto w-full">
        {/* From Section - "Desde (Pagas)" */}
        <div className="space-y-2">
          {/* Label */}
          <label className="text-sm text-gray-400">Desde (Pagas)</label>
          
          {/* Input Container */}
          <div className="bg-gray-950 rounded-xl p-4">
            {/* Input Row */}
            <div className="flex justify-between items-center mb-2">
              {/* Amount Input */}
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.0"
                className="bg-transparent text-3xl sm:text-4xl font-bold text-white outline-none w-full placeholder:text-gray-700 focus:ring-0"
                aria-label="Amount to pay"
                {...register("fromAmount", { onChange: handleFromAmountChange })}
              />
              
              {/* Token Selector */}
              <button 
                onClick={() => handleTokenSelect("from")}
                className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-2 hover:bg-gray-700 transition-colors cursor-pointer flex-shrink-0 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950"
                aria-label="Select token to pay"
              >
                <div className="flex items-center">
                  {/* First token icon - B */}
                  <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                    B
                  </div>
                  {/* Second token icon - E (overlapping) */}
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold -ml-2 border-2 border-gray-800">
                    E
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            {/* USD Value & Error Message */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">$0.00</div>
              {errors.fromAmount && (
                <span className="text-sm text-red-500">{errors.fromAmount.message}</span>
              )}
            </div>
          </div>
          
          {/* Balance Footer */}
          <div className="flex justify-end items-center gap-2">
            <span className="text-sm text-gray-400">Balance: 0.0</span>
            <button 
              onClick={handleMaxClick}
              className="text-sm text-blue-500 font-semibold hover:text-blue-400 transition-colors cursor-pointer min-h-[44px] px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Set maximum amount"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="relative flex justify-center -my-2 z-10">
          <button 
            onClick={handleSwapDirection}
            className="bg-gray-900 border border-gray-800 rounded-full p-3 hover:bg-gray-800 transition-colors cursor-pointer min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background"
            aria-label="Swap direction"
          >
            <ArrowUpDown className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* To Section - "Hasta (Recibes)" */}
        <div className="space-y-2">
          {/* Label */}
          <label className="text-sm text-gray-400">Hasta (Recibes)</label>
          
          {/* Output Container */}
          <div className="bg-gray-950 rounded-xl p-4">
            {/* Output Row */}
            <div className="flex justify-between items-center mb-2">
              {/* Amount Display (non-editable) */}
              <div className="text-3xl sm:text-4xl font-bold text-white" aria-live="polite" aria-atomic="true">
                {toAmount}
              </div>
              
              {/* Token Selector */}
              <button 
                onClick={() => handleTokenSelect("to")}
                className="flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2 hover:bg-gray-700 transition-colors cursor-pointer flex-shrink-0 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950"
                aria-label="Select token to receive"
              >
                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                  <Coins className="w-4 h-4 text-gray-400" />
                </div>
                <span className="text-sm text-gray-300">Seleccionar token</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            {/* USD Value */}
            <div className="text-sm text-gray-500">$0.00</div>
          </div>
        </div>

        {/* Transaction Details Section */}
        <div className="space-y-2 py-4">
          {/* Exchange Rate */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Tasa</span>
            <span className="text-white">1 ETH = 3,000 USDT</span>
          </div>
          
          {/* Price Impact */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Impacto en el precio</span>
            <span className="text-green-500">&lt;0.01%</span>
          </div>
          
          {/* Network Fee */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Tarifa de la red</span>
            <span className="text-white">~$5.42</span>
          </div>
        </div>

        {/* Swap Action Button */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity cursor-pointer min-h-[44px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Execute swap"
          >
            Swap
          </button>
        </form>
      </div>
    </div>
  );
};

export default SwapInterface;

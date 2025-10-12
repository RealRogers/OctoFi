import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PredictionRow from "@/components/molecules/PredictionRow";

const AIPredictionGrid = () => {
  const predictions = [
    {
      iconUrl: "/placeholder.svg",
      assetName: "Ethereum",
      assetSymbol: "ETH",
      price: "$3,540.12",
      sparklineData: [3400, 3450, 3420, 3480, 3540, 3520, 3540],
      trend: 'bearish' as const,
      confidenceLevel: 'Media' as const,
      confidenceValue: 65,
      signal: 'MANTENER' as const
    },
    {
      iconUrl: "/placeholder.svg",
      assetName: "USD Coin",
      assetSymbol: "USDC",
      price: "$1.00",
      sparklineData: [0.998, 1.001, 0.999, 1.002, 1.000, 1.001, 1.000],
      trend: 'bullish' as const,
      confidenceLevel: 'Alta' as const,
      confidenceValue: 92,
      signal: 'ACUMULAR' as const
    },
    {
      iconUrl: "/placeholder.svg",
      assetName: "Aave",
      assetSymbol: "AAVE",
      price: "$91.50",
      sparklineData: [95, 93, 89, 87, 90, 92, 91.5],
      trend: 'bearish' as const,
      confidenceLevel: 'Baja' as const,
      confidenceValue: 35,
      signal: 'REDUCIR' as const
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Real-Time AI Analysis</h2>
      
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 bg-gray-950/50">
              <TableHead className="text-gray-400 font-medium">Asset</TableHead>
              <TableHead className="text-gray-400 font-medium">Current Price</TableHead>
              <TableHead className="text-gray-400 font-medium">Predicted Trend (24h)</TableHead>
              <TableHead className="text-gray-400 font-medium">AI Confidence</TableHead>
              <TableHead className="text-gray-400 font-medium">Agent Signal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {predictions.map((prediction, index) => (
              <PredictionRow
                key={index}
                {...prediction}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AIPredictionGrid;
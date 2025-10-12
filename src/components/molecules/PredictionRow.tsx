import { TableCell, TableRow } from "@/components/ui/table";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import ProgressBar from "@/components/atoms/ProgressBar";
import SignalBadge from "@/components/atoms/SignalBadge";

interface PredictionRowProps {
  iconUrl: string;
  assetName: string;
  assetSymbol: string;
  price: string;
  sparklineData: number[];
  trend: 'bullish' | 'bearish' | 'neutral';
  confidenceLevel: 'Alta' | 'Media' | 'Baja';
  confidenceValue: number;
  signal: 'ACUMULAR' | 'MANTENER' | 'REDUCIR';
}

const PredictionRow = ({
  iconUrl,
  assetName,
  assetSymbol,
  price,
  sparklineData,
  trend,
  confidenceLevel,
  confidenceValue,
  signal
}: PredictionRowProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'bullish':
        return '#10b981'; // green-500
      case 'bearish':
        return '#ef4444'; // red-500
      case 'neutral':
        return '#6b7280'; // gray-500
      default:
        return '#6b7280';
    }
  };

  const chartData = sparklineData.map((value, index) => ({
    index,
    value
  }));

  return (
    <TableRow className="border-gray-800 hover:bg-gray-800/50">
      <TableCell className="py-4">
        <div className="flex items-center gap-3">
          <img 
            src={iconUrl} 
            alt={assetName}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div className="font-medium text-white">{assetName}</div>
            <div className="text-sm text-gray-400">{assetSymbol}</div>
          </div>
        </div>
      </TableCell>
      
      <TableCell className="py-4">
        <span className="font-medium text-white">{price}</span>
      </TableCell>
      
      <TableCell className="py-4">
        <div className="w-[120px] h-[40px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={getTrendColor()}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TableCell>
      
      <TableCell className="py-4">
        <ProgressBar value={confidenceValue} level={confidenceLevel} />
      </TableCell>
      
      <TableCell className="py-4">
        <SignalBadge signal={signal} />
      </TableCell>
    </TableRow>
  );
};

export default PredictionRow;
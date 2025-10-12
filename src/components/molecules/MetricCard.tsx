import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  subtext: string;
  valueColor?: 'green' | 'blue' | 'default';
}

const MetricCard = ({ title, value, subtext, valueColor = 'default' }: MetricCardProps) => {
  const getValueColorClass = () => {
    switch (valueColor) {
      case 'green':
        return 'text-green-400';
      case 'blue':
        return 'text-blue-400';
      default:
        return 'text-white';
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="space-y-2">
          <p className="text-sm text-gray-400">{title}</p>
          <p className={`text-2xl font-bold ${getValueColorClass()}`}>
            {value}
          </p>
          <p className="text-sm text-gray-400">{subtext}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
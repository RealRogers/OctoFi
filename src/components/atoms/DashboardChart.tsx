import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const chartData = [
  { time: "7d ago", value: 11500 },
  { time: "6d ago", value: 12200 },
  { time: "5d ago", value: 11800 },
  { time: "4d ago", value: 12800 },
  { time: "3d ago", value: 12100 },
  { time: "Yesterday", value: 13200 },
  { time: "Today", value: 12345 },
];

const DashboardChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="time" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px"
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--primary))"
          strokeWidth={3}
          fill="url(#colorValue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default DashboardChart;

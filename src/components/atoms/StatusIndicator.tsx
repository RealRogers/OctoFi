interface StatusIndicatorProps {
  isActive: boolean;
}

const StatusIndicator = ({ isActive }: StatusIndicatorProps) => {
  return (
    <div 
      className={`w-4 h-4 rounded-full ${
        isActive 
          ? 'bg-green-500 shadow-lg shadow-green-500/50' 
          : 'bg-gray-500'
      }`}
    />
  );
};

export default StatusIndicator;
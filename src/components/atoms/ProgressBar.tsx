interface ProgressBarProps {
  value: number; // 0-100
  level: 'Alta' | 'Media' | 'Baja';
}

const ProgressBar = ({ value, level }: ProgressBarProps) => {
  const getColorClasses = () => {
    switch (level) {
      case 'Alta':
        return 'bg-green-500';
      case 'Media':
        return 'bg-yellow-500';
      case 'Baja':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${getColorClasses()}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-gray-300">
        {level} ({value}%)
      </span>
    </div>
  );
};

export default ProgressBar;
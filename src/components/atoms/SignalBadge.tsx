interface SignalBadgeProps {
  signal: 'ACUMULAR' | 'MANTENER' | 'REDUCIR';
}

const SignalBadge = ({ signal }: SignalBadgeProps) => {
  const getColorClasses = () => {
    switch (signal) {
      case 'ACUMULAR':
        return 'bg-green-600 text-green-100';
      case 'MANTENER':
        return 'bg-yellow-600 text-yellow-100';
      case 'REDUCIR':
        return 'bg-red-600 text-red-100';
      default:
        return 'bg-gray-600 text-gray-100';
    }
  };

  return (
    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getColorClasses()}`}>
      {signal}
    </div>
  );
};

export default SignalBadge;
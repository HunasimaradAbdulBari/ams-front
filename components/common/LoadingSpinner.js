const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: { width: '16px', height: '16px' },
    medium: { width: '24px', height: '24px' },
    large: { width: '32px', height: '32px' }
  };

  return (
    <div 
      className="loading-spinner"
      style={sizeClasses[size]}
    />
  );
};

export default LoadingSpinner;

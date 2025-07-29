import { useEffect, useRef } from 'react';

const ProgressBar = ({ percentage, color = '#22c55e', title = 'Progress' }) => {
  const progressRef = useRef(null);
  const barInstance = useRef(null);

  useEffect(() => {
    if (progressRef.current && window.ProgressBar) {
      barInstance.current = new window.ProgressBar.Circle(progressRef.current, {
        color: color,
        strokeWidth: 6,
        trailWidth: 6,
        trailColor: '#f1f5f9',
        easing: 'easeInOut',
        duration: 1400,
        text: {
          autoStyleContainer: false
        },
        from: { color: color, width: 6 },
        to: { color: color, width: 6 },
        step: function(state, circle) {
          circle.path.setAttribute('stroke', state.color);
          circle.path.setAttribute('stroke-width', state.width);

          const value = Math.round(circle.value() * 100);
          if (value === 0) {
            circle.setText('');
          } else {
            circle.setText(`${value}%`);
          }
        }
      });

      barInstance.current.animate(percentage / 100);
    }

    return () => {
      barInstance.current?.destroy();
    };
  }, [percentage, color]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: '1rem', color: '#1e293b' }}>{title}</h4>
      <div 
        ref={progressRef} 
        style={{ 
          width: '120px', 
          height: '120px',
          margin: '0 auto',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#1e293b'
        }} 
      />
    </div>
  );
};

export default ProgressBar;

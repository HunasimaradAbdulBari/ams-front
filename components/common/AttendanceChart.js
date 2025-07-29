import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const AttendanceChart = ({ data, title = 'Attendance Overview' }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current && data) {
      // Initialize chart
      chartInstance.current = echarts.init(chartRef.current);

      const option = {
        title: {
          text: title,
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: 10,
          data: ['Present', 'Absent']
        },
        series: [
          {
            name: 'Attendance',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '50%'],
            data: [
              { 
                value: data.present, 
                name: 'Present',
                itemStyle: { color: '#22c55e' }
              },
              { 
                value: data.absent, 
                name: 'Absent',
                itemStyle: { color: '#ef4444' }
              }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      chartInstance.current.setOption(option);

      // Handle resize
      const handleResize = () => {
        chartInstance.current?.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.current?.dispose();
      };
    }
  }, [data, title]);

  return (
    <div 
      ref={chartRef} 
      style={{ 
        width: '100%', 
        height: '300px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '1rem'
      }} 
    />
  );
};

export default AttendanceChart;

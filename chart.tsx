// frontend/src/components/chart.tsx
import React, { useEffect, useRef } from 'react';
import { Chart, registerables, CategoryScale, ChartConfiguration } from 'chart.js';

Chart.register(...registerables, CategoryScale);

interface ChartComponentProps {
  config: ChartConfiguration;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ config }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstanceRef.current = new Chart(ctx, config);
      }
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [config]);

  return <canvas ref={chartRef}></canvas>;
};

export default ChartComponent;

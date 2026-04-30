import { useEffect, useRef, useState } from "react";
import { Chart, type ChartData } from "chart.js/auto";

interface DoughnutChartProps {
  amount: number,
  category: string,
  percentage: string
}

export function DoughnutChart( {dataSet}: {dataSet: DoughnutChartProps[]}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<"doughnut"> | null>(null);

  type DoughnutData = ChartData<'doughnut', number[], string>;
  const [data, setData] = useState<DoughnutData>({
    labels: [],
    datasets: [{
      data: [],
      label: 'Gastaste %',
      backgroundColor: [
        '#A8E6CF','#DCEDC1','#FFD3B6','#FFAAA5','#FF8B94',
        '#D5AAFF','#B5EAD7','#C7CEEA','#FFF5BA','#FEC8D8'
      ],
      hoverOffset: 4
    }]
  });

  // 1) Transformar props -> state cuando cambie dataSet
  useEffect(() => {
    if (!dataSet || dataSet.length === 0) return;

    const labels = dataSet.map(e => e.category);
    const perc = dataSet.map(e => Number(Number(e.percentage).toFixed(2)));

    setData((prev) => {
      
      const next: DoughnutData = {
        labels,
        datasets: [{ ...prev.datasets[0], data: perc }]
      };

      const sameLabels =
        (prev.labels?.length === next.labels?.length) &&
        (prev.labels ?? []).every((x, i) => x === (next.labels ?? [])[i]);

      const prevData = prev.datasets[0]?.data ?? [];
      const nextData = next.datasets[0]?.data ?? [];
      const sameData =
        prevData.length === nextData.length &&
        prevData.every((x, i) => x === nextData[i]);

      return sameLabels && sameData ? prev : next;
    });
  }, [dataSet]);

  // 2) Crear/actualizar el Chart cuando cambie `data`
  useEffect(() => {
    if(!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (!chartRef.current) {
      chartRef.current = new Chart(ctx, {
        type: 'doughnut',
        data,
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: false }
          }
        }
      });
    } else {
      // actualizar sin destruir
      chartRef.current.data = data;
      chartRef.current.update();
    }

    // cleanup al desmontar
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [data]);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
}

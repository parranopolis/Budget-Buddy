import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

export default function ChartActivity (){
    const canvasRef = useRef(null)
    const chartRef = useRef(null)

    // demo data 
    const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;                      // canvas not ready yet

    // destroy any previous instance tied to this canvas
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map(r => r.year),
        datasets: [
          {
            label: "Acquisitions by year",
            data: data.map(r => r.count),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data]); // re-create chart if data changes

  return (
    <>
      {/* avoid using a static id; rely on ref */}
      <div className=""> 
        <canvas ref={canvasRef} />
      </div>
    </>
  );
}
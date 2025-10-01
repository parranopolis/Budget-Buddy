import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import PropTypes from 'prop-types'

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

DoughnutChart.propTypes = {
  dataSet: PropTypes.array
}

export function DoughnutChart({dataSet}){
	// console.log(dataSet)
	const canvasRef = useRef(null)
	const chartRef = useRef(null)
	const expenses =[
		{
			category: "General", // nombre del label
			amount: 107.2, // dato del label
			percentage: 8.5
		},
		{
			category: "Food",
			amount: 55.2,
			percentage: 4.4
		},
		{
			category: "Other",
			amount: 735.5,
			percentage: 58.6
		},
		{
			category: "Gas",
			amount: 130,
			percentage: 10.3
		},
		{
			category: "Necessary",
			amount: 128.22,
			percentage: 10.2
		},
		{
			category: "Necesary",
			amount: 100,
			percentage: 8.0
		}
	]
	// const expenses2 = [
	// 	{
	// 		id: '1',
	// 		field: 'General',
	// 		amount: 2,
	// 	},
	// 	{
	// 		id: '2',
	// 		field: 'Comida',
	// 		amount: 8,
	// 	},
	// 	{
	// 		id: '3',
	// 		field: 'General',
	// 		amount: 10,
	// 	},
	// ];
	// const DATA_COUNT = 10;
	// const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};
const [data,setData] = useState({
		labels: [],
		datasets: [{
			data: [], // datos que se agregaran
			label: 'Gastaste %', // nombre del dataSet -> nombre que se muestra cuando se hace click en la parte del circulo
			backgroundColor: [ // colores que representan cada categoria
				'#A8E6CF', // Verde pastel (ahorros)
				'#DCEDC1', // Verde claro pastel (supermercado)
				'#FFD3B6', // Naranja suave pastel (comida afuera)
				'#FFAAA5', // Rojo coral pastel (entretenimiento)
				'#FF8B94', // Rosado pastel (salud)
				'#D5AAFF', // Violeta pastel (suscripciones)
				'#B5EAD7', // Turquesa pastel (transporte)
				'#C7CEEA', // Azul lavanda pastel (vivienda)
				'#FFF5BA', // Amarillo pastel (servicios)
				'#FEC8D8'  // Rosa suave pastel (otros)
			],
			hoverOffset: 4
		}]
	})
  	useEffect(()=>{
		  let perc = []
		  let cat = []
		  let amount = []
        if (!dataSet || dataSet.length === 0) return; // corta aquí si aún no hay datos
		 dataSet.forEach(e => {
    cat.push(e.category);
    amount.push(e.amount);
    perc.push(e.percentage).toFixed(2);
  });
	// 	setData(prevStatus => ({
	// 	...prevStatus,
	// 	labels : [cat]
	// }))
	// actualizar estado SOLO si cambió realmente
  setData(prev => {
    const next = {
      labels: cat,                  // <-- no [cat]
      datasets: [{ ...prev.datasets[0], data :perc }]
    };
    // comparación simple para evitar renders innecesarios
    const sameLabels =
      prev.labels.length === next.labels.length &&
      prev.labels.every((x, i) => x === next.labels[i]);
    const sameData =
      prev.datasets[0].data.length === next.datasets[0].data.length &&
      prev.datasets[0].data.every((x, i) => x === next.datasets[0].data[i]);

    return sameLabels && sameData ? prev : next;
  });
		const ctx = canvasRef.current?.getContext("2d");
		if (!ctx) return;                      // canvas not ready yet
		// destroy any previous instance tied to this canvas
		if (chartRef.current) {
			chartRef.current.destroy();
			chartRef.current = null;
		}
		chartRef.current = new Chart(ctx, {
			type: 'doughnut',
			data: data,
			options: {
				responsive: true,
				plugins: {
				legend: {
					position: 'top',
				},	
				title: {
					display: false,
					// text: 'what you have spent in this period'
				}
			}
		}
		})
	},[expenses])
	return(
		<>
			<div className=""> 
				<canvas ref={canvasRef} />
			</div>
		</>
  )
}
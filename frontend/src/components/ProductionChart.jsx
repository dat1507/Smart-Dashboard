import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ProductionChart = ({ chartData }) => {
    const data = {
        labels: chartData.map(d => d.Timestamp.split(' ')[1].substring(0, 5)),
        datasets: [{
            label: 'Production',
            data: chartData.map(d => d.Output),
            borderColor: '#0f172a', 
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(15, 23, 42, 0.05)',
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#0f172a',
            pointHoverBackgroundColor: '#0f172a',
            pointHoverBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
        }]
    };

    const options = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#0f172a',
                bodyColor: '#334155',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                boxPadding: 4,
                usePointStyle: true,
                titleFont: { size: 13, family: "'Inter', sans-serif" },
                bodyFont: { size: 14, family: "'Inter', sans-serif", weight: 'bold' },
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#64748b',
                    font: { family: "'Inter', sans-serif" }
                }
            },
            y: {
                grid: {
                    color: '#f1f5f9',
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: '#64748b',
                    font: { family: "'Inter', sans-serif" }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    };

    return (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 p-6 md:p-8 mt-8 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-shadow duration-300">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                <span className="w-2 h-6 bg-slate-800 rounded-full mr-3 inline-block"></span>
                Real-time Production Chart
            </h3>
            <div className="h-[300px]">
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default ProductionChart;
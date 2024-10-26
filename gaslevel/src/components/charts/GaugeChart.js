import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const GaugeChart = ({ value, maxValue }) => {
    const data = {
        datasets: [
            {
                data: [value, maxValue - value], // Represents the filled and unfilled portions
                backgroundColor: ['#36A2EB', '#E5E5E5'], // Colors for gas level chart
                borderWidth: 0,
                cutout: '75%', // Makes the chart look like a gauge
            },
        ],
    };

    const options = {
        rotation: -90, // Start at the top
        circumference: 180, // Show only half the doughnut (gauge)
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return (
        <div style={{ width: '250px', height: '250px' }}>
            <Doughnut data={data} options={options} />
            <div style={{ textAlign: 'center', marginTop: '-50px', fontSize: '20px' }}>
                ({value} / {maxValue}) {/* Corrected template literal syntax */}
            </div>
        </div>
    );
};

export default GaugeChart;
// Data for the cost chart
const costData = {
    labels: ['Mar 1', 'Mar 2', 'Mar 3', 'Mar 4', 'Mar 5', 'Mar 6', 'Mar 7', 'Mar 8', 'Mar 9', 'Mar 10', 'Mar 11'],
    datasets: [
        {
            label: 'Gas',
            data: [3, 5, 8, 3, 5, 4, 3, 5, 8, 3, 4],
            backgroundColor: '#93c5fd',
            stack: 'Stack 0',
        },
        {
            label: 'Electricity',
            data: [4, 3, 5, 4, 6, 5, 4, 3, 4, 4, 7],
            backgroundColor: '#6b46c1',
            stack: 'Stack 0',
        }
    ]
};

// Data for the usage estimate chart
const usageData = {
    labels: ['Mar 1', 'Mar 2', 'Mar 3', 'Mar 4'],
    datasets: [{
        label: 'Usage',
        data: [150, 170, 190, 218],
        borderColor: '#f87171',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        tension: 0.4,
        fill: true
    }]
};

// Appliances data
const appliances = [
    { name: 'Heating', usage: '1.4 kWh', percentage: 70 },
    { name: 'EV Charge', usage: '0.9 kWh', percentage: 45 },
    { name: 'Plug Loads', usage: '0.8 kWh', percentage: 40 },
    { name: 'Lighting', usage: '0.7 kWh', percentage: 35 },
    { name: 'Others', usage: '0.4 kWh', percentage: 20 }
];

// Initialize charts when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the cost chart
    const costChart = new Chart(document.getElementById('costChart'), {
        type: 'bar',
        data: costData,
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: {
                        callback: value => '$' + value
                    },
                    grid: {
                        borderDash: [2, 4]
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Initialize the usage estimate chart
    const usageChart = new Chart(document.getElementById('usageChart'), {
        type: 'line',
        data: usageData,
        options: {
            responsive: true,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        borderDash: [2, 4]
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Populate appliances list
    const appliancesList = document.querySelector('.appliance-list');
    appliancesList.innerHTML = appliances.map(appliance => `
        <div class="appliance-item">
            <span>${appliance.name}</span>
            <div class="progress-bar">
                <div class="progress" style="width: ${appliance.percentage}%"></div>
            </div>
            <span>${appliance.usage}</span>
        </div>
    `).join('');
}); 
// Initialize chart when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeConsumptionChart();
});

// Initialize consumption comparison chart
function initializeConsumptionChart() {
    const ctx = document.getElementById('consumptionChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Your Consumption',
                    data: [280, 290, 270, 250, 260, 250],
                    backgroundColor: '#7e57c2',
                    borderRadius: 6
                },
                {
                    label: 'Group Average',
                    data: [300, 310, 290, 280, 290, 280],
                    backgroundColor: '#e2e8f0',
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + ' kWh';
                        }
                    }
                }
            }
        }
    });
} 
// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    setupTimeRangeSelector();
});

// Initialize both charts
function initializeCharts() {
    const consumptionCtx = document.getElementById('consumptionChart').getContext('2d');
    const savingsCtx = document.getElementById('savingsChart').getContext('2d');
    const consumptionTrendCtx = document.getElementById('consumptionTrendChart').getContext('2d');

    // Usage History Chart
    new Chart(consumptionCtx, {
        type: 'line',
        data: {
            labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
            datasets: [{
                label: 'Konsumsi Energi (kWh)',
                data: [120, 135, 128, 115],
                borderColor: '#7e57c2',
                backgroundColor: 'rgba(126, 87, 194, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
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

    // Savings Trend Chart
    new Chart(savingsCtx, {
        type: 'bar',
        data: {
            labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
            datasets: [{
                label: 'Penghematan (Rp)',
                data: [15000, 20000, 18000, 25000],
                backgroundColor: '#10b981',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Rp ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });

    // Consumption Trend Chart
    new Chart(consumptionTrendCtx, {
        type: 'bar',
        data: {
            labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
            datasets: [{
                label: 'Konsumsi (kWh)',
                data: [350, 420, 380, 300],
                backgroundColor: '#ef4444',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
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

// Setup time range selector
function setupTimeRangeSelector() {
    const timeRangeSelect = document.getElementById('timeRange');
    
    timeRangeSelect.addEventListener('change', function() {
        // Here you would typically fetch new data based on the selected time range
        // For now, we'll just log the selection
        console.log('Time range changed to:', this.value);
    });
}

// Export to PDF functionality
document.querySelector('.updates-btn').addEventListener('click', function() {
    // Here you would typically implement PDF export functionality
    // For now, we'll just show an alert
    alert('Exporting to PDF...');
}); 
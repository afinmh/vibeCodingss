// Inisialisasi grafik ketika halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    setupTimeRangeSelector();
});

// Inisialisasi kedua grafik
function initializeCharts() {
    const consumptionCtx = document.getElementById('consumptionChart').getContext('2d');
    const savingsCtx = document.getElementById('savingsChart').getContext('2d');
    const consumptionTrendCtx = document.getElementById('consumptionTrendChart').getContext('2d');

    // Grafik Riwayat Penggunaan
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

    // Grafik Tren Penghematan
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
                            return 'Rp ' + value.toLocaleString('id-ID');
                        }
                    }
                }
            }
        }
    });

    // Grafik Tren Konsumsi
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

// Pengaturan pemilih rentang waktu
function setupTimeRangeSelector() {
    const timeRangeSelect = document.getElementById('timeRange');
    
    timeRangeSelect.addEventListener('change', function() {
        // Biasanya di sini akan mengambil data baru berdasarkan rentang waktu yang dipilih
        // Untuk saat ini, kita hanya mencatat pemilihan
        console.log('Rentang waktu diubah menjadi:', this.value);
    });
}

// Fungsionalitas ekspor ke PDF
document.querySelector('.updates-btn').addEventListener('click', function() {
    // Biasanya di sini akan mengimplementasikan fungsi ekspor PDF
    // Untuk saat ini, kita hanya menampilkan peringatan
    alert('Mengekspor ke PDF...');
});
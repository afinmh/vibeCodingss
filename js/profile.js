// Inisialisasi grafik ketika halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    initializeConsumptionChart();
    loadNotificationBadge(); // Menambahkan badge notifikasi
});

// Inisialisasi grafik perbandingan konsumsi
function initializeConsumptionChart() {
    const ctx = document.getElementById('consumptionChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
            datasets: [
                {
                    label: 'Konsumsi Anda',
                    data: [280, 290, 270, 250, 260, 250],
                    backgroundColor: '#7e57c2',
                    borderRadius: 6
                },
                {
                    label: 'Rata-rata Grup',
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

// Fungsi untuk menampilkan badge notifikasi
function loadNotificationBadge() {
    // Ambil data notifikasi dari localStorage
    const storedNotifications = localStorage.getItem('notifications');
    
    if (storedNotifications) {
        const notificationsData = JSON.parse(storedNotifications);
        const unreadCount = notificationsData.filter(notification => !notification.read).length;
        
        // Tampilkan badge hanya jika ada notifikasi yang belum dibaca
        if (unreadCount > 0) {
            const notificationMenuItem = document.querySelector('.menu a[href="notifications.html"] .icon');
            if (notificationMenuItem) {
                notificationMenuItem.innerHTML = `🔔 <span class="badge">${unreadCount}</span>`;
            }
        }
    }
}
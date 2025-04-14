// Sidebar Toggle Functionality - Disabled for desktop
function initializeSidebar() {
    // Untuk saat ini, kita menonaktifkan fungsionalitas toggle sidebar
    // Kita akan mengimplementasikan ini untuk desain responsif nanti
    
    // Tetap menampilkan sidebar setiap saat untuk tampilan desktop
    const sidebar = document.querySelector('.sidebar');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    
    // Sembunyikan menu hamburger di desktop
    hamburgerMenu.style.display = 'none';
    
    // Pastikan sidebar terlihat
    sidebar.classList.remove('show');
    
    // Periksa notifikasi yang belum dibaca dan perbarui badge
    updateNotificationBadge();
    
    // Kita tetap menyimpan kode ini dikomentari untuk implementasi mobile di masa depan
    /*
    hamburgerMenu.addEventListener('click', () => {
        sidebar.classList.toggle('show');
        hamburgerMenu.classList.toggle('active');
        body.classList.toggle('sidebar-open');
        
        // Perbarui posisi tombol hamburger saat sidebar ditampilkan/disembunyikan
        if (sidebar.classList.contains('show')) {
            hamburgerMenu.style.transform = 'translateY(-50%) rotate(180deg)';
            hamburgerMenu.style.left = `calc(var(--sidebar-width) - 18px)`;
        } else {
            hamburgerMenu.style.transform = 'translateY(-50%) rotate(0deg)';
            hamburgerMenu.style.left = '12px';
        }
    });

    // Tutup sidebar saat mengklik di luar
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !hamburgerMenu.contains(e.target)) {
            sidebar.classList.remove('show');
            hamburgerMenu.classList.remove('active');
            body.classList.remove('sidebar-open');
            hamburgerMenu.style.transform = 'translateY(-50%) rotate(0deg)';
            hamburgerMenu.style.left = '12px';
        }
    });
    */
}

// Periksa notifikasi yang belum dibaca dan perbarui badge di menu
function updateNotificationBadge() {
    // Dapatkan notifikasi dari localStorage
    const storedNotifications = localStorage.getItem('notifications');
    
    if (storedNotifications) {
        const notifications = JSON.parse(storedNotifications);
        const unreadCount = notifications.filter(notification => !notification.read).length;
        
        // Perbarui item menu notifikasi jika ada notifikasi yang belum dibaca
        if (unreadCount > 0) {
            const notificationMenuItem = document.querySelector('.menu a[href="notifications.html"] .icon');
            if (notificationMenuItem) {
                notificationMenuItem.innerHTML = `🔔<span class="badge">${unreadCount}</span>`;
            }
            
            // Juga perbarui tombol pembaruan di header jika ada
            const updatesBtn = document.querySelector('.updates-btn');
            if (updatesBtn) {
                updatesBtn.textContent = `🔔 ${unreadCount} PEMBARUAN BARU`;
                updatesBtn.addEventListener('click', () => {
                    window.location.href = 'notifications.html';
                });
            }
        }
    }
}

// Data untuk grafik biaya
const costData = {
    labels: ['1 Mar', '2 Mar', '3 Mar', '4 Mar', '5 Mar', '6 Mar', '7 Mar', '8 Mar', '9 Mar', '10 Mar', '11 Mar'],
    datasets: [
        {
            label: 'Listrik',
            data: [40000, 30000, 50000, 40000, 60000, 50000, 40000, 30000, 40000, 40000, 70000],
            backgroundColor: function(context) {
                const chart = context.chart;
                const {ctx, chartArea} = chart;
                if (!chartArea) {
                    return null;
                }
                const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
                gradient.addColorStop(0, '#818cf8');
                gradient.addColorStop(1, '#6366f1');
                return gradient;
            },
            borderRadius: {
                topLeft: 6,
                topRight: 6,
                bottomLeft: 6,
                bottomRight: 6
            }
        }
    ]
};

// Data untuk grafik perkiraan penggunaan
const usageData = {
    labels: ['1 Mar', '3 Mar', '5 Mar', '7 Mar', '9 Mar'],
    datasets: [{
        label: 'Penggunaan',
        data: [150, 170, 190, 218, 240],
        borderColor: '#f87171',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        tension: 0.4,
        fill: true
    }]
};

// Data untuk grafik prediksi cuaca
const weatherData = {
    labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
    datasets: [{
        label: 'Prediksi Penggunaan',
        data: [1, 1, 2, 2, 3, 2, 2, 1],
        borderColor: '#7e57c2',
        backgroundColor: 'rgba(126, 87, 194, 0.1)',
        tension: 0.4,
        fill: true
    }]
};

// Data peralatan
let appliances = [];

// Muat peralatan dari localStorage
function loadActiveAppliances() {
    const storedAppliances = localStorage.getItem('appliances');
    if (storedAppliances) {
        const allAppliances = JSON.parse(storedAppliances);
        const activeAppliances = allAppliances.filter(appliance => appliance.status === 'active');
        
        // Hitung total penggunaan daya untuk perhitungan persentase
        const totalPowerUsage = activeAppliances.reduce((total, appliance) => total + (appliance.powerUsage * appliance.usageHours), 0);
        
        // Transformasi data untuk menyertakan penggunaan dan persentase
        appliances = activeAppliances.map(appliance => {
            const dailyUsage = (appliance.powerUsage * appliance.usageHours) / 1000; // Konversi ke kWh
            const percentage = Math.round((appliance.powerUsage * appliance.usageHours / totalPowerUsage) * 100);
            
            return {
                id: appliance.id,
                name: appliance.name,
                usage: `${dailyUsage.toFixed(1)} kWh`,
                percentage: percentage,
                status: appliance.status
            };
        });
    } else {
        // Jika tidak ada data di localStorage, gunakan data default
        appliances = [
            { id: 1, name: 'AC', usage: '1.2 kWh', percentage: 70, status: 'active' },
            { id: 2, name: 'Kulkas', usage: '0.9 kWh', percentage: 45, status: 'active' },
            { id: 5, name: 'Lampu LED', usage: '0.8 kWh', percentage: 40, status: 'active' }
        ];
    }
}

// Toggle status peralatan
function toggleApplianceStatus(applianceId) {
    const storedAppliances = localStorage.getItem('appliances');
    if (storedAppliances) {
        const allAppliances = JSON.parse(storedAppliances);
        const appliance = allAppliances.find(a => a.id === applianceId);
        if (appliance) {
            appliance.status = appliance.status === 'active' ? 'inactive' : 'active';
            localStorage.setItem('appliances', JSON.stringify(allAppliances));
            loadActiveAppliances();
            renderActiveAppliances();
        }
    }
}

// Render peralatan aktif
function renderActiveAppliances() {
    const appliancesList = document.querySelector('.appliance-list');
    appliancesList.innerHTML = appliances.map(appliance => `
        <div class="appliance-item">
            <div class="appliance-header">
                <div class="appliance-name">${appliance.name}</div>
                <div class="status-indicator status-${appliance.status}" onclick="toggleApplianceStatus(${appliance.id})"></div>
            </div>
            <div class="appliance-details">
                <div class="progress-bar">
                    <div class="progress" style="width: ${appliance.percentage}%"></div>
                </div>
                <div class="appliance-usage">${appliance.usage}</div>
            </div>
        </div>
    `).join('');
}

// Opsi grafik
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
            },
            ticks: {
                stepSize: 1,
                callback: value => value + ' kWh'
            }
        }
    },
    plugins: {
        legend: {
            display: false
        }
    }
};

// Inisialisasi semuanya saat skrip dimuat
initializeSidebar();
loadActiveAppliances();
renderActiveAppliances();

// Inisialisasi grafik biaya
const costChart = new Chart(document.getElementById('costChart'), {
    type: 'bar',
    data: costData,
    options: {
        ...chartOptions,
        scales: {
            ...chartOptions.scales,
            y: {
                ...chartOptions.scales.y,
                ticks: {
                    callback: value => 'Rp ' + value.toLocaleString('id-ID')
                }
            }
        }
    }
});

// Inisialisasi grafik perkiraan penggunaan
const usageChart = new Chart(document.getElementById('usageChart'), {
    type: 'line',
    data: usageData,
    options: chartOptions
});

// Inisialisasi grafik prediksi cuaca
const weatherChart = new Chart(document.getElementById('weatherChart'), {
    type: 'line',
    data: weatherData,
    options: chartOptions
});
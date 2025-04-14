// Sidebar Toggle Functionality - Disabled for desktop
function initializeSidebar() {
    // For now, we're disabling the sidebar toggle functionality
    // We'll re-implement this for responsive design later
    
    // Keep the sidebar visible at all times for desktop view
    const sidebar = document.querySelector('.sidebar');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    
    // Hide the hamburger menu on desktop
    hamburgerMenu.style.display = 'none';
    
    // Make sure the sidebar is visible
    sidebar.classList.remove('show');
    
    // Check for unread notifications and update the badge
    updateNotificationBadge();
    
    // We're keeping this code commented out for future mobile implementation
    /*
    hamburgerMenu.addEventListener('click', () => {
        sidebar.classList.toggle('show');
        hamburgerMenu.classList.toggle('active');
        body.classList.toggle('sidebar-open');
        
        // Update the hamburger button position when sidebar is shown/hidden
        if (sidebar.classList.contains('show')) {
            hamburgerMenu.style.transform = 'translateY(-50%) rotate(180deg)';
            hamburgerMenu.style.left = `calc(var(--sidebar-width) - 18px)`;
        } else {
            hamburgerMenu.style.transform = 'translateY(-50%) rotate(0deg)';
            hamburgerMenu.style.left = '12px';
        }
    });

    // Close sidebar when clicking outside
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

// Check for unread notifications and update the badge in the menu
function updateNotificationBadge() {
    // Get notifications from localStorage
    const storedNotifications = localStorage.getItem('notifications');
    
    if (storedNotifications) {
        const notifications = JSON.parse(storedNotifications);
        const unreadCount = notifications.filter(notification => !notification.read).length;
        
        // Update the notifications menu item if there are unread notifications
        if (unreadCount > 0) {
            const notificationMenuItem = document.querySelector('.menu a[href="notifications.html"] .icon');
            if (notificationMenuItem) {
                notificationMenuItem.innerHTML = `🔔<span class="badge">${unreadCount}</span>`;
            }
            
            // Also update the updates button in header if present
            const updatesBtn = document.querySelector('.updates-btn');
            if (updatesBtn) {
                updatesBtn.textContent = `🔔 ${unreadCount} NEW UPDATES`;
                updatesBtn.addEventListener('click', () => {
                    window.location.href = 'notifications.html';
                });
            }
        }
    }
}

// Data for the cost chart
const costData = {
    labels: ['Mar 1', 'Mar 2', 'Mar 3', 'Mar 4', 'Mar 5', 'Mar 6', 'Mar 7', 'Mar 8', 'Mar 9', 'Mar 10', 'Mar 11'],
    datasets: [
        {
            label: 'Electricity',
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

// Data for the usage estimate chart
const usageData = {
    labels: ['Mar 1', 'Mar 3', 'Mar 5', 'Mar 7', 'Mar 9'],
    datasets: [{
        label: 'Usage',
        data: [150, 170, 190, 218, 240],
        borderColor: '#f87171',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        tension: 0.4,
        fill: true
    }]
};

// Data for the weather prediction chart
const weatherData = {
    labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
    datasets: [{
        label: 'Predicted Usage',
        data: [1, 1, 2, 2, 3, 2, 2, 1],
        borderColor: '#7e57c2',
        backgroundColor: 'rgba(126, 87, 194, 0.1)',
        tension: 0.4,
        fill: true
    }]
};

// Appliances data
let appliances = [];

// Load appliances from localStorage
function loadActiveAppliances() {
    const storedAppliances = localStorage.getItem('appliances');
    if (storedAppliances) {
        const allAppliances = JSON.parse(storedAppliances);
        const activeAppliances = allAppliances.filter(appliance => appliance.status === 'active');
        
        // Calculate total power usage for percentage calculation
        const totalPowerUsage = activeAppliances.reduce((total, appliance) => total + (appliance.powerUsage * appliance.usageHours), 0);
        
        // Transform the data to include usage and percentage
        appliances = activeAppliances.map(appliance => {
            const dailyUsage = (appliance.powerUsage * appliance.usageHours) / 1000; // Convert to kWh
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
        // If no data in localStorage, use default data
        appliances = [
            { id: 1, name: 'Air Conditioner', usage: '1.2 kWh', percentage: 70, status: 'active' },
            { id: 2, name: 'Refrigerator', usage: '0.9 kWh', percentage: 45, status: 'active' },
            { id: 5, name: 'LED Lights', usage: '0.8 kWh', percentage: 40, status: 'active' }
        ];
    }
}

// Toggle appliance status
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

// Render active appliances
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

// Chart options
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

// Initialize everything when script loads
initializeSidebar();
loadActiveAppliances();
renderActiveAppliances();

// Initialize the cost chart
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

// Initialize the usage estimate chart
const usageChart = new Chart(document.getElementById('usageChart'), {
    type: 'line',
    data: usageData,
    options: chartOptions
});

// Initialize the weather prediction chart
const weatherChart = new Chart(document.getElementById('weatherChart'), {
    type: 'line',
    data: weatherData,
    options: chartOptions
});
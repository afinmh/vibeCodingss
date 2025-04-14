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
            label: 'Gas',
            data: [3, 5, 8, 3, 5, 4, 3, 5, 8, 3, 4],
            backgroundColor: function(context) {
                const chart = context.chart;
                const {ctx, chartArea} = chart;
                if (!chartArea) {
                    return null;
                }
                const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
                gradient.addColorStop(0, '#93c5fd');
                gradient.addColorStop(1, '#60a5fa');
                return gradient;
            },
            borderRadius: {
                topLeft: 0,
                topRight: 0,
                bottomLeft: 6,
                bottomRight: 6
            },
            stack: 'Stack 0',
        },
        {
            label: 'Electricity',
            data: [4, 3, 5, 4, 6, 5, 4, 3, 4, 4, 7],
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
                bottomLeft: 0,
                bottomRight: 0
            },
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
            }
        }
    },
    plugins: {
        legend: {
            display: false
        }
    }
};

// Initialize everything when script loads - no need for DOMContentLoaded anymore with defer
initializeSidebar();

// Initialize the cost chart
const costChart = new Chart(document.getElementById('costChart'), {
    type: 'bar',
    data: costData,
    options: {
        ...chartOptions,
        scales: {
            ...chartOptions.scales,
            x: {
                ...chartOptions.scales.x,
                stacked: true
            },
            y: {
                ...chartOptions.scales.y,
                stacked: true,
                ticks: {
                    callback: value => '$' + value
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
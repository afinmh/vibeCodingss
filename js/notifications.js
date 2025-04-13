// Default notification data - will be used only if localStorage is empty
const defaultNotifications = [
    {
        id: 1,
        title: "Welcome to Energy Dashboard",
        message: "Thank you for using our energy dashboard. You can monitor your energy usage and receive important notifications here.",
        type: "info",
        read: false,
        timestamp: new Date(Date.now() - 86400000).toISOString() // yesterday
    },
    {
        id: 2,
        title: "High Energy Usage",
        message: "Your energy usage is 20% higher than usual. Check your appliances to see what might be causing this increase.",
        type: "warning",
        read: false,
        timestamp: new Date(Date.now() - 43200000).toISOString() // 12 hours ago
    },
    {
        id: 3,
        title: "Bedroom Lights Left On",
        message: "Your bedroom lights have been on for over 8 hours. Consider turning them off to save energy.",
        type: "danger",
        read: false,
        timestamp: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
    }
];

// Initialize notifications data from localStorage or default data
let notificationsData = [];

// DOM Elements
const notificationsContainer = document.getElementById('notificationsContainer');
const searchInput = document.getElementById('searchNotifications');
const notificationFilter = document.getElementById('notificationFilter');
const unreadCountElement = document.getElementById('unreadCount');
const markAllReadBtn = document.getElementById('markAllReadBtn');
const createTestNotifBtn = document.getElementById('createTestNotifBtn');
const notificationModal = document.getElementById('notificationModal');
const notificationForm = document.getElementById('notificationForm');
const closeModalBtn = document.querySelector('.close-modal');
const cancelBtn = document.querySelector('.cancel-btn');

// Filter state
const filterState = {
    searchTerm: '',
    typeFilter: 'all'
};

// Filtered notifications
let filteredNotifications = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadNotifications();
    renderNotifications();
    updateUnreadCount();
    setupEventListeners();
});

// Load notifications from localStorage or use default data
function loadNotifications() {
    const storedNotifications = localStorage.getItem('notifications');
    
    if (storedNotifications) {
        notificationsData = JSON.parse(storedNotifications);
    } else {
        // If no data in localStorage, use the default data
        notificationsData = [...defaultNotifications];
        // Save the default data to localStorage
        saveNotifications();
    }
    
    // Sort notifications by timestamp (newest first)
    notificationsData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Apply default filters
    applyFilters();
}

// Save notifications to localStorage
function saveNotifications() {
    localStorage.setItem('notifications', JSON.stringify(notificationsData));
}

// Apply filters to get filtered notifications
function applyFilters() {
    filteredNotifications = notificationsData.filter(notification => {
        const matchesSearch = !filterState.searchTerm || 
            notification.title.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
            notification.message.toLowerCase().includes(filterState.searchTerm.toLowerCase());
            
        let matchesType = true;
        
        if (filterState.typeFilter !== 'all') {
            if (filterState.typeFilter === 'unread') {
                matchesType = !notification.read;
            } else {
                matchesType = notification.type === filterState.typeFilter;
            }
        }
        
        return matchesSearch && matchesType;
    });
}

// Update the unread count display
function updateUnreadCount() {
    const unreadCount = notificationsData.filter(notification => !notification.read).length;
    unreadCountElement.textContent = unreadCount;
    
    // Update the title in the notifications tab
    document.title = unreadCount > 0 
        ? `(${unreadCount}) Notifications - Energy Dashboard` 
        : 'Notifications - Energy Dashboard';
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', () => {
        filterState.searchTerm = searchInput.value;
        applyFilters();
        renderNotifications();
    });
    
    // Filter by type
    notificationFilter.addEventListener('change', () => {
        filterState.typeFilter = notificationFilter.value;
        applyFilters();
        renderNotifications();
    });
    
    // Mark all as read
    markAllReadBtn.addEventListener('click', markAllAsRead);
    
    // Test notification button
    createTestNotifBtn.addEventListener('click', () => {
        notificationModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    // Close modal
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Close modal if user clicks outside of it
    notificationModal.addEventListener('click', (e) => {
        if (e.target === notificationModal) {
            closeModal();
        }
    });
    
    // Create test notification form
    notificationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        createTestNotification();
    });
}

// Close the modal
function closeModal() {
    notificationModal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
    notificationForm.reset(); // Reset the form
}

// Create a test notification
function createTestNotification() {
    const title = document.getElementById('notificationTitle').value.trim();
    const message = document.getElementById('notificationMessage').value.trim();
    const type = document.getElementById('notificationType').value;
    
    const newNotification = {
        id: generateUniqueId(),
        title,
        message,
        type,
        read: false,
        timestamp: new Date().toISOString()
    };
    
    // Add to the beginning of the array (newest first)
    notificationsData.unshift(newNotification);
    
    // Save to localStorage
    saveNotifications();
    
    // Apply filters
    applyFilters();
    
    // Render notifications
    renderNotifications();
    
    // Update unread count
    updateUnreadCount();
    
    // Close the modal
    closeModal();
}

// Generate a unique ID for new notifications
function generateUniqueId() {
    const existingIds = notificationsData.map(notification => notification.id);
    let newId = 1;
    while (existingIds.includes(newId)) {
        newId++;
    }
    return newId;
}

// Mark a notification as read
function markAsRead(id) {
    const notificationIndex = notificationsData.findIndex(n => n.id === parseInt(id));
    
    if (notificationIndex !== -1) {
        notificationsData[notificationIndex].read = true;
        
        // Save to localStorage
        saveNotifications();
        
        // Apply filters
        applyFilters();
        
        // Render notifications
        renderNotifications();
        
        // Update unread count
        updateUnreadCount();
    }
}

// Mark all notifications as read
function markAllAsRead() {
    // Mark all notifications as read
    notificationsData.forEach(notification => {
        notification.read = true;
    });
    
    // Save to localStorage
    saveNotifications();
    
    // Apply filters
    applyFilters();
    
    // Render notifications
    renderNotifications();
    
    // Update unread count
    updateUnreadCount();
}

// Delete a notification
function deleteNotification(id) {
    const notificationIndex = notificationsData.findIndex(n => n.id === parseInt(id));
    
    if (notificationIndex !== -1) {
        // Confirm deletion
        if (confirm("Are you sure you want to delete this notification?")) {
            // Remove the notification
            notificationsData.splice(notificationIndex, 1);
            
            // Save to localStorage
            saveNotifications();
            
            // Apply filters
            applyFilters();
            
            // Render notifications
            renderNotifications();
            
            // Update unread count
            updateUnreadCount();
        }
    }
}

// Render notifications
function renderNotifications() {
    // Clear the container
    notificationsContainer.innerHTML = '';
    
    // Check if there are any notifications to show
    if (filteredNotifications.length === 0) {
        notificationsContainer.innerHTML = `
            <div class="no-notifications">
                <p>No notifications found. Notifications about your energy usage and appliances will appear here.</p>
            </div>
        `;
        return;
    }
    
    // Render each notification
    filteredNotifications.forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification-item ${notification.type} ${notification.read ? '' : 'unread'}`;
        notificationElement.dataset.id = notification.id;
        
        // Format the date
        const timestamp = new Date(notification.timestamp);
        const formattedDate = formatTimestamp(timestamp);
        
        let badgeText = 'Info';
        if (notification.type === 'warning') badgeText = 'Warning';
        if (notification.type === 'danger') badgeText = 'Critical';
        
        notificationElement.innerHTML = `
            <div class="notification-header">
                <h3 class="notification-title">${notification.title}</h3>
                <span class="notification-badge badge-${notification.type}">${badgeText}</span>
            </div>
            <p class="notification-message">${notification.message}</p>
            <div class="notification-time">${formattedDate}</div>
            <div class="notification-actions">
                ${!notification.read ? `<button class="notification-btn read-btn" data-id="${notification.id}">Mark as Read</button>` : ''}
                <button class="notification-btn delete-btn" data-id="${notification.id}">Delete</button>
            </div>
        `;
        
        notificationsContainer.appendChild(notificationElement);
    });
    
    // Add event listeners for the buttons
    document.querySelectorAll('.read-btn').forEach(btn => {
        btn.addEventListener('click', () => markAsRead(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteNotification(btn.dataset.id));
    });
}

// Format timestamp to a readable format
function formatTimestamp(timestamp) {
    const now = new Date();
    const diffTime = Math.abs(now - timestamp);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffMinutes < 60) {
        return diffMinutes === 0 ? 'Just now' : `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    } else {
        return timestamp.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Add automatic notifications based on appliance data
function checkForAutomaticNotifications() {
    // This function would check appliance data and energy usage
    // to automatically generate notifications when needed
    
    // For example, if an appliance has been active for too long,
    // or if energy usage exceeds a threshold
    
    // For this example, we'll simulate with a random notification occasionally
    if (Math.random() < 0.2) { // 20% chance to create a notification
        const notificationTypes = [
            {
                title: "Energy Usage Alert",
                message: "Your energy consumption is higher than usual today. Consider adjusting your thermostat.",
                type: "warning"
            },
            {
                title: "Appliance Left On",
                message: "Your kitchen lights have been on for an extended period. Consider turning them off to save energy.",
                type: "danger"
            },
            {
                title: "Energy Savings Opportunity",
                message: "Reducing your heating by 1 degree could save you up to 10% on your energy bill.",
                type: "info"
            }
        ];
        
        const randomNotif = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        
        const newNotification = {
            id: generateUniqueId(),
            title: randomNotif.title,
            message: randomNotif.message,
            type: randomNotif.type,
            read: false,
            timestamp: new Date().toISOString()
        };
        
        // Add to the beginning of the array (newest first)
        notificationsData.unshift(newNotification);
        
        // Save to localStorage
        saveNotifications();
        
        // Apply filters
        applyFilters();
        
        // Render notifications
        renderNotifications();
        
        // Update unread count
        updateUnreadCount();
    }
}

// Update the navigation menu in other pages to show unread count
function updateNavNotificationCount() {
    // This function would be called from all pages to update the notification icon
    // in the sidebar with the current unread count
    const unreadCount = notificationsData.filter(notification => !notification.read).length;
    
    if (unreadCount > 0) {
        // Add a badge to the notifications menu item
        const notificationMenuItem = document.querySelector('.menu a[href="notifications.html"] .icon');
        if (notificationMenuItem) {
            notificationMenuItem.innerHTML = `🔔 <span class="badge">${unreadCount}</span>`;
        }
    }
}

// Check for automatic notifications every 30 seconds
// This is just for demonstration purposes - in a real app you might do this
// based on real-time data or when the user performs certain actions
setInterval(checkForAutomaticNotifications, 30000);
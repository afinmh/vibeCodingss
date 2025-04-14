// Default rewards data - will be used only if localStorage is empty
const defaultRewards = [
    {
        id: 1,
        title: "₹100 Bill Discount",
        description: "Get ₹100 off on your next electricity bill",
        points: 800,
        image: "discount", // We'll use an icon for this
        badge: "popular",
        type: "discount",
        claimed: false,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    },
    {
        id: 2,
        title: "Smart Plug",
        description: "WiFi-enabled smart plug to monitor and control your appliances remotely",
        points: 1500,
        image: "smartplug",
        badge: "new",
        type: "product",
        claimed: false,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days from now
    },
    {
        id: 3,
        title: "Energy Audit",
        description: "Professional home energy audit to identify potential energy savings",
        points: 2500,
        image: "audit",
        type: "service",
        claimed: false,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days from now
    },
    {
        id: 4,
        title: "LED Bulb Pack",
        description: "Pack of 4 energy-efficient LED bulbs",
        points: 750,
        image: "ledbulb",
        badge: "popular",
        type: "product",
        claimed: false,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    },
    {
        id: 5,
        title: "₹250 Bill Discount",
        description: "Get ₹250 off on your next electricity bill",
        points: 2000,
        image: "discount",
        type: "discount",
        claimed: false,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    },
    {
        id: 6,
        title: "Smart Power Strip",
        description: "Control multiple devices and monitor energy usage with this smart power strip",
        points: 3500,
        image: "powerstrip",
        badge: "limited",
        type: "product",
        claimed: false,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
    }
];

// Initialize rewards data from localStorage or default data
let rewardsData = [];
let userPoints = 1250; // Default points
let filteredRewards = [];

// DOM Elements
const rewardsContainer = document.getElementById('rewardsContainer');
const searchInput = document.getElementById('searchRewards');
const rewardsFilter = document.getElementById('rewardsFilter');
const totalPointsElement = document.getElementById('totalPoints');
const viewOptions = document.querySelectorAll('.view-option');
const rewardModal = document.getElementById('rewardModal');
const closeModalBtn = document.querySelector('.close-modal');
const cancelBtn = document.querySelector('.cancel-btn');
const confirmClaimBtn = document.getElementById('confirmClaimBtn');

// Current view state
let currentView = 'grid';

// Filter state
const filterState = {
    searchTerm: '',
    typeFilter: 'all'
};

// Load rewards from localStorage or use default data
function loadRewards() {
    const storedRewards = localStorage.getItem('rewards');
    const storedPoints = localStorage.getItem('userPoints');
    
    if (storedRewards) {
        rewardsData = JSON.parse(storedRewards);
    } else {
        rewardsData = [...defaultRewards];
        localStorage.setItem('rewards', JSON.stringify(rewardsData));
    }
    
    if (storedPoints) {
        userPoints = parseInt(storedPoints);
    } else {
        localStorage.setItem('userPoints', userPoints.toString());
    }
    
    // Update the UI with current points
    updatePointsDisplay();
}

// Save rewards to localStorage
function saveRewards() {
    localStorage.setItem('rewards', JSON.stringify(rewardsData));
}

// Save user points to localStorage
function saveUserPoints() {
    localStorage.setItem('userPoints', userPoints.toString());
}

// Update points display
function updatePointsDisplay() {
    totalPointsElement.textContent = userPoints.toLocaleString();
}

// Apply filters to get filtered rewards
function applyFilters() {
    filteredRewards = rewardsData.filter(reward => {
        const matchesSearch = !filterState.searchTerm || 
            reward.title.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
            reward.description.toLowerCase().includes(filterState.searchTerm.toLowerCase());
            
        let matchesType = true;
        
        if (filterState.typeFilter !== 'all') {
            if (filterState.typeFilter === 'available') {
                matchesType = !reward.claimed;
            } else if (filterState.typeFilter === 'claimed') {
                matchesType = reward.claimed;
            } else if (filterState.typeFilter === 'expiring') {
                // Consider rewards expiring in the next 7 days as "expiring soon"
                const expiryDate = new Date(reward.expiresAt);
                const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                matchesType = !reward.claimed && expiryDate <= sevenDaysFromNow;
            }
        }
        
        return matchesSearch && matchesType;
    });
}

// Get icon for reward type
function getRewardIcon(image) {
    switch(image) {
        case 'discount':
            return '<i class="fas fa-tag"></i>';
        case 'smartplug':
            return '<i class="fas fa-plug"></i>';
        case 'audit':
            return '<i class="fas fa-clipboard-check"></i>';
        case 'ledbulb':
            return '<i class="fas fa-lightbulb"></i>';
        case 'powerstrip':
            return '<i class="fas fa-bolt"></i>';
        default:
            return '<i class="fas fa-gift"></i>';
    }
}

// Get badge label
function getBadgeLabel(badge) {
    switch(badge) {
        case 'popular':
            return 'Popular';
        case 'new':
            return 'New';
        case 'limited':
            return 'Limited Time';
        default:
            return '';
    }
}

// Format expiry date
function formatExpiryDate(expiresAt) {
    const expiryDate = new Date(expiresAt);
    const today = new Date();
    const diffTime = Math.abs(expiryDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Expires tomorrow';
    } else if (diffDays < 7) {
        return `Expires in ${diffDays} days`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `Expires in ${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
    } else {
        return `Expires on ${expiryDate.toLocaleDateString()}`;
    }
}

// Render rewards based on current view (grid or list)
function renderRewards() {
    // Apply filters first
    applyFilters();
    
    // Clear the container
    rewardsContainer.innerHTML = '';
    
    // Check if there are any rewards to show
    if (filteredRewards.length === 0) {
        rewardsContainer.innerHTML = `
            <div class="no-rewards">
                <p>No rewards found. Keep saving energy to unlock more rewards!</p>
            </div>
        `;
        return;
    }
    
    // Set the container class based on current view
    rewardsContainer.className = currentView === 'grid' ? 'rewards-grid' : 'rewards-list';
    
    // Render rewards
    filteredRewards.forEach(reward => {
        const rewardElement = document.createElement('div');
        rewardElement.className = currentView === 'grid' ? 'reward-card' : 'reward-row';
        rewardElement.dataset.id = reward.id;
        
        // Check if the reward has a badge
        const badgeHtml = reward.badge ? 
            `<span class="reward-badge ${reward.badge}">${getBadgeLabel(reward.badge)}</span>` : '';
        
        // Check if the reward is claimed
        const claimedHtml = reward.claimed ? 
            `<span class="reward-badge claimed">Claimed</span>` : '';
        
        // Create content based on view type
        if (currentView === 'grid') {
            rewardElement.innerHTML = `
                ${badgeHtml}
                ${claimedHtml}
                <div class="reward-image">
                    ${getRewardIcon(reward.image)}
                </div>
                <div class="reward-content">
                    <h3 class="reward-title">${reward.title}</h3>
                    <p class="reward-description">${reward.description}</p>
                    <div class="reward-footer">
                        <div class="reward-points">
                            <i class="fas fa-leaf"></i>
                            ${reward.points.toLocaleString()}
                        </div>
                        ${!reward.claimed ? 
                            `<button class="claim-btn" ${userPoints < reward.points ? 'disabled' : ''}>
                                ${userPoints < reward.points ? 'Not Enough Points' : 'Claim'}
                            </button>` :
                            '<span class="claimed-text">Claimed</span>'
                        }
                    </div>
                </div>
            `;
        } else {
            // List view
            rewardElement.innerHTML = `
                ${badgeHtml}
                ${claimedHtml}
                <div class="reward-image">
                    ${getRewardIcon(reward.image)}
                </div>
                <div class="reward-content">
                    <h3 class="reward-title">${reward.title}</h3>
                    <p class="reward-description">${reward.description}</p>
                </div>
                <div class="reward-points">
                    <i class="fas fa-leaf"></i>
                    ${reward.points.toLocaleString()}
                </div>
                ${!reward.claimed ? 
                    `<button class="claim-btn" ${userPoints < reward.points ? 'disabled' : ''}>
                        ${userPoints < reward.points ? 'Not Enough' : 'Claim'}
                    </button>` :
                    '<span class="claimed-text">Claimed</span>'
                }
            `;
        }
        
        rewardsContainer.appendChild(rewardElement);
    });
    
    // Add event listeners to claim buttons
    document.querySelectorAll('.claim-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const rewardCard = e.target.closest('.reward-card') || e.target.closest('.reward-row');
            if (rewardCard) {
                showRewardModal(rewardCard.dataset.id);
            }
        });
    });
}

// Show reward modal for claiming a reward
function showRewardModal(rewardId) {
    const reward = rewardsData.find(r => r.id === parseInt(rewardId));
    
    if (!reward) return;
    
    // Populate modal with reward details
    document.getElementById('modalRewardTitle').textContent = reward.title;
    document.getElementById('modalRewardDescription').textContent = reward.description;
    document.getElementById('modalRewardPoints').textContent = reward.points.toLocaleString();
    
    // Set the reward image/icon
    const modalRewardImage = document.getElementById('modalRewardImage');
    modalRewardImage.innerHTML = getRewardIcon(reward.image);
    
    // Store the reward ID in the confirm button for reference
    confirmClaimBtn.dataset.id = reward.id;
    
    // Disable confirm button if user doesn't have enough points
    if (userPoints < reward.points) {
        confirmClaimBtn.disabled = true;
        confirmClaimBtn.textContent = 'Not Enough Points';
    } else {
        confirmClaimBtn.disabled = false;
        confirmClaimBtn.textContent = 'Claim Reward';
    }
    
    // Show the modal
    rewardModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Close the reward modal
function closeModal() {
    rewardModal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
}

// Claim a reward
function claimReward(rewardId) {
    const rewardIndex = rewardsData.findIndex(r => r.id === parseInt(rewardId));
    
    if (rewardIndex !== -1) {
        const reward = rewardsData[rewardIndex];
        
        // Make sure user has enough points
        if (userPoints >= reward.points) {
            // Deduct points
            userPoints -= reward.points;
            
            // Mark reward as claimed
            rewardsData[rewardIndex].claimed = true;
            
            // Create a notification about the claimed reward
            createClaimNotification(reward);
            
            // Save changes
            saveRewards();
            saveUserPoints();
            
            // Update points display
            updatePointsDisplay();
            
            // Re-render rewards
            renderRewards();
            
            // Show success message
            alert(`Congratulations! You've successfully claimed "${reward.title}". Your remaining points: ${userPoints}`);
        }
    }
    
    // Close the modal
    closeModal();
}

// Create a notification when a reward is claimed
function createClaimNotification(reward) {
    // Get notifications from localStorage
    let notifications = [];
    const storedNotifications = localStorage.getItem('notifications');
    
    if (storedNotifications) {
        notifications = JSON.parse(storedNotifications);
    }
    
    // Create a new notification
    const newNotification = {
        id: Date.now(), // Use timestamp as ID
        title: "Reward Claimed",
        message: `You've successfully claimed "${reward.title}" for ${reward.points} points.`,
        type: "info",
        read: false,
        timestamp: new Date().toISOString()
    };
    
    // Add to the beginning of the array (newest first)
    notifications.unshift(newNotification);
    
    // Save to localStorage
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // Update the notifications badge in the sidebar if it exists
    updateNotificationBadge();
}

// Update notification badge in sidebar menu
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
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', () => {
        filterState.searchTerm = searchInput.value;
        renderRewards();
    });
    
    // Filter by type
    rewardsFilter.addEventListener('change', () => {
        filterState.typeFilter = rewardsFilter.value;
        renderRewards();
    });
    
    // View options (grid/list)
    viewOptions.forEach(option => {
        option.addEventListener('click', () => {
            currentView = option.dataset.view;
            
            // Update active class
            viewOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Re-render rewards with the new view
            renderRewards();
        });
    });
    
    // Close modal
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Close modal if user clicks outside of it
    rewardModal.addEventListener('click', (e) => {
        if (e.target === rewardModal) {
            closeModal();
        }
    });
    
    // Claim reward
    confirmClaimBtn.addEventListener('click', () => {
        claimReward(confirmClaimBtn.dataset.id);
    });
}

// Initialize the page
loadRewards();
renderRewards();
setupEventListeners();
updateNotificationBadge();
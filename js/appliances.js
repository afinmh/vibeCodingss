// Default appliance data - will be used only if localStorage is empty
const defaultAppliancesData = [
    {
        id: 1,
        name: "Air Conditioner",
        type: "cooling",
        room: "Living Room",
        powerUsage: 1200,
        usageHours: 6,
        status: "active",
        energyEfficiency: 75
    },
    {
        id: 2,
        name: "Refrigerator",
        type: "kitchen",
        room: "Kitchen",
        powerUsage: 150,
        usageHours: 24,
        status: "active",
        energyEfficiency: 88
    },
    {
        id: 3,
        name: "Smart TV",
        type: "entertainment",
        room: "Living Room",
        powerUsage: 120,
        usageHours: 5,
        status: "inactive",
        energyEfficiency: 92
    },
    {
        id: 4,
        name: "Washing Machine",
        type: "other",
        room: "Bathroom",
        powerUsage: 500,
        usageHours: 1.5,
        status: "inactive",
        energyEfficiency: 65
    },
    {
        id: 5,
        name: "LED Lights",
        type: "lighting",
        room: "Bedroom",
        powerUsage: 40,
        usageHours: 5,
        status: "active",
        energyEfficiency: 95
    },
    {
        id: 6,
        name: "Space Heater",
        type: "heating",
        room: "Home Office",
        powerUsage: 1500,
        usageHours: 3,
        status: "active",
        energyEfficiency: 60
    },
    {
        id: 7,
        name: "Desktop Computer",
        type: "other",
        room: "Home Office",
        powerUsage: 250,
        usageHours: 8,
        status: "active",
        energyEfficiency: 80
    },
    {
        id: 8,
        name: "Microwave",
        type: "kitchen",
        room: "Kitchen",
        powerUsage: 1000,
        usageHours: 0.5,
        status: "inactive",
        energyEfficiency: 70
    }
];

// Filter state object
const filterState = {
    searchTerm: '',
    roomFilter: 'all',
    viewMode: 'grid'
};

// Initialize appliances data from localStorage or default data
let appliancesData = [];

// DOM Elements
const appliancesContainer = document.getElementById('appliancesContainer');
const searchInput = document.getElementById('searchAppliances');
const roomFilter = document.getElementById('roomFilter');
const viewOptions = document.querySelectorAll('.view-option');
const addApplianceBtn = document.getElementById('addApplianceBtn');
const applianceModal = document.getElementById('applianceModal');
const closeModalBtn = document.querySelector('.close-modal');
const cancelBtn = document.querySelector('.cancel-btn');
const applianceForm = document.getElementById('applianceForm');

// View state
let currentView = 'grid';
let filteredAppliances = [];

// Load appliances from localStorage or use default data
function loadAppliances() {
    const storedAppliances = localStorage.getItem('appliances');
    if (storedAppliances) {
        appliancesData = JSON.parse(storedAppliances);
    } else {
        // If no data in localStorage, use the default data
        appliancesData = [...defaultAppliancesData];
        // Save the default data to localStorage
        saveAppliances();
    }
    
    // Load filter state from localStorage
    loadFilterState();
    
    // Apply the saved filters
    applyFilterState();
}

// Save appliances to localStorage
function saveAppliances() {
    localStorage.setItem('appliances', JSON.stringify(appliancesData));
}

// Save current filter state to localStorage
function saveFilterState() {
    filterState.searchTerm = searchInput.value;
    filterState.roomFilter = roomFilter.value;
    filterState.viewMode = currentView;
    
    localStorage.setItem('applianceFilters', JSON.stringify(filterState));
}

// Load filter state from localStorage
function loadFilterState() {
    const savedFilters = localStorage.getItem('applianceFilters');
    if (savedFilters) {
        const savedState = JSON.parse(savedFilters);
        Object.assign(filterState, savedState);
        
        // Apply saved values to UI elements
        searchInput.value = filterState.searchTerm;
        roomFilter.value = filterState.roomFilter;
        currentView = filterState.viewMode;
        
        // Update active view option
        viewOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.view === currentView);
        });
    }
}

// Apply the current filter state to get filtered appliances
function applyFilterState() {
    filteredAppliances = appliancesData.filter(appliance => {
        const matchesSearch = 
            !filterState.searchTerm || 
            appliance.name.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
            appliance.type.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
            appliance.room.toLowerCase().includes(filterState.searchTerm.toLowerCase());
            
        const matchesRoom = filterState.roomFilter === 'all' || 
            appliance.room.toLowerCase().replace(' ', '-') === filterState.roomFilter;
            
        return matchesSearch && matchesRoom;
    });
}

// Generate a unique ID for new appliances
function generateUniqueId() {
    const existingIds = appliancesData.map(appliance => appliance.id);
    let newId = 1;
    while (existingIds.includes(newId)) {
        newId++;
    }
    return newId;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadAppliances();
    renderAppliances();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', () => {
        filterAppliances();
        saveFilterState();
    });
    
    // Room filter
    roomFilter.addEventListener('change', () => {
        filterAppliances();
        saveFilterState();
    });
    
    // View toggle
    viewOptions.forEach(option => {
        option.addEventListener('click', () => {
            viewOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            currentView = option.dataset.view;
            saveFilterState();
            renderAppliances();
        });
    });
    
    // Modal controls
    addApplianceBtn.addEventListener('click', () => {
        // Reset form and prepare for new entry
        applianceForm.reset();
        applianceModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    });
    
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Close modal if user clicks outside of it
    applianceModal.addEventListener('click', (e) => {
        if (e.target === applianceModal) {
            closeModal();
        }
    });
    
    // Form submission to add a new appliance
    applianceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const newAppliance = {
            id: generateUniqueId(),
            name: document.getElementById('applianceName').value.trim(),
            type: document.getElementById('applianceType').value,
            room: document.getElementById('applianceRoom').value.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            powerUsage: Number(document.getElementById('powerUsage').value),
            usageHours: Number(document.getElementById('usageHours').value),
            status: document.getElementById('applianceStatus').value,
            energyEfficiency: Math.round(Math.random() * 40) + 60 // Random efficiency between 60-100%
        };
        
        // Add the new appliance to the data array
        appliancesData.push(newAppliance);
        
        // Save to localStorage
        saveAppliances();
        
        // Apply filters to update the filtered appliances
        applyFilterState();
        
        // Render with the current filters applied
        renderAppliances();
        
        // Close the modal
        closeModal();
    });
}

// Close the modal
function closeModal() {
    applianceModal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
    applianceForm.reset(); // Reset the form
}

// Filter appliances based on search and room filter
function filterAppliances() {
    filterState.searchTerm = searchInput.value;
    filterState.roomFilter = roomFilter.value;
    
    applyFilterState();
    renderAppliances();
}

// Render appliances based on the current view and filters
function renderAppliances() {
    if (currentView === 'grid') {
        renderGridView();
    } else {
        renderListView();
    }
}

// Render appliances in a grid view
function renderGridView() {
    appliancesContainer.className = 'appliances-grid';
    
    if (filteredAppliances.length === 0) {
        appliancesContainer.innerHTML = `
            <div class="no-results">
                <p>No appliances found. Try adjusting your filters or add a new appliance.</p>
            </div>
        `;
        return;
    }
    
    appliancesContainer.innerHTML = filteredAppliances.map(appliance => `
        <div class="appliance-card" data-id="${appliance.id}">
            <div class="status-indicator status-${appliance.status}"></div>
            <h3>${appliance.name}</h3>
            <div class="appliance-info">
                <div class="info-row">
                    <span class="info-label">Type:</span>
                    <span class="info-value">${capitalizeFirstLetter(appliance.type)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Room:</span>
                    <span class="info-value">${appliance.room}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Power:</span>
                    <span class="info-value">${appliance.powerUsage} W</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Daily Usage:</span>
                    <span class="info-value">${appliance.usageHours} hrs</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="info-value">${capitalizeFirstLetter(appliance.status)}</span>
                </div>
            </div>
            <div class="energy-usage">
                <div class="info-row">
                    <span class="info-label">Energy Efficiency:</span>
                    <span class="info-value">${appliance.energyEfficiency}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${appliance.energyEfficiency}%; 
                        background-color: ${getEfficiencyColor(appliance.energyEfficiency)};"></div>
                </div>
            </div>
            <div class="appliance-actions">
                <button class="action-btn edit-btn" data-id="${appliance.id}">Edit</button>
                <button class="action-btn delete-btn" data-id="${appliance.id}">Delete</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editAppliance(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteAppliance(btn.dataset.id));
    });
}

// Render appliances in a list view
function renderListView() {
    appliancesContainer.className = 'appliances-list';
    
    if (filteredAppliances.length === 0) {
        appliancesContainer.innerHTML = `
            <div class="no-results">
                <p>No appliances found. Try adjusting your filters or add a new appliance.</p>
            </div>
        `;
        return;
    }
    
    // Create header row
    let listHTML = `
        <div class="appliance-row appliance-row-header">
            <div class="appliance-column">Appliance</div>
            <div class="appliance-column room-column">Room</div>
            <div class="appliance-column power-column">Power</div>
            <div class="appliance-column usage-hours-column">Usage (hrs)</div>
            <div class="appliance-column status-column">Status</div>
            <div class="appliance-column">Actions</div>
        </div>
    `;
    
    // Create data rows
    listHTML += filteredAppliances.map(appliance => `
        <div class="appliance-row" data-id="${appliance.id}">
            <div class="appliance-column appliance-name-cell">
                <div class="appliance-icon ${appliance.type}">${getApplianceIcon(appliance.type)}</div>
                <span>${appliance.name}</span>
            </div>
            <div class="appliance-column room-column">${appliance.room}</div>
            <div class="appliance-column power-column">${appliance.powerUsage} W</div>
            <div class="appliance-column usage-hours-column">${appliance.usageHours}</div>
            <div class="appliance-column status-column">
                <div class="appliance-status">
                    <div class="appliance-status-indicator status-${appliance.status}"></div>
                    <span>${capitalizeFirstLetter(appliance.status)}</span>
                </div>
            </div>
            <div class="appliance-column appliance-row-actions">
                <button class="action-btn edit-btn" data-id="${appliance.id}">Edit</button>
                <button class="action-btn delete-btn" data-id="${appliance.id}">Delete</button>
            </div>
        </div>
    `).join('');
    
    appliancesContainer.innerHTML = listHTML;
    
    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editAppliance(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteAppliance(btn.dataset.id));
    });
}

// Edit appliance (stub for now)
function editAppliance(id) {
    console.log(`Edit appliance with ID: ${id}`);
    // We'll implement editing functionality later
    alert(`Edit functionality for appliance ID ${id} will be implemented later.`);
}

// Delete appliance - with filter persistence
function deleteAppliance(id) {
    // Find the appliance by ID
    const applianceId = parseInt(id);
    const applianceIndex = appliancesData.findIndex(a => a.id === applianceId);
    const applianceName = appliancesData[applianceIndex]?.name || 'this appliance';
    
    // Confirm deletion
    if (confirm(`Are you sure you want to delete ${applianceName}?`)) {
        // Remove the appliance from the array
        if (applianceIndex !== -1) {
            appliancesData.splice(applianceIndex, 1);
            
            // Save the updated data to localStorage
            saveAppliances();
            
            // Apply the current filters
            applyFilterState();
            
            // Re-render the UI with filters applied
            renderAppliances();
        }
    }
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function to get color based on efficiency
function getEfficiencyColor(efficiency) {
    if (efficiency >= 80) {
        return '#10b981'; // Green for high efficiency
    } else if (efficiency >= 60) {
        return '#fbbf24'; // Yellow for medium efficiency
    } else {
        return '#f87171'; // Red for low efficiency
    }
}

// Helper function to get an icon for the appliance type
function getApplianceIcon(type) {
    const icons = {
        lighting: '💡',
        heating: '🔥',
        cooling: '❄️',
        kitchen: '🍲',
        entertainment: '📺',
        other: '🔌'
    };
    
    return icons[type] || '🔌';
}
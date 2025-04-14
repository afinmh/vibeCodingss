// Data perangkat default - akan digunakan hanya jika localStorage kosong
const defaultAppliancesData = [
    {
        id: 1,
        name: "Air Conditioner",
        type: "cooling",
        room: "Ruang Tamu",
        powerUsage: 1200,
        usageHours: 6,
        status: "active",
        energyEfficiency: 75
    },
    {
        id: 2,
        name: "Kulkas",
        type: "kitchen",
        room: "Dapur",
        powerUsage: 150,
        usageHours: 24,
        status: "active",
        energyEfficiency: 88
    },
    {
        id: 3,
        name: "Smart TV",
        type: "entertainment",
        room: "Ruang Tamu",
        powerUsage: 120,
        usageHours: 5,
        status: "inactive",
        energyEfficiency: 92
    },
    {
        id: 4,
        name: "Mesin Cuci",
        type: "other",
        room: "Kamar Mandi",
        powerUsage: 500,
        usageHours: 1.5,
        status: "inactive",
        energyEfficiency: 65
    },
    {
        id: 5,
        name: "Lampu LED",
        type: "lighting",
        room: "Kamar Tidur",
        powerUsage: 40,
        usageHours: 5,
        status: "active",
        energyEfficiency: 95
    },
    {
        id: 6,
        name: "Pemanas Ruangan",
        type: "heating",
        room: "Kantor Rumah",
        powerUsage: 1500,
        usageHours: 3,
        status: "active",
        energyEfficiency: 60
    },
    {
        id: 7,
        name: "Komputer",
        type: "other",
        room: "Kantor Rumah",
        powerUsage: 250,
        usageHours: 8,
        status: "active",
        energyEfficiency: 80
    },
    {
        id: 8,
        name: "Microwave",
        type: "kitchen",
        room: "Dapur",
        powerUsage: 1000,
        usageHours: 0.5,
        status: "inactive",
        energyEfficiency: 70
    }
];

// Objek status filter
const filterState = {
    searchTerm: '',
    roomFilter: 'all',
    viewMode: 'grid'
};

// Inisialisasi data perangkat dari localStorage atau data default
let appliancesData = [];

// Lacak perangkat mana yang sedang diedit (null saat menambahkan baru)
let editingApplianceId = null;

// Elemen DOM
const appliancesContainer = document.getElementById('appliancesContainer');
const searchInput = document.getElementById('searchAppliances');
const roomFilter = document.getElementById('roomFilter');
const viewOptions = document.querySelectorAll('.view-option');
const addApplianceBtn = document.getElementById('addApplianceBtn');
const applianceModal = document.getElementById('applianceModal');
const closeModalBtn = document.querySelector('.close-modal');
const cancelBtn = document.querySelector('.cancel-btn');
const applianceForm = document.getElementById('applianceForm');

// Status tampilan
let currentView = 'grid';
let filteredAppliances = [];

// Muat perangkat dari localStorage atau gunakan data default
function loadAppliances() {
    const storedAppliances = localStorage.getItem('appliances');
    if (storedAppliances) {
        appliancesData = JSON.parse(storedAppliances);
    } else {
        // Jika tidak ada data di localStorage, gunakan data default
        appliancesData = [...defaultAppliancesData];
        // Simpan data default ke localStorage
        saveAppliances();
    }
    
    // Muat status filter dari localStorage
    loadFilterState();
    
    // Terapkan filter yang disimpan
    applyFilterState();
}

// Simpan perangkat ke localStorage
function saveAppliances() {
    localStorage.setItem('appliances', JSON.stringify(appliancesData));
}

// Simpan status filter saat ini ke localStorage
function saveFilterState() {
    filterState.searchTerm = searchInput.value;
    filterState.roomFilter = roomFilter.value;
    filterState.viewMode = currentView;
    
    localStorage.setItem('applianceFilters', JSON.stringify(filterState));
}

// Muat status filter dari localStorage
function loadFilterState() {
    const savedFilters = localStorage.getItem('applianceFilters');
    if (savedFilters) {
        const savedState = JSON.parse(savedFilters);
        Object.assign(filterState, savedState);
        
        // Terapkan nilai yang disimpan ke elemen UI
        searchInput.value = filterState.searchTerm;
        roomFilter.value = filterState.roomFilter;
        currentView = filterState.viewMode;
        
        // Perbarui opsi tampilan aktif
        viewOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.view === currentView);
        });
    }
}

// Terapkan status filter saat ini untuk mendapatkan perangkat yang difilter
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

// Hasilkan ID unik untuk perangkat baru
function generateUniqueId() {
    const existingIds = appliancesData.map(appliance => appliance.id);
    let newId = 1;
    while (existingIds.includes(newId)) {
        newId++;
    }
    return newId;
}

// Siapkan event listener
function setupEventListeners() {
    // Fungsi pencarian
    searchInput.addEventListener('input', () => {
        filterAppliances();
        saveFilterState();
    });
    
    // Filter ruangan
    roomFilter.addEventListener('change', () => {
        filterAppliances();
        saveFilterState();
    });
    
    // Alih tampilan
    viewOptions.forEach(option => {
        option.addEventListener('click', () => {
            viewOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            currentView = option.dataset.view;
            saveFilterState();
            renderAppliances();
        });
    });
    
    // Kontrol modal
    addApplianceBtn.addEventListener('click', () => {
        // Reset form dan persiapkan untuk entri baru
        applianceForm.reset();
        // Atur judul modal ke mode Tambah
        document.querySelector('.modal-header h2').textContent = 'Tambah Perangkat Baru';
        // Hapus status pengeditan
        editingApplianceId = null;
        // Tampilkan modal
        applianceModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Mencegah guliran ketika modal terbuka
    });
    
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Tutup modal jika pengguna mengklik di luarnya
    applianceModal.addEventListener('click', (e) => {
        if (e.target === applianceModal) {
            closeModal();
        }
    });
    
    // Pengajuan form untuk menambah atau memperbarui perangkat
    applianceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Dapatkan nilai form
        const applianceData = {
            name: document.getElementById('applianceName').value.trim(),
            type: document.getElementById('applianceType').value,
            room: document.getElementById('applianceRoom').value.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            powerUsage: Number(document.getElementById('powerUsage').value),
            usageHours: Number(document.getElementById('usageHours').value),
            status: document.getElementById('applianceStatus').value
        };
        
        if (editingApplianceId === null) {
            // Menambahkan perangkat baru
            const newAppliance = {
                id: generateUniqueId(),
                ...applianceData,
                energyEfficiency: Math.round(Math.random() * 40) + 60 // Efisiensi acak antara 60-100%
            };
            
            // Tambahkan perangkat baru ke array data
            appliancesData.push(newAppliance);
        } else {
            // Memperbarui perangkat yang ada
            const applianceIndex = appliancesData.findIndex(a => a.id === editingApplianceId);
            if (applianceIndex !== -1) {
                // Pertahankan ID dan efisiensi energi
                const updatedAppliance = {
                    ...appliancesData[applianceIndex],
                    ...applianceData
                };
                
                // Perbarui perangkat dalam array
                appliancesData[applianceIndex] = updatedAppliance;
            }
        }
        
        // Simpan ke localStorage
        saveAppliances();
        
        // Terapkan filter untuk memperbarui perangkat yang difilter
        applyFilterState();
        
        // Render dengan filter saat ini yang diterapkan
        renderAppliances();
        
        // Tutup modal
        closeModal();
    });
}

// Tutup modal
function closeModal() {
    applianceModal.classList.remove('show');
    document.body.style.overflow = ''; // Kembalikan guliran
    applianceForm.reset(); // Reset formulir
    editingApplianceId = null; // Hapus status pengeditan
}

// Filter perangkat berdasarkan pencarian dan filter ruangan
function filterAppliances() {
    filterState.searchTerm = searchInput.value;
    filterState.roomFilter = roomFilter.value;
    
    applyFilterState();
    renderAppliances();
}

// Render perangkat berdasarkan tampilan dan filter saat ini
function renderAppliances() {
    if (currentView === 'grid') {
        renderGridView();
    } else {
        renderListView();
    }
}

// Render perangkat dalam tampilan grid
function renderGridView() {
    appliancesContainer.className = 'appliances-grid';
    
    if (filteredAppliances.length === 0) {
        appliancesContainer.innerHTML = `
            <div class="no-results">
                <p>Tidak ada perangkat ditemukan. Coba sesuaikan filter Anda atau tambahkan perangkat baru.</p>
            </div>
        `;
        return;
    }
    
    appliancesContainer.innerHTML = filteredAppliances.map(appliance => `
        <div class="appliance-card" data-id="${appliance.id}">
            <div class="status-indicator status-${appliance.status}" onclick="toggleStatus(${appliance.id})"></div>
            <h3>${appliance.name}</h3>
            <div class="appliance-info">
                <div class="info-row">
                    <span class="info-label">Jenis:</span>
                    <span class="info-value">${translateType(appliance.type)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Ruangan:</span>
                    <span class="info-value">${appliance.room}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Daya:</span>
                    <span class="info-value">${appliance.powerUsage} W</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Penggunaan Harian:</span>
                    <span class="info-value">${appliance.usageHours} jam</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="info-value">${translateStatus(appliance.status)}</span>
                </div>
            </div>
            <div class="energy-usage">
                <div class="info-row">
                    <span class="info-label">Efisiensi Energi:</span>
                    <span class="info-value">${appliance.energyEfficiency}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${appliance.energyEfficiency}%; 
                        background-color: ${getEfficiencyColor(appliance.energyEfficiency)};"></div>
                </div>
            </div>
            <div class="appliance-actions">
                <button class="action-btn edit-btn" data-id="${appliance.id}">Edit</button>
                <button class="action-btn delete-btn" data-id="${appliance.id}">Hapus</button>
            </div>
        </div>
    `).join('');
    
    // Tambahkan event listener untuk tombol edit dan hapus
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editAppliance(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteAppliance(btn.dataset.id));
    });
}

// Beralih status perangkat
function toggleStatus(applianceId) {
    const appliance = appliancesData.find(a => a.id === applianceId);
    if (appliance) {
        appliance.status = appliance.status === 'active' ? 'inactive' : 'active';
        saveAppliances();
        renderAppliances();
    }
}

// Render perangkat dalam tampilan daftar
function renderListView() {
    appliancesContainer.className = 'appliances-list';
    
    if (filteredAppliances.length === 0) {
        appliancesContainer.innerHTML = `
            <div class="no-results">
                <p>Tidak ada perangkat ditemukan. Coba sesuaikan filter Anda atau tambahkan perangkat baru.</p>
            </div>
        `;
        return;
    }
    
    // Buat baris header
    let listHTML = `
        <div class="appliance-row appliance-row-header">
            <div class="appliance-column">Perangkat</div>
            <div class="appliance-column room-column">Ruangan</div>
            <div class="appliance-column power-column">Daya</div>
            <div class="appliance-column usage-hours-column">Penggunaan (jam)</div>
            <div class="appliance-column status-column">Status</div>
            <div class="appliance-column">Tindakan</div>
        </div>
    `;
    
    // Buat baris data
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
                    <span>${translateStatus(appliance.status)}</span>
                </div>
            </div>
            <div class="appliance-column appliance-row-actions">
                <button class="action-btn edit-btn" data-id="${appliance.id}">Edit</button>
                <button class="action-btn delete-btn" data-id="${appliance.id}">Hapus</button>
            </div>
        </div>
    `).join('');
    
    appliancesContainer.innerHTML = listHTML;
    
    // Tambahkan event listener untuk tombol edit dan hapus
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editAppliance(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteAppliance(btn.dataset.id));
    });
}

// Edit perangkat - diterapkan
function editAppliance(id) {
    const applianceId = parseInt(id);
    const appliance = appliancesData.find(a => a.id === applianceId);
    
    if (!appliance) {
        console.error(`Perangkat dengan ID ${id} tidak ditemukan.`);
        return;
    }
    
    // Atur nilai form
    document.getElementById('applianceName').value = appliance.name;
    document.getElementById('applianceType').value = appliance.type;
    document.getElementById('applianceRoom').value = appliance.room.toLowerCase().replace(' ', '-');
    document.getElementById('powerUsage').value = appliance.powerUsage;
    document.getElementById('usageHours').value = appliance.usageHours;
    document.getElementById('applianceStatus').value = appliance.status;
    
    // Atur status pengeditan
    editingApplianceId = applianceId;
    
    // Atur judul modal ke mode Edit
    document.querySelector('.modal-header h2').textContent = 'Edit Perangkat';
    
    // Tampilkan modal
    applianceModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Cegah pengguliran
}

// Hapus perangkat - dengan persistensi filter
function deleteAppliance(id) {
    // Temukan perangkat berdasarkan ID
    const applianceId = parseInt(id);
    const applianceIndex = appliancesData.findIndex(a => a.id === applianceId);
    const applianceName = appliancesData[applianceIndex]?.name || 'perangkat ini';
    
    // Konfirmasi penghapusan
    if (confirm(`Apakah Anda yakin ingin menghapus ${applianceName}?`)) {
        // Hapus perangkat dari array
        if (applianceIndex !== -1) {
            appliancesData.splice(applianceIndex, 1);
            
            // Simpan data yang diperbarui ke localStorage
            saveAppliances();
            
            // Terapkan filter saat ini
            applyFilterState();
            
            // Render ulang UI dengan filter yang diterapkan
            renderAppliances();
        }
    }
}

// Fungsi pembantu untuk menerjemahkan jenis perangkat
function translateType(type) {
    const typeTranslations = {
        'lighting': 'Pencahayaan',
        'heating': 'Pemanas',
        'cooling': 'Pendingin',
        'kitchen': 'Dapur',
        'entertainment': 'Hiburan',
        'other': 'Lainnya'
    };
    
    return typeTranslations[type] || capitalizeFirstLetter(type);
}

// Fungsi pembantu untuk menerjemahkan status perangkat
function translateStatus(status) {
    return status === 'active' ? 'Aktif' : 'Non-aktif';
}

// Fungsi pembantu untuk mengkapitalisasi huruf pertama dari sebuah string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Fungsi pembantu untuk mendapatkan warna berdasarkan efisiensi
function getEfficiencyColor(efficiency) {
    if (efficiency >= 80) {
        return '#10b981'; // Hijau untuk efisiensi tinggi
    } else if (efficiency >= 60) {
        return '#fbbf24'; // Kuning untuk efisiensi menengah
    } else {
        return '#f87171'; // Merah untuk efisiensi rendah
    }
}

// Fungsi pembantu untuk mendapatkan ikon untuk jenis perangkat
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

// Perbarui lencana notifikasi di menu sidebar
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
        }
    }
}

// Inisialisasi halaman - tidak perlu DOMContentLoaded dengan atribut defer
loadAppliances();
renderAppliances();
setupEventListeners();

// Periksa notifikasi yang belum dibaca dan perbarui lencana
updateNotificationBadge();
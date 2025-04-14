// Data hadiah default - akan digunakan hanya jika localStorage kosong
const defaultRewards = [
    {
        id: 1,
        title: "Diskon Rp 100.000 Tagihan",
        description: "Dapatkan potongan Rp 100.000 untuk tagihan listrik berikutnya",
        points: 800,
        image: "discount", // Kita akan menggunakan ikon untuk ini
        badge: "popular",
        type: "discount",
        claimed: false,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 hari dari sekarang
    },
    {
        id: 2,
        title: "Steker Pintar",
        description: "Steker pintar dengan WiFi untuk memantau dan mengontrol perangkat Anda dari jarak jauh",
        points: 1500,
        image: "smartplug",
        badge: "new",
        type: "product",
        claimed: false,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() // 60 hari dari sekarang
    },
    {
        id: 3,
        title: "Audit Energi",
        description: "Audit energi rumah profesional untuk mengidentifikasi potensi penghematan energi",
        points: 2500,
        image: "audit",
        type: "service",
        claimed: false,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 hari dari sekarang
    },
    {
        id: 4,
        title: "Paket Lampu LED",
        description: "Paket 4 lampu LED hemat energi",
        points: 750,
        image: "ledbulb",
        badge: "popular",
        type: "product",
        claimed: false,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 hari dari sekarang
    },
    {
        id: 5,
        title: "Diskon Rp 250.000 Tagihan",
        description: "Dapatkan potongan Rp 250.000 untuk tagihan listrik berikutnya",
        points: 2000,
        image: "discount",
        type: "discount",
        claimed: false,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 hari dari sekarang
    },
    {
        id: 6,
        title: "Terminal Listrik Pintar",
        description: "Kontrol beberapa perangkat dan pantau penggunaan energi dengan terminal listrik pintar ini",
        points: 3500,
        image: "powerstrip",
        badge: "limited",
        type: "product",
        claimed: false,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 hari dari sekarang
    }
];

// Inisialisasi data hadiah dari localStorage atau data default
let rewardsData = [];
let userPoints = 1250; // Poin default
let filteredRewards = [];

// Elemen DOM
const rewardsContainer = document.getElementById('rewardsContainer');
const searchInput = document.getElementById('searchRewards');
const rewardsFilter = document.getElementById('rewardsFilter');
const totalPointsElement = document.getElementById('totalPoints');
const viewOptions = document.querySelectorAll('.view-option');
const rewardModal = document.getElementById('rewardModal');
const closeModalBtn = document.querySelector('.close-modal');
const cancelBtn = document.querySelector('.cancel-btn');
const confirmClaimBtn = document.getElementById('confirmClaimBtn');

// Status tampilan saat ini
let currentView = 'grid';

// Status filter
const filterState = {
    searchTerm: '',
    typeFilter: 'all'
};

// Muat hadiah dari localStorage atau gunakan data default
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
    
    // Perbarui UI dengan poin saat ini
    updatePointsDisplay();
}

// Simpan hadiah ke localStorage
function saveRewards() {
    localStorage.setItem('rewards', JSON.stringify(rewardsData));
}

// Simpan poin pengguna ke localStorage
function saveUserPoints() {
    localStorage.setItem('userPoints', userPoints.toString());
}

// Perbarui tampilan poin
function updatePointsDisplay() {
    totalPointsElement.textContent = userPoints.toLocaleString('id-ID');
}

// Terapkan filter untuk mendapatkan hadiah yang difilter
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
                // Anggap hadiah yang kedaluwarsa dalam 7 hari ke depan sebagai "segera berakhir"
                const expiryDate = new Date(reward.expiresAt);
                const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                matchesType = !reward.claimed && expiryDate <= sevenDaysFromNow;
            }
        }
        
        return matchesSearch && matchesType;
    });
}

// Dapatkan ikon untuk jenis hadiah
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

// Dapatkan label lencana
function getBadgeLabel(badge) {
    switch(badge) {
        case 'popular':
            return 'Populer';
        case 'new':
            return 'Baru';
        case 'limited':
            return 'Waktu Terbatas';
        default:
            return '';
    }
}

// Format tanggal kedaluwarsa
function formatExpiryDate(expiresAt) {
    const expiryDate = new Date(expiresAt);
    const today = new Date();
    const diffTime = Math.abs(expiryDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Berakhir besok';
    } else if (diffDays < 7) {
        return `Berakhir dalam ${diffDays} hari`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `Berakhir dalam ${weeks} ${weeks === 1 ? 'minggu' : 'minggu'}`;
    } else {
        return `Berakhir pada ${expiryDate.toLocaleDateString('id-ID')}`;
    }
}

// Render hadiah berdasarkan tampilan saat ini (grid atau daftar)
function renderRewards() {
    // Terapkan filter terlebih dahulu
    applyFilters();
    
    // Kosongkan kontainer
    rewardsContainer.innerHTML = '';
    
    // Periksa apakah ada hadiah untuk ditampilkan
    if (filteredRewards.length === 0) {
        rewardsContainer.innerHTML = `
            <div class="no-rewards">
                <p>Tidak ada hadiah ditemukan. Terus hemat energi untuk membuka lebih banyak hadiah!</p>
            </div>
        `;
        return;
    }
    
    // Atur class kontainer berdasarkan tampilan saat ini
    rewardsContainer.className = currentView === 'grid' ? 'rewards-grid' : 'rewards-list';
    
    // Render hadiah
    filteredRewards.forEach(reward => {
        const rewardElement = document.createElement('div');
        rewardElement.className = currentView === 'grid' ? 'reward-card' : 'reward-row';
        rewardElement.dataset.id = reward.id;
        
        // Periksa apakah hadiah memiliki lencana
        const badgeHtml = reward.badge ? 
            `<span class="reward-badge ${reward.badge}">${getBadgeLabel(reward.badge)}</span>` : '';
        
        // Periksa apakah hadiah telah diklaim
        const claimedHtml = reward.claimed ? 
            `<span class="reward-badge claimed">Diklaim</span>` : '';
        
        // Buat konten berdasarkan jenis tampilan
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
                            ${reward.points.toLocaleString('id-ID')}
                        </div>
                        ${!reward.claimed ? 
                            `<button class="claim-btn" ${userPoints < reward.points ? 'disabled' : ''}>
                                ${userPoints < reward.points ? 'Poin Kurang' : 'Klaim'}
                            </button>` :
                            '<span class="claimed-text">Diklaim</span>'
                        }
                    </div>
                </div>
            `;
        } else {
            // Tampilan daftar
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
                    ${reward.points.toLocaleString('id-ID')}
                </div>
                ${!reward.claimed ? 
                    `<button class="claim-btn" ${userPoints < reward.points ? 'disabled' : ''}>
                        ${userPoints < reward.points ? 'Poin Kurang' : 'Klaim'}
                    </button>` :
                    '<span class="claimed-text">Diklaim</span>'
                }
            `;
        }
        
        rewardsContainer.appendChild(rewardElement);
    });
    
    // Tambahkan event listener ke tombol klaim
    document.querySelectorAll('.claim-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const rewardCard = e.target.closest('.reward-card') || e.target.closest('.reward-row');
            if (rewardCard) {
                showRewardModal(rewardCard.dataset.id);
            }
        });
    });
}

// Tampilkan modal hadiah untuk mengklaim hadiah
function showRewardModal(rewardId) {
    const reward = rewardsData.find(r => r.id === parseInt(rewardId));
    
    if (!reward) return;
    
    // Isi modal dengan detail hadiah
    document.getElementById('modalRewardTitle').textContent = reward.title;
    document.getElementById('modalRewardDescription').textContent = reward.description;
    document.getElementById('modalRewardPoints').textContent = reward.points.toLocaleString('id-ID');
    
    // Atur gambar/ikon hadiah
    const modalRewardImage = document.getElementById('modalRewardImage');
    modalRewardImage.innerHTML = getRewardIcon(reward.image);
    
    // Simpan ID hadiah di tombol konfirmasi untuk referensi
    confirmClaimBtn.dataset.id = reward.id;
    
    // Nonaktifkan tombol konfirmasi jika pengguna tidak memiliki cukup poin
    if (userPoints < reward.points) {
        confirmClaimBtn.disabled = true;
        confirmClaimBtn.textContent = 'Poin Tidak Cukup';
    } else {
        confirmClaimBtn.disabled = false;
        confirmClaimBtn.textContent = 'Klaim Hadiah';
    }
    
    // Tampilkan modal
    rewardModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Cegah pengguliran
}

// Tutup modal hadiah
function closeModal() {
    rewardModal.classList.remove('show');
    document.body.style.overflow = ''; // Kembalikan pengguliran
}

// Klaim hadiah
function claimReward(rewardId) {
    const rewardIndex = rewardsData.findIndex(r => r.id === parseInt(rewardId));
    
    if (rewardIndex !== -1) {
        const reward = rewardsData[rewardIndex];
        
        // Pastikan pengguna memiliki cukup poin
        if (userPoints >= reward.points) {
            // Kurangi poin
            userPoints -= reward.points;
            
            // Tandai hadiah sebagai diklaim
            rewardsData[rewardIndex].claimed = true;
            
            // Buat notifikasi tentang hadiah yang diklaim
            createClaimNotification(reward);
            
            // Simpan perubahan
            saveRewards();
            saveUserPoints();
            
            // Perbarui tampilan poin
            updatePointsDisplay();
            
            // Render ulang hadiah
            renderRewards();
            
            // Tampilkan pesan sukses
            alert(`Selamat! Anda telah berhasil mengklaim "${reward.title}". Sisa poin Anda: ${userPoints}`);
        }
    }
    
    // Tutup modal
    closeModal();
}

// Buat notifikasi saat hadiah diklaim
function createClaimNotification(reward) {
    // Dapatkan notifikasi dari localStorage
    let notifications = [];
    const storedNotifications = localStorage.getItem('notifications');
    
    if (storedNotifications) {
        notifications = JSON.parse(storedNotifications);
    }
    
    // Buat notifikasi baru
    const newNotification = {
        id: Date.now(), // Gunakan timestamp sebagai ID
        title: "Hadiah Diklaim",
        message: `Anda telah berhasil mengklaim "${reward.title}" seharga ${reward.points} poin.`,
        type: "info",
        read: false,
        timestamp: new Date().toISOString()
    };
    
    // Tambahkan ke awal array (terbaru lebih dulu)
    notifications.unshift(newNotification);
    
    // Simpan ke localStorage
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // Perbarui lencana notifikasi di sidebar jika ada
    updateNotificationBadge();
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

// Siapkan event listener
function setupEventListeners() {
    // Fungsi pencarian
    searchInput.addEventListener('input', () => {
        filterState.searchTerm = searchInput.value;
        renderRewards();
    });
    
    // Filter berdasarkan jenis
    rewardsFilter.addEventListener('change', () => {
        filterState.typeFilter = rewardsFilter.value;
        renderRewards();
    });
    
    // Opsi tampilan (grid/daftar)
    viewOptions.forEach(option => {
        option.addEventListener('click', () => {
            currentView = option.dataset.view;
            
            // Perbarui class aktif
            viewOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Render ulang hadiah dengan tampilan baru
            renderRewards();
        });
    });
    
    // Tutup modal
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Tutup modal jika pengguna mengklik di luarnya
    rewardModal.addEventListener('click', (e) => {
        if (e.target === rewardModal) {
            closeModal();
        }
    });
    
    // Klaim hadiah
    confirmClaimBtn.addEventListener('click', () => {
        claimReward(confirmClaimBtn.dataset.id);
    });
}

// Inisialisasi halaman
loadRewards();
renderRewards();
setupEventListeners();
updateNotificationBadge();
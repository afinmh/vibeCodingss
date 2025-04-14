// Data notifikasi default - akan digunakan hanya jika localStorage kosong
const defaultNotifications = [
    {
        id: 1,
        title: "Selamat Datang di Dashboard Energi",
        message: "Terima kasih telah menggunakan dashboard energi kami. Anda dapat memantau penggunaan energi dan menerima notifikasi penting di sini.",
        type: "info",
        read: false,
        timestamp: new Date(Date.now() - 86400000).toISOString() // kemarin
    },
    {
        id: 2,
        title: "Penggunaan Energi Tinggi",
        message: "Penggunaan energi Anda 20% lebih tinggi dari biasanya. Periksa perangkat Anda untuk melihat apa yang mungkin menyebabkan peningkatan ini.",
        type: "warning",
        read: false,
        timestamp: new Date(Date.now() - 43200000).toISOString() // 12 jam yang lalu
    },
    {
        id: 3,
        title: "Lampu Kamar Tidur Masih Menyala",
        message: "Lampu kamar tidur Anda telah menyala selama lebih dari 8 jam. Pertimbangkan untuk mematikannya untuk menghemat energi.",
        type: "danger",
        read: false,
        timestamp: new Date(Date.now() - 7200000).toISOString() // 2 jam yang lalu
    }
];

// Inisialisasi data notifikasi dari localStorage atau data default
let notificationsData = [];

// Elemen DOM
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

// Status filter
const filterState = {
    searchTerm: '',
    typeFilter: 'all'
};

// Notifikasi yang difilter
let filteredNotifications = [];

// Muat notifikasi dari localStorage atau gunakan data default
function loadNotifications() {
    const storedNotifications = localStorage.getItem('notifications');
    
    if (storedNotifications) {
        notificationsData = JSON.parse(storedNotifications);
    } else {
        // Jika tidak ada data di localStorage, gunakan data default
        notificationsData = [...defaultNotifications];
        // Simpan data default ke localStorage
        saveNotifications();
    }
    
    // Urutkan notifikasi berdasarkan timestamp (terbaru lebih dulu)
    notificationsData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Terapkan filter default
    applyFilters();
}

// Simpan notifikasi ke localStorage
function saveNotifications() {
    localStorage.setItem('notifications', JSON.stringify(notificationsData));
}

// Terapkan filter untuk mendapatkan notifikasi yang difilter
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

// Perbarui tampilan jumlah yang belum dibaca
function updateUnreadCount() {
    const unreadCount = notificationsData.filter(notification => !notification.read).length;
    unreadCountElement.textContent = unreadCount;
    
    // Perbarui judul di tab notifikasi
    document.title = unreadCount > 0 
        ? `(${unreadCount}) Notifikasi - Dashboard Energi` 
        : 'Notifikasi - Dashboard Energi';
}

// Siapkan event listener
function setupEventListeners() {
    // Fungsi pencarian
    searchInput.addEventListener('input', () => {
        filterState.searchTerm = searchInput.value;
        applyFilters();
        renderNotifications();
    });
    
    // Filter berdasarkan jenis
    notificationFilter.addEventListener('change', () => {
        filterState.typeFilter = notificationFilter.value;
        applyFilters();
        renderNotifications();
    });
    
    // Tandai semua sebagai dibaca
    markAllReadBtn.addEventListener('click', markAllAsRead);
    
    // Tombol notifikasi uji
    createTestNotifBtn.addEventListener('click', () => {
        notificationModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Cegah pengguliran
    });
    
    // Tutup modal
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Tutup modal jika pengguna mengklik di luarnya
    notificationModal.addEventListener('click', (e) => {
        if (e.target === notificationModal) {
            closeModal();
        }
    });
    
    // Buat formulir notifikasi uji
    notificationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        createTestNotification();
    });
}

// Tutup modal
function closeModal() {
    notificationModal.classList.remove('show');
    document.body.style.overflow = ''; // Kembalikan pengguliran
    notificationForm.reset(); // Reset formulir
}

// Buat notifikasi uji
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
    
    // Tambahkan ke awal array (terbaru lebih dulu)
    notificationsData.unshift(newNotification);
    
    // Simpan ke localStorage
    saveNotifications();
    
    // Terapkan filter
    applyFilters();
    
    // Render notifikasi
    renderNotifications();
    
    // Perbarui jumlah yang belum dibaca
    updateUnreadCount();
    
    // Tutup modal
    closeModal();
}

// Hasilkan ID unik untuk notifikasi baru
function generateUniqueId() {
    const existingIds = notificationsData.map(notification => notification.id);
    let newId = 1;
    while (existingIds.includes(newId)) {
        newId++;
    }
    return newId;
}

// Tandai notifikasi sebagai dibaca
function markAsRead(id) {
    const notificationIndex = notificationsData.findIndex(n => n.id === parseInt(id));
    
    if (notificationIndex !== -1) {
        notificationsData[notificationIndex].read = true;
        
        // Simpan ke localStorage
        saveNotifications();
        
        // Terapkan filter
        applyFilters();
        
        // Render notifikasi
        renderNotifications();
        
        // Perbarui jumlah yang belum dibaca
        updateUnreadCount();
    }
}

// Tandai semua notifikasi sebagai dibaca
function markAllAsRead() {
    // Tandai semua notifikasi sebagai dibaca
    notificationsData.forEach(notification => {
        notification.read = true;
    });
    
    // Simpan ke localStorage
    saveNotifications();
    
    // Terapkan filter
    applyFilters();
    
    // Render notifikasi
    renderNotifications();
    
    // Perbarui jumlah yang belum dibaca
    updateUnreadCount();
}

// Hapus notifikasi
function deleteNotification(id) {
    const notificationIndex = notificationsData.findIndex(n => n.id === parseInt(id));
    
    if (notificationIndex !== -1) {
        // Konfirmasi penghapusan
        if (confirm("Apakah Anda yakin ingin menghapus notifikasi ini?")) {
            // Hapus notifikasi
            notificationsData.splice(notificationIndex, 1);
            
            // Simpan ke localStorage
            saveNotifications();
            
            // Terapkan filter
            applyFilters();
            
            // Render notifikasi
            renderNotifications();
            
            // Perbarui jumlah yang belum dibaca
            updateUnreadCount();
        }
    }
}

// Render notifikasi
function renderNotifications() {
    // Kosongkan kontainer
    notificationsContainer.innerHTML = '';
    
    // Periksa apakah ada notifikasi untuk ditampilkan
    if (filteredNotifications.length === 0) {
        notificationsContainer.innerHTML = `
            <div class="no-notifications">
                <p>Tidak ada notifikasi ditemukan. Notifikasi tentang penggunaan energi dan perangkat Anda akan muncul di sini.</p>
            </div>
        `;
        return;
    }
    
    // Render setiap notifikasi
    filteredNotifications.forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification-item ${notification.type} ${notification.read ? '' : 'unread'}`;
        notificationElement.dataset.id = notification.id;
        
        // Format tanggal
        const timestamp = new Date(notification.timestamp);
        const formattedDate = formatTimestamp(timestamp);
        
        let badgeText = 'Info';
        if (notification.type === 'warning') badgeText = 'Peringatan';
        if (notification.type === 'danger') badgeText = 'Penting';
        
        notificationElement.innerHTML = `
            <div class="notification-header">
                <h3 class="notification-title">${notification.title}</h3>
                <span class="notification-badge badge-${notification.type}">${badgeText}</span>
            </div>
            <p class="notification-message">${notification.message}</p>
            <div class="notification-time">${formattedDate}</div>
            <div class="notification-actions">
                ${!notification.read ? `<button class="notification-btn read-btn" data-id="${notification.id}">Tandai Dibaca</button>` : ''}
                <button class="notification-btn delete-btn" data-id="${notification.id}">Hapus</button>
            </div>
        `;
        
        notificationsContainer.appendChild(notificationElement);
    });
    
    // Tambahkan event listener untuk tombol
    document.querySelectorAll('.read-btn').forEach(btn => {
        btn.addEventListener('click', () => markAsRead(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteNotification(btn.dataset.id));
    });
}

// Format timestamp ke format yang mudah dibaca
function formatTimestamp(timestamp) {
    const now = new Date();
    const diffTime = Math.abs(now - timestamp);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffMinutes < 60) {
        return diffMinutes === 0 ? 'Baru saja' : `${diffMinutes} menit yang lalu`;
    } else if (diffHours < 24) {
        return `${diffHours} jam yang lalu`;
    } else if (diffDays < 7) {
        return `${diffDays} hari yang lalu`;
    } else {
        return timestamp.toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Tambahkan notifikasi otomatis berdasarkan data perangkat
function checkForAutomaticNotifications() {
    // Fungsi ini akan memeriksa data perangkat dan penggunaan energi
    // untuk secara otomatis menghasilkan notifikasi saat diperlukan
    
    // Misalnya, jika perangkat telah aktif terlalu lama,
    // atau jika penggunaan energi melebihi ambang batas
    
    // Untuk contoh ini, kita akan mensimulasikan dengan notifikasi acak sesekali
    if (Math.random() < 0.2) { // 20% kemungkinan membuat notifikasi
        const notificationTypes = [
            {
                title: "Peringatan Penggunaan Energi",
                message: "Konsumsi energi Anda lebih tinggi dari biasanya hari ini. Pertimbangkan untuk menyesuaikan termostat Anda.",
                type: "warning"
            },
            {
                title: "Perangkat Masih Menyala",
                message: "Lampu dapur Anda telah menyala dalam waktu yang lama. Pertimbangkan untuk mematikannya untuk menghemat energi.",
                type: "danger"
            },
            {
                title: "Peluang Penghematan Energi",
                message: "Mengurangi pemanas Anda sebesar 1 derajat dapat menghemat hingga 10% tagihan energi Anda.",
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
        
        // Tambahkan ke awal array (terbaru lebih dulu)
        notificationsData.unshift(newNotification);
        
        // Simpan ke localStorage
        saveNotifications();
        
        // Terapkan filter
        applyFilters();
        
        // Render notifikasi
        renderNotifications();
        
        // Perbarui jumlah yang belum dibaca
        updateUnreadCount();
    }
}

// Perbarui menu navigasi di halaman lain untuk menampilkan jumlah yang belum dibaca
function updateNavNotificationCount() {
    // Fungsi ini akan dipanggil dari semua halaman untuk memperbarui ikon notifikasi
    // di sidebar dengan jumlah yang belum dibaca saat ini
    const unreadCount = notificationsData.filter(notification => !notification.read).length;
    
    if (unreadCount > 0) {
        // Tambahkan lencana ke item menu notifikasi
        const notificationMenuItem = document.querySelector('.menu a[href="notifications.html"] .icon');
        if (notificationMenuItem) {
            notificationMenuItem.innerHTML = `🔔 <span class="badge">${unreadCount}</span>`;
        }
    }
}

// Inisialisasi halaman - tidak perlu DOMContentLoaded dengan atribut defer
loadNotifications();
renderNotifications();
updateUnreadCount();
setupEventListeners();

// Periksa untuk notifikasi otomatis setiap 30 detik
// Ini hanya untuk tujuan demonstrasi - dalam aplikasi nyata Anda mungkin melakukan ini
// berdasarkan data real-time atau ketika pengguna melakukan tindakan tertentu
setInterval(checkForAutomaticNotifications, 30000);
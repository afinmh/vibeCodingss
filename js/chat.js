// Dapatkan elemen DOM
const chatPopup = document.getElementById('chatPopup');
const chatHeader = document.getElementById('chatHeader');
const chatToggleBtn = document.getElementById('chatToggleBtn');
const chatCloseBtn = document.getElementById('chatCloseBtn');
const chatCollapseBtn = document.getElementById('chatCollapseBtn');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatBody = document.getElementById('chatBody');

// Penyimpanan kredensial API
const apiKeyStorageKey = 'mistralApiKey';

// Prompt sistem default untuk asisten listrik
const defaultSystemPrompt = `Kamu adalah asisten listrik untuk dashboard energi rumah pintar.
Peranmu adalah membantu pengguna memahami penggunaan energi mereka, memberikan tips untuk penghematan energi, 
menjawab pertanyaan tentang perangkat mereka, dan menyarankan cara untuk mengurangi tagihan listrik mereka.
Bersikaplah ramah, membantu, dan berikan saran spesifik bila memungkinkan.
Dasarkan tanggapanmu pada prinsip penghematan energi umum dan pengelolaan energi rumah pintar.`;

// Periksa apakah kunci API diatur
const hasApiKey = Boolean(localStorage.getItem(apiKeyStorageKey));

// Tambahkan tombol pengaturan ke header chat
const chatControls = document.querySelector('.chat-controls');
const settingsBtn = document.createElement('button');
settingsBtn.id = 'chatSettingsBtn';
settingsBtn.className = 'chat-control-btn';
settingsBtn.innerHTML = '⚙️';
settingsBtn.title = 'Pengaturan API';
chatControls.insertBefore(settingsBtn, chatControls.firstChild);

// Event klik tombol pengaturan
settingsBtn.addEventListener('click', showApiSettings);

// Periksa penyimpanan lokal untuk status visibilitas chat
const isChatVisible = localStorage.getItem('chatVisible') === 'true';
const isChatCollapsed = localStorage.getItem('chatCollapsed') === 'true';

// Atur visibilitas awal berdasarkan status tersimpan
if (isChatVisible) {
    chatPopup.style.display = 'flex';
    chatToggleBtn.classList.add('hidden');
    
    if (isChatCollapsed) {
        chatPopup.classList.add('collapsed');
    }
} else {
    chatPopup.style.display = 'none';
    chatToggleBtn.classList.remove('hidden');
}

// Beralih popup chat saat tombol alih diklik
chatToggleBtn.addEventListener('click', () => {
    chatPopup.style.display = 'flex';
    chatToggleBtn.classList.add('hidden');
    localStorage.setItem('chatVisible', 'true');
    
    // Muat pesan chat dari localStorage
    loadChatMessages();
    
    // Periksa apakah kunci API diatur
    if (!hasApiKey) {
        setTimeout(showApiSettings, 1000);
    }
});

// Tutup popup chat
chatCloseBtn.addEventListener('click', () => {
    chatPopup.style.display = 'none';
    chatToggleBtn.classList.remove('hidden');
    localStorage.setItem('chatVisible', 'false');
});

// Ciutkan/perluas popup chat
chatCollapseBtn.addEventListener('click', () => {
    chatPopup.classList.toggle('collapsed');
    
    // Perbarui ikon berdasarkan status
    const isCollapsed = chatPopup.classList.contains('collapsed');
    chatCollapseBtn.textContent = isCollapsed ? '🔽' : '🔼';
    localStorage.setItem('chatCollapsed', isCollapsed.toString());
});

// Beralih popup chat saat header diklik
chatHeader.addEventListener('click', (e) => {
    // Cegah beralih saat mengklik tombol kontrol
    if (!e.target.closest('.chat-controls')) {
        chatPopup.classList.toggle('collapsed');
        
        // Perbarui ikon berdasarkan status
        const isCollapsed = chatPopup.classList.contains('collapsed');
        chatCollapseBtn.textContent = isCollapsed ? '🔽' : '🔼';
        localStorage.setItem('chatCollapsed', isCollapsed.toString());
    }
});

// Kirim pesan saat mengklik tombol kirim
chatSendBtn.addEventListener('click', sendMessage);

// Kirim pesan saat menekan Enter di bidang input
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Tampilkan modal pengaturan API
function showApiSettings() {
    // Buat modal jika belum ada
    let apiModal = document.getElementById('apiSettingsModal');
    
    if (!apiModal) {
        apiModal = document.createElement('div');
        apiModal.id = 'apiSettingsModal';
        apiModal.className = 'modal';
        
        const currentApiKey = localStorage.getItem(apiKeyStorageKey) || '';
        
        apiModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Pengaturan API</h2>
                    <span class="close-modal" id="closeApiModal">&times;</span>
                </div>
                <form id="apiSettingsForm">
                    <div class="form-group">
                        <label for="apiKey">Kunci API Mistral</label>
                        <input type="password" id="apiKey" value="${currentApiKey}" required>
                        <small>Dapatkan kunci API Anda dari <a href="https://mistral.ai" target="_blank">Mistral AI</a></small>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="cancel-btn" id="cancelApiSettings">Batal</button>
                        <button type="submit" class="save-btn">Simpan</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(apiModal);
        
        // Tambahkan event listener untuk modal
        document.getElementById('closeApiModal').addEventListener('click', () => {
            apiModal.classList.remove('show');
        });
        
        document.getElementById('cancelApiSettings').addEventListener('click', () => {
            apiModal.classList.remove('show');
        });
        
        document.getElementById('apiSettingsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const apiKey = document.getElementById('apiKey').value.trim();
            
            if (apiKey) {
                localStorage.setItem(apiKeyStorageKey, apiKey);
                addSystemMessage("Kunci API disimpan. Anda sekarang dapat mengobrol dengan asisten energi Anda!");
            } else {
                localStorage.removeItem(apiKeyStorageKey);
            }
            
            apiModal.classList.remove('show');
        });
    }
    
    // Tampilkan modal
    apiModal.classList.add('show');
}

// Fungsi untuk menambahkan pesan sistem (gaya berbeda)
function addSystemMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message system';
    messageDiv.textContent = text;
    chatBody.appendChild(messageDiv);
    
    // Gulir ke bawah
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Muat pesan chat dari localStorage
function loadChatMessages() {
    // Hapus pesan yang ada terlebih dahulu
    chatBody.innerHTML = '';
    
    // Dapatkan pesan dari localStorage
    const storedMessages = localStorage.getItem('chatMessages');
    let messages = [];
    
    if (storedMessages) {
        messages = JSON.parse(storedMessages);
        
        // Render pesan
        messages.forEach(message => {
            addMessageToUI(message.text, message.sender);
        });
    } else {
        // Tambahkan pesan selamat datang jika tidak ada pesan
        addWelcomeMessage();
    }
}

// Fungsi untuk menambahkan pesan selamat datang
function addWelcomeMessage() {
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'welcome-message';
    welcomeDiv.innerHTML = `
        <p>👋 Halo! Saya adalah Asisten Energi Anda.</p>
        <p>Ada yang bisa saya bantu hari ini?</p>
    `;
    chatBody.appendChild(welcomeDiv);
    
    // Tambahkan pesan AI awal
    setTimeout(() => {
        addMessage('Tanyakan apa saja tentang penggunaan energi, perangkat, atau cara menghemat energi!', 'ai');
        
        // Jika tidak ada kunci API yang diatur, beri tahu pengguna
        if (!localStorage.getItem(apiKeyStorageKey)) {
            setTimeout(() => {
                addSystemMessage('⚠️ Silakan atur kunci API Mistral di pengaturan untuk mengaktifkan respons AI');
            }, 1000);
        }
    }, 1000);
}

// Fungsi untuk menambahkan pesan ke localStorage dan UI
function addMessage(text, sender) {
    // Simpan pesan ke localStorage
    saveMessageToStorage(text, sender);
    
    // Tambahkan ke UI
    addMessageToUI(text, sender);
}

// Fungsi untuk menyimpan pesan ke localStorage
function saveMessageToStorage(text, sender) {
    // Dapatkan pesan yang ada
    const storedMessages = localStorage.getItem('chatMessages');
    let messages = [];
    
    if (storedMessages) {
        messages = JSON.parse(storedMessages);
    }
    
    // Tambahkan pesan baru dengan timestamp
    messages.push({
        text: text,
        sender: sender,
        timestamp: new Date().toISOString()
    });
    
    // Simpan kembali ke localStorage
    localStorage.setItem('chatMessages', JSON.stringify(messages));
}

// Fungsi untuk menambahkan pesan ke UI saja
function addMessageToUI(text, sender) {
    // Hapus pesan selamat datang jika ada
    const welcomeMessage = chatBody.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.textContent = text;
    chatBody.appendChild(messageDiv);
    
    // Gulir ke bawah
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Fungsi untuk menambahkan indikator loading saat menunggu respons AI
function showLoadingIndicator() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-message ai loading';
    loadingDiv.id = 'aiLoading';
    loadingDiv.textContent = 'Berpikir...';
    chatBody.appendChild(loadingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Animasi titik-titik
    let dots = 0;
    const loadingInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        loadingDiv.textContent = 'Berpikir' + '.'.repeat(dots);
    }, 500);
    
    return {
        remove: () => {
            clearInterval(loadingInterval);
            loadingDiv.remove();
        }
    };
}

// Dapatkan riwayat chat untuk konteks API Mistral
function getChatHistory() {
    const storedMessages = localStorage.getItem('chatMessages');
    let messages = [];
    
    if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        
        // Konversi ke format Mistral (lewati pesan sistem)
        messages = parsedMessages
            .filter(msg => msg.sender !== 'system')
            .map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            }));
    }
    
    return messages;
}

// Panggil API Mistral untuk penyelesaian chat
async function callMistralAPI(userMessage) {
    const apiKey = localStorage.getItem(apiKeyStorageKey);
    
    if (!apiKey) {
        return "Silakan atur kunci API Mistral di pengaturan untuk mengaktifkan respons AI";
    }
    
    try {
        // Dapatkan riwayat chat
        const messages = getChatHistory();
        
        // Siapkan permintaan
        const requestBody = {
            model: "mistral-small",
            messages: [
                { role: "system", content: defaultSystemPrompt },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 800
        };
        
        // Buat panggilan API
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Kesalahan API Mistral:', errorData);
            return `Kesalahan: ${errorData.error?.message || 'Gagal mendapatkan respons dari Mistral AI'}`;
        }
        
        const data = await response.json();
        
        // Kembalikan respons AI
        return data.choices[0].message.content.trim();
        
    } catch (error) {
        console.error('Kesalahan memanggil API Mistral:', error);
        return "Maaf, terjadi kesalahan saat menghubungkan ke layanan AI. Silakan coba lagi nanti.";
    }
}

// Fungsi untuk mengirim pesan
async function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        // Tambahkan pesan pengguna
        addMessage(message, 'user');
        
        // Bersihkan input
        chatInput.value = '';
        
        // Tampilkan indikator loading
        const loading = showLoadingIndicator();
        
        try {
            // Dapatkan respons API
            const apiKey = localStorage.getItem(apiKeyStorageKey);
            
            if (!apiKey) {
                loading.remove();
                addSystemMessage('⚠️ Silakan atur kunci API Mistral di pengaturan untuk mengaktifkan respons AI');
                return;
            }
            
            const aiResponse = await callMistralAPI(message);
            
            // Hapus indikator loading
            loading.remove();
            
            // Tambahkan respons AI
            addMessage(aiResponse, 'ai');
            
        } catch (error) {
            console.error('Kesalahan mendapatkan respons AI:', error);
            loading.remove();
            addMessage("Maaf, saya mengalami kesalahan. Silakan coba lagi nanti.", 'ai');
        }
    }
}

// Jika chat terlihat dan tidak diciutkan, muat pesan
if (isChatVisible && !isChatCollapsed) {
    loadChatMessages();
}

// Tambahkan metode kenyamanan untuk menghapus riwayat chat
window.clearChatHistory = function() {
    localStorage.removeItem('chatMessages');
    chatBody.innerHTML = '';
    addWelcomeMessage();
    alert('Riwayat chat telah dihapus!');
};

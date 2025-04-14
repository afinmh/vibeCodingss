document.addEventListener('DOMContentLoaded', () => {
    const chatPopup = document.getElementById('chatPopup');
    const chatHeader = document.getElementById('chatHeader');
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const chatCloseBtn = document.getElementById('chatCloseBtn');
    const chatCollapseBtn = document.getElementById('chatCollapseBtn');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatBody = document.getElementById('chatBody');

    // Check local storage for chat visibility state
    const isChatVisible = localStorage.getItem('chatVisible') === 'true';
    const isChatCollapsed = localStorage.getItem('chatCollapsed') === 'true';

    // Set initial visibility based on stored state
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

    // Toggle chat popup when the toggle button is clicked
    chatToggleBtn.addEventListener('click', () => {
        chatPopup.style.display = 'flex';
        chatToggleBtn.classList.add('hidden');
        localStorage.setItem('chatVisible', 'true');
        
        // Load chat messages from localStorage
        loadChatMessages();
    });

    // Close chat popup
    chatCloseBtn.addEventListener('click', () => {
        chatPopup.style.display = 'none';
        chatToggleBtn.classList.remove('hidden');
        localStorage.setItem('chatVisible', 'false');
    });

    // Collapse/expand chat popup
    chatCollapseBtn.addEventListener('click', () => {
        chatPopup.classList.toggle('collapsed');
        
        // Update icon based on state
        const isCollapsed = chatPopup.classList.contains('collapsed');
        chatCollapseBtn.textContent = isCollapsed ? '🔽' : '🔼';
        localStorage.setItem('chatCollapsed', isCollapsed.toString());
    });

    // Toggle chat popup when the header is clicked
    chatHeader.addEventListener('click', (e) => {
        // Prevent toggle when clicking on control buttons
        if (!e.target.closest('.chat-controls')) {
            chatPopup.classList.toggle('collapsed');
            
            // Update icon based on state
            const isCollapsed = chatPopup.classList.contains('collapsed');
            chatCollapseBtn.textContent = isCollapsed ? '🔽' : '🔼';
            localStorage.setItem('chatCollapsed', isCollapsed.toString());
        }
    });

    // Send message when clicking the send button
    chatSendBtn.addEventListener('click', sendMessage);

    // Send message when pressing Enter in the input field
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Load chat messages from localStorage
    function loadChatMessages() {
        // Clear existing messages first
        chatBody.innerHTML = '';
        
        // Get messages from localStorage
        const storedMessages = localStorage.getItem('chatMessages');
        let messages = [];
        
        if (storedMessages) {
            messages = JSON.parse(storedMessages);
            
            // Render the messages
            messages.forEach(message => {
                addMessageToUI(message.text, message.sender);
            });
        } else {
            // Add welcome message if no messages exist
            addWelcomeMessage();
        }
    }

    // Function to add welcome message
    function addWelcomeMessage() {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'welcome-message';
        welcomeDiv.innerHTML = `
            <p>👋 Hi there! I'm your Energy Assistant.</p>
            <p>How can I help you today?</p>
        `;
        chatBody.appendChild(welcomeDiv);
        
        // Add initial AI message
        setTimeout(() => {
            addMessage('Ask me anything about your energy usage, appliances, or how to save energy!', 'ai');
        }, 1000);
    }

    // Function to add a message to localStorage and UI
    function addMessage(text, sender) {
        // Save message to localStorage
        saveMessageToStorage(text, sender);
        
        // Add to UI
        addMessageToUI(text, sender);
    }
    
    // Function to save a message to localStorage
    function saveMessageToStorage(text, sender) {
        // Get existing messages
        const storedMessages = localStorage.getItem('chatMessages');
        let messages = [];
        
        if (storedMessages) {
            messages = JSON.parse(storedMessages);
        }
        
        // Add new message with timestamp
        messages.push({
            text: text,
            sender: sender,
            timestamp: new Date().toISOString()
        });
        
        // Save back to localStorage
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }

    // Function to add a message to the UI only
    function addMessageToUI(text, sender) {
        // Remove welcome message if it exists
        const welcomeMessage = chatBody.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.textContent = text;
        chatBody.appendChild(messageDiv);
        
        // Scroll to the bottom
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Function to send a message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, 'user');
            
            // Clear input
            chatInput.value = '';
            
            // This is where you would integrate with an actual AI service
            // For now, we'll just show a placeholder response
            setTimeout(() => {
                addMessage("I'm just a placeholder response. The AI implementation will be added later.", 'ai');
            }, 1000);
        }
    }

    // If chat is visible and not collapsed, load messages
    if (isChatVisible && !isChatCollapsed) {
        loadChatMessages();
    }
    
    // Add a convenience method to clear chat history
    window.clearChatHistory = function() {
        localStorage.removeItem('chatMessages');
        chatBody.innerHTML = '';
        addWelcomeMessage();
        alert('Chat history has been cleared!');
    };
});

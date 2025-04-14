// Get DOM elements
const chatPopup = document.getElementById('chatPopup');
const chatHeader = document.getElementById('chatHeader');
const chatToggleBtn = document.getElementById('chatToggleBtn');
const chatCloseBtn = document.getElementById('chatCloseBtn');
const chatCollapseBtn = document.getElementById('chatCollapseBtn');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatBody = document.getElementById('chatBody');

// API credentials storage
const apiKeyStorageKey = 'mistralApiKey';

// Default system prompt for electricity assistant
const defaultSystemPrompt = `You are an electricity assistant for a smart home energy dashboard.
Your role is to help users understand their energy usage, provide tips for energy conservation, 
answer questions about their appliances, and suggest ways to reduce their electricity bills.
Be friendly, helpful, and provide specific advice when possible.
Base your responses on common energy-saving principles and smart home energy management.`;

// Check if API key is set
const hasApiKey = Boolean(localStorage.getItem(apiKeyStorageKey));

// Add settings button to chat header
const chatControls = document.querySelector('.chat-controls');
const settingsBtn = document.createElement('button');
settingsBtn.id = 'chatSettingsBtn';
settingsBtn.className = 'chat-control-btn';
settingsBtn.innerHTML = '⚙️';
settingsBtn.title = 'API Settings';
chatControls.insertBefore(settingsBtn, chatControls.firstChild);

// Settings button click event
settingsBtn.addEventListener('click', showApiSettings);

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
    
    // Check if API key is set
    if (!hasApiKey) {
        setTimeout(showApiSettings, 1000);
    }
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

// Show API settings modal
function showApiSettings() {
    // Create modal if it doesn't exist
    let apiModal = document.getElementById('apiSettingsModal');
    
    if (!apiModal) {
        apiModal = document.createElement('div');
        apiModal.id = 'apiSettingsModal';
        apiModal.className = 'modal';
        
        const currentApiKey = localStorage.getItem(apiKeyStorageKey) || '';
        
        apiModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>API Settings</h2>
                    <span class="close-modal" id="closeApiModal">&times;</span>
                </div>
                <form id="apiSettingsForm">
                    <div class="form-group">
                        <label for="apiKey">Mistral API Key</label>
                        <input type="password" id="apiKey" value="${currentApiKey}" required>
                        <small>Get your API key from <a href="https://mistral.ai" target="_blank">Mistral AI</a></small>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="cancel-btn" id="cancelApiSettings">Cancel</button>
                        <button type="submit" class="save-btn">Save</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(apiModal);
        
        // Add event listeners for the modal
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
                addSystemMessage("API key saved. You can now chat with your energy assistant!");
            } else {
                localStorage.removeItem(apiKeyStorageKey);
            }
            
            apiModal.classList.remove('show');
        });
    }
    
    // Show the modal
    apiModal.classList.add('show');
}

// Function to add a system message (different styling)
function addSystemMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message system';
    messageDiv.textContent = text;
    chatBody.appendChild(messageDiv);
    
    // Scroll to the bottom
    chatBody.scrollTop = chatBody.scrollHeight;
}

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
        
        // If no API key is set, prompt the user
        if (!localStorage.getItem(apiKeyStorageKey)) {
            setTimeout(() => {
                addSystemMessage('⚠️ Please set your Mistral API key in the settings to enable AI responses');
            }, 1000);
        }
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

// Function to add a loading indicator while waiting for the AI response
function showLoadingIndicator() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-message ai loading';
    loadingDiv.id = 'aiLoading';
    loadingDiv.textContent = 'Thinking...';
    chatBody.appendChild(loadingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Animate the dots
    let dots = 0;
    const loadingInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        loadingDiv.textContent = 'Thinking' + '.'.repeat(dots);
    }, 500);
    
    return {
        remove: () => {
            clearInterval(loadingInterval);
            loadingDiv.remove();
        }
    };
}

// Get chat history for Mistral API context
function getChatHistory() {
    const storedMessages = localStorage.getItem('chatMessages');
    let messages = [];
    
    if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        
        // Convert to Mistral format (skip system messages)
        messages = parsedMessages
            .filter(msg => msg.sender !== 'system')
            .map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            }));
    }
    
    return messages;
}

// Call Mistral API for chat completions
async function callMistralAPI(userMessage) {
    const apiKey = localStorage.getItem(apiKeyStorageKey);
    
    if (!apiKey) {
        return "Please set your Mistral API key in the settings to enable AI responses";
    }
    
    try {
        // Get chat history
        const messages = getChatHistory();
        
        // Prepare the request
        const requestBody = {
            model: "mistral-small",
            messages: [
                { role: "system", content: defaultSystemPrompt },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 800
        };
        
        // Make the API call
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
            console.error('Mistral API error:', errorData);
            return `Error: ${errorData.error?.message || 'Failed to get response from Mistral AI'}`;
        }
        
        const data = await response.json();
        
        // Return the AI response
        return data.choices[0].message.content.trim();
        
    } catch (error) {
        console.error('Error calling Mistral API:', error);
        return "Sorry, there was an error connecting to the AI service. Please try again later.";
    }
}

// Function to send a message
async function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        // Add user message
        addMessage(message, 'user');
        
        // Clear input
        chatInput.value = '';
        
        // Show loading indicator
        const loading = showLoadingIndicator();
        
        try {
            // Get API response
            const apiKey = localStorage.getItem(apiKeyStorageKey);
            
            if (!apiKey) {
                loading.remove();
                addSystemMessage('⚠️ Please set your Mistral API key in the settings to enable AI responses');
                return;
            }
            
            const aiResponse = await callMistralAPI(message);
            
            // Remove loading indicator
            loading.remove();
            
            // Add AI response
            addMessage(aiResponse, 'ai');
            
        } catch (error) {
            console.error('Error getting AI response:', error);
            loading.remove();
            addMessage("Sorry, I encountered an error. Please try again later.", 'ai');
        }
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

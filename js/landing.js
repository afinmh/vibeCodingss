// Landing page JavaScript functionality

// Modal functionality
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openSignupModal() {
    document.getElementById('signupModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeSignupModal() {
    document.getElementById('signupModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function switchToSignup() {
    closeLoginModal();
    openSignupModal();
}

function switchToLogin() {
    closeSignupModal();
    openLoginModal();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === signupModal) {
        closeSignupModal();
    }
}

// Form validation and submission
document.addEventListener('DOMContentLoaded', function() {
    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    // Signup form handling
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup();
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
});

// Login handling
async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Basic validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Show loading state
    const loginBtn = document.querySelector('#loginForm .auth-btn');
    const originalText = loginBtn.textContent;
    loginBtn.textContent = 'Logging in...';
    loginBtn.disabled = true;

    try {
        // Check if Google Sheets API is available
        if (typeof authenticateWithGoogleSheets === 'function') {
            // Use Google Sheets authentication
            const result = await authenticateWithGoogleSheets(email, password);
            
            if (result.success) {
                // Store login state
                const userData = {
                    name: result.user.name,
                    email: result.user.email,
                    loginTime: new Date().toISOString(),
                    source: 'sheets'
                };

                if (rememberMe) {
                    localStorage.setItem('energyai_user', JSON.stringify(userData));
                } else {
                    sessionStorage.setItem('energyai_user', JSON.stringify(userData));
                }
                
                showNotification('Login successful! Redirecting...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
            } else {
                showNotification(result.message, 'error');
                loginBtn.textContent = originalText;
                loginBtn.disabled = false;
            }
        } else {
            // Check localStorage for registered users
            const existingUsers = JSON.parse(localStorage.getItem('energyai_users') || '[]');
            const user = existingUsers.find(u => u.email === email);
            
            // Check demo credentials first
            if (email === 'demo@energyai.com' && password === 'demo123') {
                const userData = {
                    id: 'demo',
                    name: 'Demo User',
                    email: email,
                    loginTime: new Date().toISOString(),
                    source: 'demo',
                    profile: {
                        energyGoal: 'save_money',
                        homeType: 'house',
                        familySize: 4,
                        notifications: true
                    }
                };

                if (rememberMe) {
                    localStorage.setItem('energyai_user', JSON.stringify(userData));
                } else {
                    sessionStorage.setItem('energyai_user', JSON.stringify(userData));
                }
                
                showNotification('Login successful! Redirecting...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
            } else if (user && atob(user.password) === password) {
                // Valid user from localStorage
                const userData = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    loginTime: new Date().toISOString(),
                    source: user.source,
                    profile: user.profile
                };

                if (rememberMe) {
                    localStorage.setItem('energyai_user', JSON.stringify(userData));
                } else {
                    sessionStorage.setItem('energyai_user', JSON.stringify(userData));
                }
                
                showNotification('Login successful! Redirecting...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
            } else {
                showNotification('Invalid email or password', 'error');
                loginBtn.textContent = originalText;
                loginBtn.disabled = false;
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please try again.', 'error');
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
    }
}

// Signup handling
async function handleSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }


    // Show loading state
    const signupBtn = document.querySelector('#signupForm .auth-btn');
    const originalText = signupBtn.textContent;
    signupBtn.textContent = 'Creating Account...';
    signupBtn.disabled = true;

    try {
        // Check if Google Sheets API is available
        if (typeof registerWithGoogleSheets === 'function') {
            // Use Google Sheets registration
            const result = await registerWithGoogleSheets({ name, email, password });
            
            if (result.success) {
                const userData = {
                    name: result.user.name,
                    email: result.user.email,
                    signupTime: result.user.registeredAt || new Date().toISOString(),
                    source: 'sheets'
                };

                localStorage.setItem('energyai_user', JSON.stringify(userData));
                
                showNotification('Account created successfully! Redirecting...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
            } else {
                showNotification(result.message, 'error');
                signupBtn.textContent = originalText;
                signupBtn.disabled = false;
            }
        } else {
            // Check if email already exists in localStorage
            const existingUsers = JSON.parse(localStorage.getItem('energyai_users') || '[]');
            const emailExists = existingUsers.find(user => user.email === email);
            
            if (emailExists) {
                showNotification('Email already exists. Please use a different email.', 'error');
                signupBtn.textContent = originalText;
                signupBtn.disabled = false;
                return;
            }

            // Create new user data
            const newUser = {
                id: Date.now().toString(), // Simple ID generation
                name: name,
                email: email,
                password: btoa(password), // Simple encoding (not secure for production)
                signupTime: new Date().toISOString(),
                source: 'localStorage',
                profile: {
                    energyGoal: 'save_money',
                    homeType: 'house',
                    familySize: 1,
                    notifications: true
                }
            };

            // Add to users array
            existingUsers.push(newUser);
            localStorage.setItem('energyai_users', JSON.stringify(existingUsers));

            // Set current user session
            const currentUserData = {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                signupTime: newUser.signupTime,
                source: newUser.source,
                profile: newUser.profile
            };

            localStorage.setItem('energyai_user', JSON.stringify(currentUserData));
            
            showNotification('Account created successfully! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1500);
        }
    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Registration failed. Please try again.', 'error');
        signupBtn.textContent = originalText;
        signupBtn.disabled = false;
    }
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// LocalStorage user management functions
function saveUserToLocalStorage(userData) {
    try {
        const existingUsers = JSON.parse(localStorage.getItem('energyai_users') || '[]');
        
        // Check if user already exists (update) or is new (add)
        const existingIndex = existingUsers.findIndex(user => user.email === userData.email);
        
        if (existingIndex !== -1) {
            // Update existing user
            existingUsers[existingIndex] = { ...existingUsers[existingIndex], ...userData };
        } else {
            // Add new user
            existingUsers.push(userData);
        }
        
        localStorage.setItem('energyai_users', JSON.stringify(existingUsers));
        return true;
    } catch (error) {
        console.error('Error saving user to localStorage:', error);
        return false;
    }
}

function getUserFromLocalStorage(email) {
    try {
        const existingUsers = JSON.parse(localStorage.getItem('energyai_users') || '[]');
        return existingUsers.find(user => user.email === email) || null;
    } catch (error) {
        console.error('Error getting user from localStorage:', error);
        return null;
    }
}

function getAllUsersFromLocalStorage() {
    try {
        return JSON.parse(localStorage.getItem('energyai_users') || '[]');
    } catch (error) {
        console.error('Error getting all users from localStorage:', error);
        return [];
    }
}

function setCurrentUser(userData, remember = true) {
    try {
        if (remember) {
            localStorage.setItem('energyai_user', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('energyai_user', JSON.stringify(userData));
        }
        return true;
    } catch (error) {
        console.error('Error setting current user:', error);
        return false;
    }
}

function getCurrentUser() {
    try {
        const localUser = localStorage.getItem('energyai_user');
        const sessionUser = sessionStorage.getItem('energyai_user');
        
        if (localUser) {
            return JSON.parse(localUser);
        } else if (sessionUser) {
            return JSON.parse(sessionUser);
        }
        return null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

function clearUserSession() {
    try {
        localStorage.removeItem('energyai_user');
        sessionStorage.removeItem('energyai_user');
        return true;
    } catch (error) {
        console.error('Error clearing user session:', error);
        return false;
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: auto;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Demo credentials helper
function showDemoCredentials() {
    showNotification('Demo credentials: email: demo@energyai.com, password: demo123', 'info');
}

// Add demo credentials button to login form
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const demoButton = document.createElement('button');
        demoButton.type = 'button';
        demoButton.className = 'demo-btn';
        demoButton.textContent = 'Use Demo Credentials';
        demoButton.style.cssText = `
            width: 100%;
            padding: 0.5rem;
            background: #f3f4f6;
            color: #6b7280;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 0.9rem;
            cursor: pointer;
            margin-top: 1rem;
            transition: all 0.3s ease;
        `;
        
        demoButton.addEventListener('mouseover', function() {
            this.style.background = '#e5e7eb';
        });
        
        demoButton.addEventListener('mouseout', function() {
            this.style.background = '#f3f4f6';
        });
        
        demoButton.addEventListener('click', function() {
            document.getElementById('loginEmail').value = 'demo@energyai.com';
            document.getElementById('loginPassword').value = 'demo123';
            showNotification('Demo credentials filled in!', 'success');
        });
        
        loginForm.appendChild(demoButton);
    }
});

// Check if user is already logged in
function checkLoginStatus() {
    const user = getCurrentUser();
    if (user) {
        console.log('User is already logged in:', user);
        // Show login status in the navigation
        updateNavForLoggedInUser(user);
    }
}

// Update navigation for logged in user
function updateNavForLoggedInUser(user) {
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    
    if (loginBtn && signupBtn) {
        loginBtn.textContent = `Welcome, ${user.name.split(' ')[0]}`;
        loginBtn.onclick = () => {
            if (confirm('Do you want to go to dashboard?')) {
                window.location.href = 'home.html';
            }
        };
        
        signupBtn.textContent = 'Logout';
        signupBtn.onclick = () => {
            if (confirm('Are you sure you want to logout?')) {
                clearUserSession();
                location.reload();
            }
        };
    }
}

// Debug function to view all registered users (for testing)
function viewRegisteredUsers() {
    const users = getAllUsersFromLocalStorage();
    console.log('All registered users:', users);
    console.log('Current user:', getCurrentUser());
    return users;
}

// Make debug function available globally for testing
window.viewRegisteredUsers = viewRegisteredUsers;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

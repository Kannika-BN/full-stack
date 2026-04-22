// Shared Utility Functions

/**
 * Display a message (error or success) in the UI
 * @param {string} text - Message text
 * @param {string} type - 'error' or 'success'
 */
function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    if (!messageEl) return;
    
    messageEl.textContent = text;
    messageEl.className = type; // 'error' or 'success'
    messageEl.style.display = 'block';
    
    // Auto-hide after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }
}

/**
 * Handle button loading state
 * @param {boolean} isLoading 
 */
function setLoading(isLoading) {
    const submitBtn = document.getElementById('submitBtn');
    if (!submitBtn) return;
    
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('data-original-text', submitBtn.textContent);
        submitBtn.textContent = 'Processing...';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.getAttribute('data-original-text') || 'Submit';
    }
}

/**
 * Check if user is logged in
 * Redirection logic for private/public pages
 */
async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const path = window.location.pathname;
    
    // Pages that require login
    const privatePages = ['/home.html', '/home'];
    // Pages that should not be visible if logged in
    const authPages = ['/login.html', '/register.html', '/login', '/register', '/'];

    const isPrivate = privatePages.some(p => path.endsWith(p));
    const isAuthPage = authPages.some(p => path.endsWith(p));

    if (!token && isPrivate) {
        window.location.href = 'login.html';
        return;
    }

    if (token) {
        try {
            const response = await fetch('http://localhost:5000/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const userData = await response.json();
                if (isAuthPage) {
                    window.location.href = 'home.html';
                }
                return userData;
            } else {
                localStorage.removeItem('token');
                if (isPrivate) window.location.href = 'login.html';
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        }
    }
}

// Run auth check on every page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
});

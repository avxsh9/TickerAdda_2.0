console.log('TickerAdda Frontend Loaded');

// Sticky Navbar Effect (Waiting for navbar to load)
function initStickyNavbar() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// Load Components
document.addEventListener('DOMContentLoaded', function () {
    // Load Navbar
    const navPlaceholder = document.getElementById('navbar-placeholder');
    if (navPlaceholder) {
        fetch('../../components/navbar.html')
            .then(response => response.text())
            .then(data => {
                navPlaceholder.innerHTML = data;
                initStickyNavbar();
                checkAuthStatus(); // Run AFTER navbar is injected
            })
            .catch(err => console.error('Error loading navbar:', err));
    } else {
        initStickyNavbar(); // If navbar is already there (e.g. static index.html)
        checkAuthStatus();
    }

    // Load Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('../../components/footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            })
            .catch(err => console.error('Error loading footer:', err));
    }
});

function checkAuthStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    const loginBtn = document.querySelector('a[href*="login.html"]');

    if (user && loginBtn) {
        // Change "Sign In" to "Profile/Logout"
        loginBtn.textContent = 'Logout';
        loginBtn.href = '#';
        loginBtn.classList.remove('btn-outline');
        loginBtn.classList.add('btn-primary'); // Make it pop
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });

        // Add User Name if possible
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            // Check for Admin Role and Add Dashboard Link
            if (user.role === 'admin') {
                const adminLink = document.createElement('a');
                adminLink.href = '/pages/admin/approve-tickets.html'; // Direct compatibility with existing flows
                adminLink.className = 'nav-link';
                adminLink.style.color = '#ef4444'; // Make it distinct (Red/Orange)
                adminLink.innerHTML = '<i class="fas fa-shield-alt"></i> Admin Panel';
                navLinks.insertBefore(adminLink, navLinks.firstChild); // Add to start or before "Sell Tickets"
            }

            const userBadge = document.createElement('span');
            userBadge.style.color = '#fff';
            userBadge.style.marginLeft = '10px';
            userBadge.textContent = 'Hi, ' + user.name;
            navLinks.insertBefore(userBadge, loginBtn);
        }
    }
}

function requireAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = '../auth/login.html';
    }
}

// Secure Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear(); // Clear any session data
    window.location.href = '../public/index.html';
}

// Protect Admin Pages - Run this on admin pages
function checkAdminAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        window.location.replace('../public/index.html'); // Use replace to prevent back navigation
    }
}

// Global Back Button Protection (Prevent restoring from bfcache)
window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        window.location.reload();
    }
});

// Helper to get auto-images based on keywords
// Helper: Get Event Image URL based on Name
function getEventImageUrl(eventName) {
    if (!eventName) return 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000'; // Default Concert

    const name = eventName.toLowerCase();

    // Cricket / IPL
    if (name.includes('ipl') || name.includes('cricket') || name.includes('match') || name.includes('mi vs') || name.includes('csk')) {
        return 'https://images.unsplash.com/photo-1531415074968-bc924375b263?auto=format&fit=crop&q=80&w=1000';
    }
    // Concerts / Music
    if (name.includes('arijit') || name.includes('concert') || name.includes('coldplay') || name.includes('music') || name.includes('live')) {
        if (name.includes('arijit')) return 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=1000'; // Singer/Mic
        if (name.includes('coldplay')) return 'https://images.unsplash.com/photo-1459749411177-d4a428c3e8cb?auto=format&fit=crop&q=80&w=1000'; // Concert crowd
        return 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1000'; // Generic Concert
    }
    // Comedy
    if (name.includes('comedy') || name.includes('standup') || name.includes('laugh')) {
        return 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&q=80&w=1000';
    }

    // Default Fallback
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(eventName)}&background=random&size=512`;
}

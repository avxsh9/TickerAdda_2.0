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

function logout() {
    localStorage.removeItem('user');
    window.location.href = '../public/index.html';
}

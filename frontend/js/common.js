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
                setupMobileMenu(); // Setup toggle AFTER HTML is injected
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

    // Setup Navbar Logic (Logout, etc.)
    const user = JSON.parse(localStorage.getItem('user'));
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');

    // Setup Mobile Menu Logic
    function setupMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.menu-toggle');

        if (menuToggle && navLinks) {
            // Remove old listeners to be safe (though not strictly necessary on fresh load)
            const newToggle = menuToggle.cloneNode(true);
            menuToggle.parentNode.replaceChild(newToggle, menuToggle);

            newToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                const icon = newToggle.querySelector('i');
                if (navLinks.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        }
    }
});

function checkAuthStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    // Use ID for reliability, fallback to href if ID missing (for safety)
    const loginBtn = document.getElementById('loginBtn') || document.querySelector('a[href*="login.html"]');

    if (user && loginBtn) {
        // Change "Sign In" to "Logout"
        loginBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        loginBtn.href = '#';
        loginBtn.classList.remove('btn-outline');
        loginBtn.classList.add('btn-primary');
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });

        const navLinks = document.getElementById('navLinks') || document.querySelector('.nav-links');
        if (navLinks) {
            // Get the static Dashboard Key
            const dashboardLink = document.getElementById('dashboardLink');
            const myTicketsLink = document.getElementById('myTicketsLink');

            if (dashboardLink) {
                // Unhide it
                dashboardLink.style.display = 'inline-block';

                // USER REQUEST: Always show Seller Dashboard here
                dashboardLink.href = '/pages/seller/dashboard.html';
                dashboardLink.innerHTML = '<i class="fas fa-chart-line"></i> Seller Dashboard';
                dashboardLink.style.fontWeight = 'bold';

                // Check Admin Override
                if (user.role === 'admin') {
                    dashboardLink.href = '/pages/admin/dashboard.html';
                    dashboardLink.innerHTML = '<i class="fas fa-tachometer-alt"></i> Admin';
                    dashboardLink.style.color = '#ef4444';
                }
            }

            // USER REQUEST: Always show My Tickets (Buyer Dashboard)
            if (myTicketsLink) {
                myTicketsLink.style.display = 'inline-block';
            }

            // User Welcome Badge
            if (!document.getElementById('userBadge')) {
                const userBadge = document.createElement('span');
                userBadge.id = 'userBadge';
                userBadge.className = 'nav-link';
                userBadge.style.color = 'var(--primary)';
                userBadge.textContent = `Hi, ${user.name.split(' ')[0]}`;
                userBadge.style.marginRight = '10px'; // Add some spacing

                // Position: Left of Logout Button
                navLinks.insertBefore(userBadge, loginBtn);
            }
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

// Global Buy Ticket Logic
async function buyTicket(ticketId, price) {
    const token = localStorage.getItem('token');

    // 1. Check Login
    if (!token) {
        Swal.fire({
            title: 'Login Required',
            text: 'You need to login to buy tickets!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Login Now'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '../auth/login.html';
            }
        });
        return;
    }

    // 2. Confirm Purchase
    const result = await Swal.fire({
        title: 'Confirm Purchase?',
        text: `You are about to buy this ticket for ₹${price}.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Buy it!',
        confirmButtonColor: '#3b82f6'
    });

    if (!result.isConfirmed) return;

    // 3. Call API
    try {
        Swal.showLoading();

        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ ticketId })
        });

        const data = await res.json();

        if (res.ok) {
            Swal.fire({
                title: 'Purchase Successful! 🎉',
                html: `
                    <div style="text-align: left; margin-top: 20px;">
                        <p>You have successfully secured your ticket.</p>
                        <hr style="border-color: rgba(255,255,255,0.1); margin: 15px 0;">
                        <h4 style="color: var(--primary-color);">Seller Details:</h4>
                        <p><strong>Name:</strong> ${data.seller.name}</p>
                        <p><strong>Mobile:</strong> ${data.seller.phone || 'N/A'}</p>
                        <p><strong>Email:</strong> ${data.seller.email}</p>
                        <br>
                        <p style="font-size: 0.9em; color: #888;">You can contact the seller for further coordination.</p>
                    </div>
                `,
                icon: 'success',
                confirmButtonText: 'Go to My Tickets'
            }).then(() => {
                window.location.href = '../buyer/dashboard.html';
            });
        } else {
            Swal.fire('Error', data.msg || 'Failed to purchase ticket', 'error');
        }

    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Server Error', 'error');
    }
}

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
                // Re-highlight active link if needed (can add logic here)
            })
            .catch(err => console.error('Error loading navbar:', err));
    } else {
        initStickyNavbar(); // If navbar is already there (e.g. static index.html)
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

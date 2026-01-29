document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = this.querySelector('input[name="email"]').value;
    const password = this.querySelector('input[name="password"]').value;
    const submitBtn = this.querySelector('button[type="submit"]');

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        submitBtn.disabled = true;

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.msg || 'Login failed');
        }

        // Login Successful
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect based on role
        if (data.user.role === 'seller') {
            window.location.href = '../seller/dashboard.html';
        } else if (data.user.role === 'admin') {
            window.location.href = '../admin/dashboard.html';
        } else {
            window.location.href = '../buyer/dashboard.html';
        }

    } catch (err) {
        console.error(err);
        alert(err.message);
        submitBtn.innerHTML = 'Sign In';
        submitBtn.disabled = false;
    }
});

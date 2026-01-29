document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = this.querySelector('input[name="name"]').value;
    const email = this.querySelector('input[name="email"]').value;
    const password = this.querySelector('input[name="password"]').value;
    const submitBtn = this.querySelector('button[type="submit"]');

    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                role: 'buyer' // Default for public signup
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.msg || 'Registration failed');
        }

        // Registration Successful - Auto Login
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        window.location.href = '../buyer/dashboard.html';

    } catch (err) {
        console.error(err);
        alert(err.message);
        submitBtn.innerHTML = 'Sign Up';
        submitBtn.disabled = false;
    }
});

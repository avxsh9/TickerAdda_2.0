document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    // Elements
    const totalUsersEl = document.getElementById('totalUsers');
    const totalSalesEl = document.getElementById('totalSales');
    const activeEventsEl = document.getElementById('activeEvents');

    if (!token) {
        window.location.href = '../auth/login.html';
        return;
    }

    try {
        const res = await fetch('/api/admin/stats', {
            headers: {
                'x-auth-token': token
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch stats');
        }

        const data = await res.json();

        // Update UI with real data
        totalUsersEl.textContent = data.totalUsers;
        totalSalesEl.textContent = '₹' + data.totalSales.toLocaleString('en-IN');
        activeEventsEl.textContent = data.activeEvents;

    } catch (err) {
        console.error(err);
        // Fallback to 0 if error
        totalUsersEl.textContent = '0';
        totalSalesEl.textContent = '₹0';
        activeEventsEl.textContent = '0';
    }
});

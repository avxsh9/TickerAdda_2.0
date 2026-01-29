document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../auth/login.html';
        return;
    }

    const container = document.getElementById('my-listings-container');

    try {
        const res = await fetch('/api/tickets/my-tickets', {
            headers: { 'x-auth-token': token }
        });
        const tickets = await res.json();

        if (tickets.length === 0) {
            container.innerHTML = '<p style="text-align:center; color: #aaa;">You haven\'t listed any tickets yet.</p>';
            return;
        }

        let html = '<div class="listings-grid">';
        tickets.forEach(ticket => {
            let statusBadge = '';
            if (ticket.status === 'pending') statusBadge = '<span class="badge badge-warning">Pending</span>';
            else if (ticket.status === 'approved') statusBadge = '<span class="badge badge-success">Live</span>';
            else statusBadge = '<span class="badge badge-danger">Rejected</span>';

            html += `
                <div class="listing-card">
                    <div class="card-header">
                        <h3>${getEventName(ticket.event)}</h3>
                        ${statusBadge}
                    </div>
                    <div class="card-body">
                        <p><strong>Category:</strong> ${ticket.category}</p>
                        <p><strong>Price:</strong> ₹${ticket.price}</p>
                        <p><strong>Quantity:</strong> ${ticket.quantity}</p>
                        <p><small>Listed on: ${new Date(ticket.createdAt).toLocaleDateString()}</small></p>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;

    } catch (err) {
        console.error(err);
        container.innerHTML = '<p>Error loading listings.</p>';
    }
});

function getEventName(id) {
    const events = {
        '1': 'Arijit Singh Live',
        '2': 'IPL 2026: MI vs CSK',
        '3': 'Coldplay World Tour'
    };
    return events[id] || 'Unknown Event';
}

document.addEventListener('DOMContentLoaded', () => {
    loadListings();
});

async function loadListings() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../auth/login.html';
        return;
    }

    const container = document.getElementById('my-listings-container');
    container.innerHTML = '<div style="text-align: center; color: #aaa; padding: 40px;"><i class="fas fa-spinner fa-spin"></i> Checking status...</div>';

    try {
        const res = await fetch('/api/tickets/my-tickets', {
            headers: { 'x-auth-token': token }
        });
        const tickets = await res.json();

        if (tickets.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding: 40px; background: rgba(255,255,255,0.02); border-radius: 10px;">
                    <i class="fas fa-ticket-alt" style="font-size: 3rem; color: var(--text-gray); margin-bottom: 20px;"></i>
                    <p style="color: #aaa; margin-bottom: 20px;">You haven't listed any tickets yet.</p>
                    <a href="sell-ticket.html" class="btn btn-primary">Sell Your First Ticket</a>
                </div>`;
            return;
        }

        let html = '<div class="listings-grid">';
        tickets.forEach(ticket => {
            let statusBadge = '';
            let statusText = '';

            // Explicitly checking string values
            if (ticket.status === 'pending') {
                statusBadge = '<span class="badge badge-warning"><i class="far fa-clock"></i> Pending Approval</span>';
                statusText = 'Waiting for admin review';
            } else if (ticket.status === 'approved') {
                statusBadge = '<span class="badge badge-success"><i class="fas fa-check-circle"></i> Live</span>';
                statusText = 'Visible on Marketplace';
            } else if (ticket.status === 'rejected') {
                statusBadge = '<span class="badge badge-danger"><i class="fas fa-times-circle"></i> Rejected</span>';
                statusText = 'Listing declined';
            } else {
                statusBadge = `<span class="badge badge-warning">${ticket.status}</span>`;
            }

            html += `
                <div class="listing-card">
                    <div class="card-header">
                        <h3>${getEventName(ticket.event)}</h3>
                        ${statusBadge}
                    </div>
                    <div class="card-body">
                        <p><strong>Category</strong> <span>${ticket.category}</span></p>
                        <p><strong>Seat</strong> <span>${ticket.seat || 'N/A'}</span></p>
                        <p><strong>Price</strong> <span>₹${ticket.price}</span></p>
                        <p><strong>Quantity</strong> <span>${ticket.quantity}</span></p>
                    </div>
                    <div class="card-footer">
                        ${statusText} • Listed on: ${new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;

    } catch (err) {
        console.error(err);
        container.innerHTML = '<p style="color: #e74c3c; text-align: center;">Error loading listings. Please try again.</p>';
    }
}

function getEventName(id) {
    const events = {
        '1': 'Arijit Singh Live',
        '2': 'IPL 2026: MI vs CSK',
        '3': 'Coldplay World Tour'
    };
    // If ID is not in map (e.g. if we add more events later), just show ID or "Event"
    return events[id] || 'Event';
}

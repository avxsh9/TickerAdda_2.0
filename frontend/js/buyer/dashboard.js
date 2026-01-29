document.addEventListener('DOMContentLoaded', () => {
    loadMyListings();
});

function switchTab(tab) {
    const sellingSection = document.getElementById('selling-section');
    const buyingSection = document.getElementById('buying-section');
    const tabs = document.querySelectorAll('.tab-btn');

    if (tab === 'selling') {
        sellingSection.style.display = 'block';
        buyingSection.style.display = 'none';
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
    } else {
        sellingSection.style.display = 'none';
        buyingSection.style.display = 'block';
        tabs[0].classList.remove('active');
        tabs[1].classList.add('active');
    }
}

async function loadMyListings() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../auth/login.html';
        return;
    }

    const container = document.getElementById('my-listings-container');
    container.innerHTML = '<div style="text-align: center; color: #aaa; padding: 20px;"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';

    try {
        const res = await fetch('/api/tickets/my-tickets', {
            headers: { 'x-auth-token': token }
        });
        const tickets = await res.json();

        if (tickets.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding: 30px; background: rgba(255,255,255,0.02); border-radius: 10px;">
                    <i class="fas fa-ticket-alt" style="font-size: 2rem; color: var(--text-gray); margin-bottom: 15px;"></i>
                    <p style="color: #aaa; margin-bottom: 15px;">You haven't listed any tickets yet.</p>
                    <a href="../seller/sell-ticket.html" class="btn btn-sm btn-primary">Sell Ticket</a>
                </div>`;
            return;
        }

        let html = '<div class="listings-grid">';
        tickets.forEach(ticket => {
            let statusBadge = '';

            if (ticket.status === 'pending') {
                statusBadge = '<span class="badge badge-warning"><i class="far fa-clock"></i> Pending</span>';
            } else if (ticket.status === 'approved') {
                statusBadge = '<span class="badge badge-success"><i class="fas fa-check-circle"></i> Live</span>';
            } else {
                statusBadge = '<span class="badge badge-danger"><i class="fas fa-times-circle"></i> Rejected</span>';
            }

            html += `
                <div class="listing-card">
                    <div class="card-header" style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <h3 style="margin:0; font-size:1.1rem; color:#fff;">${getEventName(ticket.event)}</h3>
                            ${statusBadge}
                        </div>
                    </div>
                    <div class="card-body" style="font-size: 0.9rem;">
                        <p style="color:#ccc; display:flex; justify-content:space-between; margin:5px 0;">
                            <span>Category:</span> <span style="color:#fff;">${ticket.category}</span>
                        </p>
                        <p style="color:#ccc; display:flex; justify-content:space-between; margin:5px 0;">
                            <span>Details:</span> <span style="color:#fff;">${ticket.seat || '-'} (Qty: ${ticket.quantity})</span>
                        </p>
                        <p style="color:#ccc; display:flex; justify-content:space-between; margin:5px 0;">
                            <span>Price:</span> <span style="color:var(--primary-color); font-weight:bold;">₹${ticket.price}</span>
                        </p>
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
}

function getEventName(id) {
    const events = {
        '1': 'Arijit Singh Live',
        '2': 'IPL 2026: MI vs CSK',
        '3': 'Coldplay World Tour'
    };
    return events[id] || 'Unknown Event';
}

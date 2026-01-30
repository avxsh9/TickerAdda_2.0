document.addEventListener('DOMContentLoaded', () => {
    loadMyOrders();
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

            if (ticket.status === 'sold') {
                statusBadge = '<span class="badge badge-success" style="background-color: #10B981;"><i class="fas fa-check-circle"></i> SOLD</span>';
            } else if (ticket.status === 'pending') {
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
                            <h3 style="margin:0; font-size:1.1rem; color:#fff;">${ticket.event}</h3>
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
                        ${ticket.status === 'sold' ? `<p style="color:#10B981; display:flex; justify-content:space-between; margin:5px 0; font-weight:600;"><span>Sold To:</span> <span>${ticket.buyerName || 'Buyer'}</span></p>` : ''}
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

async function loadMyOrders() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const container = document.getElementById('buying-section'); // Using existing container logic? 
    // Actually, HTML has <div id="buying-section">...</div>
    // Let's replace the content inside it properly.

    // Create a container for the grid if not exists
    let gridContainer = document.getElementById('my-orders-grid');
    if (!gridContainer) {
        // Clear placeholder text first time
        container.innerHTML = '<h3>Tickets I\'ve Bought</h3><div id="my-orders-grid" class="listings-grid"></div>';
        gridContainer = document.getElementById('my-orders-grid');
    }

    gridContainer.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:#aaa;"><i class="fas fa-spinner fa-spin"></i> Loading tickets...</div>';

    try {
        const res = await fetch('/api/orders/my-orders', {
            headers: { 'x-auth-token': token }
        });
        const orders = await res.json();

        if (orders.length === 0) {
            gridContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; padding: 30px; background: rgba(255,255,255,0.02); border-radius: 10px;">
                    <i class="fas fa-shopping-bag" style="font-size: 2rem; color: var(--text-gray); margin-bottom: 15px;"></i>
                    <p style="color: #aaa;">You haven't bought any tickets yet.</p>
                </div>`;
            return;
        }

        let html = '';
        orders.forEach(order => {
            const ticket = order.ticket;
            const eventName = ticket ? ticket.event : 'Unknown Event';
            // Use ticket image if available (from common.js logic or ticket.fileUrl)
            // Ideally we pass event name to getEventImageUrl if needed

            // Seller Info from populated ticket
            const sellerInfo = ticket.seller ?
                `<p style="color:#aaa; border-top:1px solid rgba(255,255,255,0.1); padding-top:10px; margin-top:10px;">
                    <i class="fas fa-store"></i> Seller: <span style="color:#fff;">${ticket.seller.name}</span><br>
                    <i class="fas fa-phone" style="font-size:0.8em;"></i> <span style="color:#fff;">${ticket.seller.phone || 'N/A'}</span><br>
                    <span style="font-size:0.85em; margin-left:20px;">${ticket.seller.email}</span>
                 </p>` : '';

            html += `
                <div class="listing-card" style="border-color: rgba(59, 130, 246, 0.3);">
                    <div class="card-header" style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <h3 style="margin:0; font-size:1.1rem; color:#fff;">${eventName}</h3>
                            <span class="badge badge-success"><i class="fas fa-check"></i> Purchased</span>
                        </div>
                    </div>
                    <div class="card-body" style="font-size: 0.9rem;">
                        <p style="color:#ccc; display:flex; justify-content:space-between; margin:5px 0;">
                            <span>Order ID:</span> <span style="font-family:monospace; color:#888;">#${order._id.slice(-6)}</span>
                        </p>
                        <p style="color:#ccc; display:flex; justify-content:space-between; margin:5px 0;">
                            <span>Seat / Qty:</span> <span style="color:#fff;">${ticket ? ticket.seat : 'N/A'} <small style="color:#f59e0b;">(x1)</small></span>
                        </p>
                        <p style="color:#ccc; display:flex; justify-content:space-between; margin:5px 0;">
                            <span>Price:</span> <span style="color:var(--primary-color); font-weight:bold;">₹${order.totalAmount}</span>
                        </p>
                        <p style="color:#ccc; display:flex; justify-content:space-between; margin:5px 0;">
                            <span>Date:</span> <span>${new Date(order.createdAt).toLocaleDateString()}</span>
                        </p>
                        
                        ${sellerInfo}

                        <button class="btn btn-sm btn-outline" style="width:100%; margin-top:10px;" onclick="window.print()">Download Ticket</button>
                    </div>
                </div>
            `;
        });
        gridContainer.innerHTML = html;

    } catch (err) {
        console.error(err);
        gridContainer.innerHTML = '<p>Error loading orders.</p>';
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

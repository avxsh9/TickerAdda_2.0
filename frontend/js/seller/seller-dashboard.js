document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../auth/login.html';
        return;
    }

    const tableBody = document.getElementById('listingsTable');

    // Stats Elements
    const totalEarningsEl = document.querySelectorAll('.container > div > div:nth-child(1) > div:nth-child(2)')[0];
    const activeListingsEl = document.querySelectorAll('.container > div > div:nth-child(2) > div:nth-child(2)')[0];
    const ticketsSoldEl = document.querySelectorAll('.container > div > div:nth-child(3) > div:nth-child(2)')[0];


    try {
        const res = await fetch('/api/tickets/my-tickets', {
            headers: { 'x-auth-token': token }
        });
        const tickets = await res.json();

        if (tickets.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="padding: 20px; text-align: center; color: var(--text-gray);">No listings found.</td></tr>';
            return;
        }

        let html = '';
        let totalEarnings = 0;
        let activeCount = 0;
        let soldCount = 0;

        tickets.forEach(ticket => {
            let statusBadge = '';
            let actionHtml = '';

            if (ticket.status === 'sold') {
                soldCount++;
                totalEarnings += ticket.price;
                statusBadge = '<span class="badge badge-success">SOLD</span>';
                actionHtml = `
                    <div style="font-size: 0.8em; color: #10B981;">
                        <div>Sold to: <strong>${ticket.buyerName || 'Buyer'}</strong></div>
                        <div><i class="fas fa-phone"></i> ${ticket.buyerPhone || 'N/A'}</div>
                    </div>`;
            } else if (ticket.status === 'approved') {
                activeCount++;
                statusBadge = '<span class="badge badge-success">Active</span>';
                actionHtml = '<button class="btn btn-sm btn-outline-danger">Cancel</button>';
            } else if (ticket.status === 'rejected') {
                statusBadge = '<span class="badge badge-danger">Rejected</span>';
                actionHtml = '-';
            } else {
                activeCount++; // Pending is still an active listing attempt
                statusBadge = '<span class="badge badge-warning">Pending</span>';
                actionHtml = '<button class="btn btn-sm btn-outline-danger">Cancel</button>';
            }

            html += `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); color: #ddd;">
                    <td style="padding: 15px;">${ticket.event}<br><span style="font-size:0.8em; color:#888;">${ticket.category}</span></td>
                    <td style="padding: 15px;">${new Date().toLocaleDateString()}</td>
                    <td style="padding: 15px;">${ticket.quantity}</td>
                    <td style="padding: 15px;">₹${ticket.price}</td>
                    <td style="padding: 15px;">${statusBadge}</td>
                    <td style="padding: 15px;">${actionHtml}</td>
                </tr>
            `;
        });

        tableBody.innerHTML = html;

        // Update Stats
        totalEarningsEl.innerText = `₹${totalEarnings}`;
        activeListingsEl.innerText = activeCount;
        ticketsSoldEl.innerText = soldCount;

    } catch (err) {
        console.error(err);
        tableBody.innerHTML = '<tr><td colspan="6" style="color:red; text-align:center;">Error loading data.</td></tr>';
    }
});

function getEventName(id) {
    const events = {
        '1': 'Arijit Singh Live',
        '2': 'IPL 2026: MI vs CSK',
        '3': 'Coldplay World Tour'
    };
    return events[id] || id;
}

// Token is already declared in HTML, or we fetch it again safely
const authToken = localStorage.getItem('token');

async function loadTickets(type) {
    const container = document.getElementById('ticketsContainer');

    // Show Skeletons while loading
    container.innerHTML = `
        <div class="ticket-card" style="height: 250px; border: 1px solid rgba(255,255,255,0.1);"><div class="skeleton" style="width: 100%; height: 100%; opacity: 0.1;"></div></div>
        <div class="ticket-card" style="height: 250px; border: 1px solid rgba(255,255,255,0.1);"><div class="skeleton" style="width: 100%; height: 100%; opacity: 0.1;"></div></div>
        <div class="ticket-card" style="height: 250px; border: 1px solid rgba(255,255,255,0.1);"><div class="skeleton" style="width: 100%; height: 100%; opacity: 0.1;"></div></div>
    `;

    try {
        const endpoint = type === 'pending' ? '/api/tickets/pending' : '/api/tickets/history';
        const res = await fetch(endpoint, {
            headers: { 'x-auth-token': token }
        });
        const tickets = await res.json();

        updateStats(); // Fetch global stats separately

        if (tickets.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #888;">
                    <div style="font-size: 3rem; margin-bottom: 20px; opacity: 0.3;"><i class="fas fa-clipboard-check"></i></div>
                    <h3>No tickets found</h3>
                    <p>There are no tickets in this category right now.</p>
                </div>
            `;
            return;
        }

        let html = '';
        tickets.forEach(ticket => {

            // Status Bar Color
            const statusClass = ticket.status === 'pending' ? 'status-pending' : (ticket.status === 'approved' ? 'status-approved' : 'status-rejected');

            // Actions Logic
            let actionsHtml = '';
            if (ticket.status === 'pending') {
                actionsHtml = `
                    <button class="btn-action btn-approve" onclick="confirmAction('${ticket._id}', 'approve')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn-action btn-reject" onclick="confirmAction('${ticket._id}', 'reject')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                `;
            } else {
                actionsHtml = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; color: #aaa; font-size: 0.85rem;">
                        Processed on ${new Date(ticket.updatedAt || Date.now()).toLocaleDateString()}
                    </div>
                `;
            }

            html += `
                <div class="ticket-card">
                    <div class="ticket-status-bar ${statusClass}"></div>
                    <div class="card-body">
                        <div class="card-header">
                            <div>
                                <div class="event-name">${ticket.event}</div>
                                <div class="ticket-id">ID: ${ticket._id.slice(-6).toUpperCase()}</div>
                            </div>
                            <div class="card-price">₹${ticket.price}</div>
                        </div>

                        <div class="info-row"><i class="fas fa-calendar-alt"></i> ${new Date().toLocaleDateString()}</div>
                        <div class="info-row"><i class="fas fa-chair"></i> ${ticket.seat || 'General'}</div>
                        <div class="info-row"><i class="fas fa-tag"></i> ${ticket.category}</div>

                        <div class="seller-info">
                            <div class="seller-avatar">${ticket.seller?.name?.charAt(0) || 'U'}</div>
                            <div>
                                <div class="seller-name">${ticket.seller?.name || 'Unknown Seller'}</div>
                                <div class="seller-email">${ticket.seller?.email || 'No Email'}</div>
                            </div>
                        </div>

                        <div class="card-actions">
                            ${actionsHtml}
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

    } catch (err) {
        console.error(err);
        container.innerHTML = '<p style="color:red; text-align:center;">Error loading tickets.</p>';
        Swal.fire('Error', 'Failed to load tickets', 'error');
    }
}



async function updateStats() {
    try {
        const res = await fetch('/api/tickets/stats', {
            headers: { 'x-auth-token': authToken }
        });
        const stats = await res.json();

        if (document.getElementById('statPending')) {
            document.getElementById('statPending').innerText = stats.pending || 0;
        }
        if (document.getElementById('statApproved')) {
            document.getElementById('statApproved').innerText = stats.approvedToday || 0;
        }
        if (document.getElementById('statTotalVal')) {
            document.getElementById('statTotalVal').innerText = '₹' + (stats.totalValue || 0).toLocaleString();
        }

    } catch (err) {
        console.error('Error fetching stats:', err);
    }
}

async function confirmAction(id, action) {
    const result = await Swal.fire({
        title: action === 'approve' ? 'Approve Ticket?' : 'Reject Ticket?',
        text: "This action will update the ticket's public visibility.",
        icon: action === 'approve' ? 'question' : 'warning',
        showCancelButton: true,
        confirmButtonColor: action === 'approve' ? '#10b981' : '#ef4444',
        cancelButtonColor: '#3085d6',
        confirmButtonText: action === 'approve' ? 'Yes, Approve!' : 'Yes, Reject!',
        background: '#18181b',
        color: '#fff'
    });

    if (result.isConfirmed) {
        processTicket(id, action);
    }
}

async function processTicket(id, action) {
    try {
        // Backend expects: PUT /api/tickets/:id/status
        // Body: { status: 'approved' } or { status: 'rejected' }
        const newStatus = action === 'approve' ? 'approved' : 'rejected';

        const res = await fetch(`/api/tickets/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (res.ok) {
            Swal.fire({
                title: 'Success!',
                text: `Ticket has been ${action}d.`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#18181b',
                color: '#fff'
            });
            setTimeout(() => loadTickets('pending'), 1000); // Refresh
        } else {
            throw new Error('Failed to update');
        }
    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Something went wrong', 'error');
    }
}

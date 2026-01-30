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
            headers: { 'x-auth-token': authToken }
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

            // Image Logic
            // Check if getEventImageUrl is defined, otherwise fallback
            let fallbackImage = 'https://via.placeholder.com/400x200?text=No+Proof';
            if (typeof getEventImageUrl === 'function') {
                fallbackImage = getEventImageUrl(ticket.event);
            }

            let imageUrl = fallbackImage;
            let isPdf = false;
            let filename = '';

            if (ticket.fileUrl) {
                // ROBUST PATH FIX:
                // 1. Normalize slashes
                let cleanPath = ticket.fileUrl.replace(/\\/g, '/');
                // 2. Encoded spaces
                cleanPath = cleanPath.replace(/ /g, '%20');

                // 3. Extract just the filename (safest approach since all files are in uploads/)
                filename = cleanPath.split('/').pop();

                // 4. Construct URL
                imageUrl = `/uploads/${filename}`;

                // 5. Check if PDF
                if (filename.toLowerCase().endsWith('.pdf')) {
                    isPdf = true;
                }
            }

            // Render Logic
            let mediaContent = '';
            // Cache bust for images to prevent 404 caching
            const timestamp = new Date().getTime();

            // Append timestamp to imageUrl if it's not a placeholder
            if (!imageUrl.includes('placeholder')) {
                imageUrl = `${imageUrl}?t=${timestamp}`;
            }

            if (isPdf) {
                mediaContent = `
                    <div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#222; cursor:pointer;" onclick="window.open('${imageUrl}', '_blank')">
                        <i class="fas fa-file-pdf" style="font-size:3rem; color:#e11d48; margin-bottom:10px;"></i>
                        <span style="color:#aaa; font-size:0.8rem;">Click to View PDF</span>
                    </div>`;
            } else {
                mediaContent = `
                    <img src="${imageUrl}" 
                        alt="Ticket Proof" 
                        style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;" 
                        onclick="openModal('${imageUrl}')"
                        onerror="this.onerror=null; this.src='https://via.placeholder.com/400x200?text=Image+Not+Found'; this.parentElement.style.border='2px solid red';">
                `;
            }

            html += `
                <div class="ticket-card">
                    <div class="ticket-image" style="height: 150px; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        ${mediaContent}
                    </div>
                    <div class="ticket-status-bar ${statusClass}"></div>
                    <div class="card-body">
                        <div class="card-header">
                            <div>
                                <div class="event-name">${ticket.event}</div>
                                <div class="ticket-id">ID: ${ticket._id.slice(-6).toUpperCase()}<br>
                                <span style="font-size:0.7em; color:#666;">File: ${filename || 'None'}</span></div>
                            </div>
                            <div class="card-price">₹${ticket.price} <span style="font-size:0.6em; color:#888;">/ tkt</span></div>
                        </div>

                        <div class="info-row"><i class="fas fa-calendar-alt"></i> ${new Date().toLocaleDateString()}</div>
                        <div class="info-row">
                            <span><i class="fas fa-chair"></i> ${ticket.seat || 'General'}</span>
                            <span style="margin-left:10px; color:#f59e0b;"><i class="fas fa-layer-group"></i> Qty: ${ticket.quantity}</span>
                        </div>
                        <div class="info-row"><i class="fas fa-tag"></i> ${ticket.category}</div>

                        <div class="seller-info" style="margin-top:15px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.05);">
                            <div class="seller-avatar">${ticket.seller?.name?.charAt(0) || 'U'}</div>
                            <div>
                                <div class="seller-name">${ticket.seller?.name || 'Unknown Seller'}</div>
                                <div class="seller-email" style="font-size:0.8em; color:#aaa;">${ticket.seller?.email || 'No Email'}</div>
                                <div class="seller-phone" style="font-size:0.8em; color:#10B981;"><i class="fas fa-phone-alt"></i> ${ticket.seller?.phone || 'N/A'}</div>
                            </div>
                        </div>

                        <div class="card-actions">
                            <button class="btn-action" style="background: rgba(255,255,255,0.1); color: white;" onclick="${isPdf ? `window.open('${imageUrl}', '_blank')` : `openModal('${imageUrl}')`}">
                                <i class="fas fa-eye"></i> ${isPdf ? 'View PDF' : 'View Proof'}
                            </button>
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

// Modal Functions
function openModal(url) {
    const modal = document.getElementById('proofModal');
    const img = document.getElementById('modalImage');
    img.src = url;
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('proofModal').style.display = 'none';
}

// Close on outside click
window.onclick = function (event) {
    const modal = document.getElementById('proofModal');
    if (event.target === modal) {
        closeModal();
    }
};



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

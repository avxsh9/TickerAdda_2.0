document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../auth/login.html';
        return;
    }

    const container = document.querySelector('.glass-card-container');

    // Load Pending Tickets
    try {
        const res = await fetch('/api/tickets/pending', {
            headers: { 'x-auth-token': token }
        });
        const tickets = await res.json();

        if (tickets.length === 0) {
            // Keep the empty state if no tickets
            return;
        }

        // Generate Ticket Cards
        let html = '<div class="approval-grid">';
        tickets.forEach(ticket => {
            html += `
                <div class="approval-card">
                    <div class="ticket-header">
                        <h3>${getEventName(ticket.event)}</h3>
                        <span class="badge badge-warning">Pending</span>
                    </div>
                    <div class="ticket-details">
                        <p><strong>Seller:</strong> ${ticket.seller ? ticket.seller.name : 'Unknown'}</p>
                        <p><strong>Category:</strong> ${ticket.category}</p>
                        <p><strong>Seat:</strong> ${ticket.seat || 'Any'}</p>
                        <div class="file-preview" style="margin: 15px 0; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-file-pdf" style="color: #e74c3c; font-size: 24px;"></i>
                            <div>
                                <p style="margin: 0; font-size: 0.85rem; color: #fff;">Ticket Attachment</p>
                                <button onclick="openPreview('/${ticket.fileUrl}')" style="background: none; border: none; font-size: 0.8rem; color: var(--primary-color); cursor: pointer; padding: 0; text-decoration: underline;">Preview File</button>
                            </div>
                        </div>
                        <p><strong>Price:</strong> ₹${ticket.price} x ${ticket.quantity}</p>
                        <p><strong>Total:</strong> ₹${ticket.price * ticket.quantity}</p>
                    </div>
                    <div class="ticket-actions">
                        <button class="btn-approve" onclick="updateStatus('${ticket._id}', 'approved')">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="btn-reject" onclick="updateStatus('${ticket._id}', 'rejected')">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    </div>
                </div>
            `;
        });
        html += '</div>';

        container.innerHTML = html;

        // Modal Logic
        const modal = document.getElementById('previewModal');
        const span = document.getElementsByClassName("close-modal")[0];

        span.onclick = function () {
            modal.style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

    } catch (err) {
        console.error('Error fetching tickets:', err);
    }
});

function openPreview(url) {
    const modal = document.getElementById('previewModal');
    const container = document.getElementById('fileContainer');

    // Determine file type based on extension
    const ext = url.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
        container.innerHTML = `<img src="${url}" alt="Ticket Preview">`;
    } else if (ext === 'pdf') {
        container.innerHTML = `<iframe src="${url}"></iframe>`;
    } else {
        container.innerHTML = `<p>File type not supported for preview: <a href="${url}" target="_blank">Download File</a></p>`;
    }

    modal.style.display = "block";
}

function getEventName(id) {
    const events = {
        '1': 'Arijit Singh Live',
        '2': 'IPL 2026: MI vs CSK',
        '3': 'Coldplay World Tour'
    };
    return events[id] || 'Unknown Event';
}

async function updateStatus(id, status) {
    const token = localStorage.getItem('token');
    if (!confirm(`Are you sure you want to ${status} this ticket?`)) return;

    try {
        const res = await fetch(`/api/tickets/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ status })
        });

        if (res.ok) {
            alert(`Ticket ${status} successfully!`);
            window.location.reload();
        } else {
            alert('Failed to update status');
        }
    } catch (err) {
        console.error(err);
        alert('Server Error');
    }
}

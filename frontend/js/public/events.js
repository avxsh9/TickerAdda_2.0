document.addEventListener('DOMContentLoaded', async () => {
    const eventsContainer = document.getElementById('eventsGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');

    try {
        const res = await fetch('/api/tickets/approved');
        const tickets = await res.json();

        if (tickets.length === 0) {
            eventsContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #aaa;"><h3>No events found</h3><p>Check back later for new tickets!</p></div>';
            return;
        }

        // Initial Render
        renderTickets(tickets);

        // Filter Logic
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const category = btn.getAttribute('data-category');

                if (category === 'all') {
                    renderTickets(tickets);
                } else {
                    const filtered = tickets.filter(t => t.type === category);
                    renderTickets(filtered);
                }
            });
        });

    } catch (err) {
        console.error(err);
        eventsContainer.innerHTML = '<p style="color:red; text-align:center;">Error loading events.</p>';
    }

    function renderTickets(data) {
        if (data.length === 0) {
            eventsContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #aaa;"><h3>No tickets in this category</h3></div>';
            return;
        }

        let html = '';
        data.forEach(ticket => {
            const eventName = ticket.event;
            const imageUrl = getEventImageUrl(eventName);

            const isSold = ticket.status === 'sold';
            const statusBadge = isSold
                ? '<span class="badge badge-category" style="position: relative; margin: 10px; background: #dc2626; padding: 5px 10px; border-radius: 20px; font-size: 12px; color: white;">SOLD OUT</span>'
                : `<span class="badge badge-category" style="position: relative; margin: 10px; background: rgba(59, 130, 246, 0.9); padding: 5px 10px; border-radius: 20px; font-size: 12px; color: white;">LIVE</span>`;

            const buttonHtml = isSold
                ? '<button class="btn btn-sm btn-outline-danger" disabled>Sold Out</button>'
                : `<button class="btn btn-sm btn-primary" onclick="buyTicket('${ticket._id}', '${ticket.price}')">Buy Ticket</button>`;

            html += `
                <div class="card event-card" style="${isSold ? 'opacity: 0.7;' : ''}">
                    <div class="card-image" style="height: 200px; background-image: url('${imageUrl}'); background-size: cover; background-position: center; display: flex; align-items: flex-end; justify-content: flex-end; position: relative;">
                         <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);"></div>
                        ${statusBadge}
                    </div>
                    <div class="card-content">
                        <h3>${eventName}</h3>
                        <p class="date"><i class="far fa-calendar-alt"></i> ${new Date().toLocaleDateString()}</p>
                        <p class="location"><i class="fas fa-map-marker-alt"></i> ${ticket.seat || 'General Admission'}</p>
                        <div class="price-action">
                            <span class="price">₹${ticket.price}</span>
                            ${buttonHtml}
                        </div>
                    </div>
                </div>
            `;
        });
        eventsContainer.innerHTML = html;
    }
});

// buyTicket is now in common.js

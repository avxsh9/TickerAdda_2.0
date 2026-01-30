document.addEventListener('DOMContentLoaded', async () => {
    // Corrected ID to match index.html
    const eventContainer = document.getElementById('trendingEventsGrid');
    if (!eventContainer) return;

    try {
        const res = await fetch('/api/tickets/approved');
        const tickets = await res.json();

        if (tickets.length === 0) {
            eventContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #aaa;">No tickets available right now.</p>';
            return;
        }

        // Group tickets by Event Name to show distinct events
        // OR simply list all tickets. For a marketplace, listing tickets is fine.
        // Let's stick to the design which shows "Events". Ideally, we'd have an Event model.
        // Since we only have tickets, we will display tickets as cards.

        let allTickets = tickets;

        // Function to render tickets
        function renderTickets(ticketsToRender) {
            if (ticketsToRender.length === 0) {
                eventContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #aaa;">No tickets found in this category.</p>';
                return;
            }

            let html = '';
            ticketsToRender.forEach(ticket => {
                const eventName = ticket.event;
                const imageUrl = getEventImageUrl(eventName); // From common.js

                const isSold = ticket.status === 'sold';
                const statusBadge = isSold
                    ? '<span class="badge" style="position: relative; margin: 10px; background: #dc2626; color: white;">SOLD OUT</span>'
                    : '<span class="badge" style="position: relative; margin: 10px; background: rgba(255,255,255,0.2); backdrop-filter: blur(5px); color: #fff;">LIVE</span>';

                const buttonHtml = isSold
                    ? '<button class="btn btn-sm btn-outline-danger" disabled>Sold Out</button>'
                    : `<button class="btn btn-sm btn-primary" onclick="buyTicket('${ticket._id}', '${ticket.price}')">Buy Now</button>`;

                html += `
                    <div class="card event-card" style="${isSold ? 'opacity: 0.7;' : ''}">
                        <div class="card-image" style="height: 180px; background-image: url('${imageUrl}'); background-size: cover; background-position: center; display: flex; align-items: flex-end; justify-content: flex-end; position: relative;">
                            <!-- Gradient Overlay -->
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
            eventContainer.innerHTML = html;
        }

        // Initial Render
        renderTickets(allTickets);

        // Tab Filtering Logic
        const tabs = document.querySelectorAll('.category-pill'); // Updated selector
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // remove active class from all
                tabs.forEach(t => t.classList.remove('active'));
                // add active to clicked
                tab.classList.add('active');

                const category = tab.getAttribute('data-category');

                if (category === 'all') {
                    renderTickets(allTickets);
                } else {
                    const filtered = allTickets.filter(t => t.type === category);
                    renderTickets(filtered);
                }
            });
        });

        eventContainer.innerHTML = html;

    } catch (err) {
        console.error(err);
        eventContainer.innerHTML = '<p>Error loading events.</p>';
    }
});

function getEventName(id) {
    // Mapping IDs from the select box in sell-ticket.html
    const events = {
        '1': 'Arijit Singh Live',
        '2': 'IPL 2026: MI vs CSK',
        '3': 'Coldplay World Tour'
    };
    return events[id] || id; // Fallback to ID if not found
}

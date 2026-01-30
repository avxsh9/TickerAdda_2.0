document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('ticketFile');
    const fileNameDisplay = document.getElementById('fileName');

    // 1. Click to Upload
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    // 2. Handle File Selection
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // 3. Drag & Drop Visuals
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropZone.style.borderColor = 'var(--primary)';
        dropZone.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
    }

    function unhighlight() {
        dropZone.style.borderColor = 'var(--glass-border)';
        dropZone.style.backgroundColor = 'transparent';
    }

    // 4. Handle Dropped File
    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            fileInput.files = files; // Sync with input
            handleFile(files[0]);
        }
    });

    function handleFile(file) {
        // Validation (PDF or Image)
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            alert('Invalid file type. Please upload a PDF or Image.');
            fileInput.value = ''; // Reset
            fileNameDisplay.textContent = '';
            return;
        }

        // Size Limit (e.g., 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File is too large. Max size is 5MB.');
            fileInput.value = '';
            fileNameDisplay.textContent = '';
            return;
        }

        // Success
        fileNameDisplay.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 5px;"></i> ${file.name}`;
    }

    // 5. Handle Form Submission
    const submitBtn = document.querySelector('button[class="btn btn-primary"]');
    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const event = document.querySelector('input[name="event"]').value;
            const category = document.querySelector('input[placeholder="e.g. Diamond, Block A"]').value;
            const seat = document.querySelector('input[placeholder="e.g. A-12"]').value;
            const quantity = document.querySelector('input[type="number"]').value;
            const price = document.querySelector('input[placeholder="0.00"]').value;
            const fileInput = document.getElementById('ticketFile');

            if (!event || !category || !price) {
                alert("Please fill in required fields (Event, Category, Price)");
                return;
            }

            if (fileInput.files.length === 0) {
                alert("Please upload a ticket file.");
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '../auth/login.html';
                return;
            }

            try {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Listing...';
                submitBtn.disabled = true;

                // Create FormData
                const formData = new FormData();
                formData.append('event', event);
                const eventType = document.querySelector('select[name="type"]').value; // capture type
                formData.append('type', eventType);
                formData.append('category', category); // This is section (e.g. VIP)
                formData.append('seat', seat);
                formData.append('quantity', quantity);
                formData.append('price', price);
                formData.append('ticketFile', fileInput.files[0]);

                const res = await fetch('/api/tickets', {
                    method: 'POST',
                    headers: {
                        'x-auth-token': token
                        // Content-Type is NOT set here, as browser sets it for FormData
                    },
                    body: formData
                });

                if (res.ok) {
                    alert('Ticket listed successfully! It is pending admin approval.');
                    window.location.href = '../seller/dashboard.html';
                } else {
                    const data = await res.json();
                    alert(data.msg || 'Error listing ticket');
                }
            } catch (err) {
                console.error(err);
                alert('Server Error');
            } finally {
                submitBtn.innerHTML = 'List Ticket for Sale';
                submitBtn.disabled = false;
            }
        });
    }
});

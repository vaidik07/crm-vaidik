document.getElementById('customerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email })
    });

    if (response.status === 202) {
        alert('Customer added successfully!');
    } else {
        alert('Failed to add customer.');
    }
});

document.getElementById('orderForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const customer_id = document.getElementById('customer_id').value;
    const amount = document.getElementById('amount').value;

    const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ customer_id, amount })
    });

    if (response.status === 202) {
        alert('Order added successfully!');
    } else {
        alert('Failed to add order.');
    }
});

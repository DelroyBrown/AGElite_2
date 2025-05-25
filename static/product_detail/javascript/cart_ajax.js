
// Utility to get CSRF token from cookies (Django requirement)
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        document.cookie.split(';').forEach(cookie => {
            const [key, value] = cookie.trim().split('=');
            if (key === name) cookieValue = decodeURIComponent(value);
        });
    }
    return cookieValue;
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('cartEffect');
    if (!btn) return;  // safety check

    const url = btn.getAttribute('data-url');
    const qtySelector = btn.getAttribute('data-quantity-input');
    const qtyInput = document.querySelector(qtySelector);
    const csrftoken = getCookie('csrftoken');

    btn.addEventListener('click', async event => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('quantity', qtyInput ? qtyInput.value : 1);
        formData.append('update', false);

        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',  // Ensure cookies (session & CSRF) are sent
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrftoken
            },
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            // Update badge count
            const badge = document.querySelector('.cart-menu .label-theme');
            if (badge) badge.textContent = data.count;

            // Update the dropdown total price
            const totalBtn = document.getElementById('cartTotalPriceButton');
            if (totalBtn) totalBtn.textContent = `£${data.total}`;
            // Populate drawer list
            const list = document.querySelector('.cart-menu ul.custom-scroll');
            if (list) {
                list.innerHTML = '';
                data.items.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${item.name}</strong> x ${item.qty} = £${item.total_price}`;
                    list.appendChild(li);
                });
            }
            // Add “View Cart” button if not present
            const cartMenu = document.querySelector('.cart-menu');
            if (cartMenu && !cartMenu.querySelector('.go-to-cart')) {
                const go = document.createElement('a');
                go.href = '{% url "cart_detail" %}';
                go.className = 'btn btn-primary go-to-cart';
                go.textContent = 'View Cart';
                cartMenu.appendChild(go);
            }
            // Show drawer
            const drawer = document.querySelector('.onhover-div');
            if (drawer) drawer.classList.add('open');
        } else {
            console.error('Cart AJAX failed:', response.statusText);
        }
    });
});

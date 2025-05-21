// Helper to pull the CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        document.cookie.split(';').forEach(cookie => {
            const [key, val] = cookie.trim().split('=');
            if (key === name) cookieValue = decodeURIComponent(val);
        });
    }
    return cookieValue;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-to-cart-form');
    if (!form) return;

    const url = form.dataset.url;
    const csrftoken = getCookie('csrftoken');

    form.addEventListener('submit', async e => {
        e.preventDefault();               // ← stop the full-page form submit
        const formData = new FormData(form);

        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',     // send cookies
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrftoken
            },
            body: formData
        });

        if (!response.ok) {
            console.error('Cart AJAX failed:', response.statusText);
            return;
        }

        const data = await response.json();

        // 1) Update the badge count
        const badge = document.querySelector('.cart-menu .label-theme');
        if (badge) badge.textContent = data.count;

        // 2) Rebuild the drawer’s item list
        const list = document.querySelector('.cart-menu ul.custom-scroll');
        if (list) {
            list.innerHTML = '';
            data.items.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
          <strong>${item.name}</strong>
          &times; ${item.qty}
          = £${item.total_price}
        `;
                list.appendChild(li);
            });
        }

        // 3) Ensure there’s a “View Cart” button at the bottom
        const cartMenu = document.querySelector('.cart-menu');
        if (cartMenu && !cartMenu.querySelector('.go-to-cart')) {
            const go = document.createElement('a');
            go.href = '{% url "cart_detail" %}';
            go.className = 'btn btn-primary go-to-cart';
            go.textContent = 'View Cart';
            cartMenu.appendChild(go);
        }

        // 4) Finally, open the drawer
        const drawer = document.querySelector('.onhover-div');
        if (drawer) drawer.classList.add('open');
    });
});

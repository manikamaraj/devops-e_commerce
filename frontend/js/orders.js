/**
 * orders.js — Order history page: look up orders by email
 */

document.addEventListener('DOMContentLoaded', () => {
  // Allow pressing Enter in the email field
  document.getElementById('orderEmail').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') lookupOrders();
  });
});

async function lookupOrders() {
  const email = document.getElementById('orderEmail').value.trim();
  if (!email) {
    showToast('Please enter your email address', 'error');
    return;
  }

  const loading = document.getElementById('ordersLoading');
  const list = document.getElementById('ordersList');
  const empty = document.getElementById('ordersEmpty');

  loading.style.display = 'flex';
  list.innerHTML = '';
  empty.style.display = 'none';

  try {
    const orders = await apiFetch(`/orders?email=${encodeURIComponent(email)}`);
    loading.style.display = 'none';

    if (orders.length === 0) {
      empty.style.display = 'block';
      return;
    }

    list.innerHTML = orders.map(renderOrderCard).join('');
  } catch (err) {
    loading.style.display = 'none';
    showToast(err.message || 'Failed to fetch orders', 'error');
  }
}

function renderOrderCard(order) {
  const itemsHtml = order.items
    .map(
      (item) => `
    <div class="nc-order-item">
      <div class="nc-order-item-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <span class="nc-order-item-name">${item.name}</span>
      <span class="nc-order-item-qty">× ${item.quantity}</span>
      <span class="nc-order-item-price">${formatPrice(item.price * item.quantity)}</span>
    </div>`
    )
    .join('');

  return `
    <div class="nc-order-card">
      <div class="nc-order-header">
        <div>
          <div class="nc-order-id">Order #${order._id.slice(-8).toUpperCase()}</div>
          <div class="nc-order-date">${formatDate(order.createdAt)}</div>
        </div>
        <div class="d-flex gap-2">
          ${statusBadge(order.status)}
          ${statusBadge(order.paymentStatus)}
        </div>
      </div>
      ${itemsHtml}
      <div class="nc-order-footer">
        <div class="nc-order-total">Total: ${formatPrice(order.totalAmount)}</div>
      </div>
    </div>`;
}

/**
 * checkout.js — Checkout page logic: validate, submit order to API, show confirmation
 */

document.addEventListener('DOMContentLoaded', () => {
  const items = Cart.getAll();
  if (items.length === 0) {
    document.getElementById('checkoutSection').style.display = 'none';
    document.getElementById('checkoutEmpty').style.display = 'block';
    return;
  }
  renderCheckoutSummary(items);
});

function renderCheckoutSummary(items) {
  const container = document.getElementById('coItems');
  container.innerHTML = items
    .map(
      (item) => `
    <div class="d-flex justify-content-between align-items-center py-2" style="border-bottom:1px solid var(--nc-gray-200)">
      <div class="d-flex align-items-center gap-2">
        <img src="${item.image}" alt="${item.name}" style="width:40px;height:40px;border-radius:6px;object-fit:cover">
        <div>
          <div style="font-weight:500;font-size:0.85rem">${item.name}</div>
          <div style="font-size:0.78rem;color:var(--nc-gray-500)">Qty: ${item.quantity}</div>
        </div>
      </div>
      <div style="font-weight:600;font-size:0.88rem">${formatPrice(item.price * item.quantity)}</div>
    </div>`
    )
    .join('');

  const total = Cart.getTotal();
  document.getElementById('coSubtotal').textContent = formatPrice(total);
  document.getElementById('coTotal').textContent = formatPrice(total);
}

async function placeOrder(event) {
  event.preventDefault();

  const name = document.getElementById('coName').value.trim();
  const email = document.getElementById('coEmail').value.trim();
  const address = document.getElementById('coAddress').value.trim();
  const city = document.getElementById('coCity').value.trim();
  const pincode = document.getElementById('coPincode').value.trim();

  // Frontend validation
  if (!name) return showToast('Please enter your full name', 'error');
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return showToast('Please enter a valid email address', 'error');
  if (!address) return showToast('Please enter your delivery address', 'error');
  if (!city) return showToast('Please enter your city', 'error');
  if (!pincode) return showToast('Please enter your pincode', 'error');

  const items = Cart.getAll();
  if (items.length === 0) return showToast('Your cart is empty', 'error');

  const btn = document.getElementById('placeOrderBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Placing order...';

  try {
    const orderData = {
      customer: { name, email, address, city, pincode },
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    };

    const order = await apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });

    // Clear cart
    Cart.clear();

    // Show confirmation
    showConfirmation(order);
  } catch (error) {
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-lock"></i> Place Order';
    showToast(error.message || 'Failed to place order', 'error');
  }
}

function showConfirmation(order) {
  document.getElementById('checkoutSection').style.display = 'none';
  document.querySelector('.nc-page-header').style.display = 'none';
  document.getElementById('confirmationSection').style.display = 'block';

  document.getElementById('confMsg').textContent = `Thank you, ${order.customer.name}. Your order has been placed successfully.`;
  document.getElementById('confOrderId').textContent = order._id;
  document.getElementById('confName').textContent = order.customer.name;
  document.getElementById('confTotal').textContent = formatPrice(order.totalAmount);
  document.getElementById('confDate').textContent = formatDate(order.createdAt);
  document.getElementById('confPayment').textContent = 'Payment confirmed';
  document.getElementById('confStatus').innerHTML = statusBadge(order.status);
}

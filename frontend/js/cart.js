/**
 * cart.js — Cart page logic: render cart items, update quantities, remove items
 */

document.addEventListener('DOMContentLoaded', renderCart);

function renderCart() {
  const items = Cart.getAll();
  const content = document.getElementById('cartContent');
  const empty = document.getElementById('cartEmpty');

  if (items.length === 0) {
    content.style.display = 'none';
    empty.style.display = 'block';
    return;
  }

  content.style.display = 'block';
  empty.style.display = 'none';

  const container = document.getElementById('cartItems');
  container.innerHTML = items
    .map(
      (item) => `
    <div class="nc-cart-item" data-id="${item.productId}">
      <div class="nc-cart-item-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="nc-cart-item-info">
        <div class="nc-cart-item-name">${item.name}</div>
        <div class="nc-cart-item-price">${formatPrice(item.price)} each</div>
      </div>
      <div class="nc-qty-selector">
        <button type="button" onclick="updateCartQty('${item.productId}', ${item.quantity - 1})">−</button>
        <input type="text" class="nc-qty-value" value="${item.quantity}" readonly>
        <button type="button" onclick="updateCartQty('${item.productId}', ${item.quantity + 1})">+</button>
      </div>
      <div class="nc-cart-item-subtotal">${formatPrice(item.price * item.quantity)}</div>
      <button class="nc-cart-item-remove" onclick="removeCartItem('${item.productId}')" title="Remove item">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>`
    )
    .join('');

  updateSummary();
}

function updateCartQty(productId, newQty) {
  if (newQty < 1) {
    removeCartItem(productId);
    return;
  }
  Cart.updateQuantity(productId, newQty);
  renderCart();
}

function removeCartItem(productId) {
  Cart.removeItem(productId);
  showToast('Item removed from cart');
  renderCart();
}

function updateSummary() {
  const total = Cart.getTotal();
  document.getElementById('cartSubtotal').textContent = formatPrice(total);
  document.getElementById('cartTotal').textContent = formatPrice(total);
}

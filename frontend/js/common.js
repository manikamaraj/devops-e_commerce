/**
 * common.js — Shared utilities used across all NovaCart pages
 */

const API_BASE = '/api';

// ── Cart (localStorage) ─────────────────────────────────────
const Cart = {
  KEY: 'novacart_cart',

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch {
      return [];
    }
  },

  save(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this.updateBadge();
  },

  addItem(product, qty = 1) {
    const items = this.getAll();
    const idx = items.findIndex((i) => i.productId === product._id);
    if (idx > -1) {
      items[idx].quantity += qty;
    } else {
      items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: qty,
      });
    }
    this.save(items);
  },

  updateQuantity(productId, qty) {
    const items = this.getAll();
    const idx = items.findIndex((i) => i.productId === productId);
    if (idx > -1) {
      items[idx].quantity = Math.max(1, qty);
      this.save(items);
    }
  },

  removeItem(productId) {
    let items = this.getAll();
    items = items.filter((i) => i.productId !== productId);
    this.save(items);
  },

  clear() {
    localStorage.removeItem(this.KEY);
    this.updateBadge();
  },

  getCount() {
    return this.getAll().reduce((sum, i) => sum + i.quantity, 0);
  },

  getTotal() {
    return this.getAll().reduce((sum, i) => sum + i.price * i.quantity, 0);
  },

  updateBadge() {
    const badges = document.querySelectorAll('.nc-cart-count');
    const count = this.getCount();
    badges.forEach((b) => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });
  },
};

// ── API Helpers ──────────────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  } catch (error) {
    throw error;
  }
}

// ── Format Currency ──────────────────────────────────────────
function formatPrice(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

// ── Render Star Rating ───────────────────────────────────────
function renderStars(rating) {
  let html = '';
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  for (let i = 0; i < full; i++) {
    html += '<i class="bi bi-star-fill"></i>';
  }
  if (half) html += '<i class="bi bi-star-half"></i>';
  const empty = 5 - full - (half ? 1 : 0);
  for (let i = 0; i < empty; i++) {
    html += '<i class="bi bi-star"></i>';
  }
  html += `<span class="ms-1" style="color:var(--nc-gray-500);font-size:0.8rem">${rating.toFixed(1)}</span>`;
  return html;
}

// ── Toast Notification ───────────────────────────────────────
function showToast(message, type = 'success') {
  // Remove existing
  document.querySelectorAll('.nc-toast').forEach((t) => t.remove());

  const icon = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill';
  const toast = document.createElement('div');
  toast.className = `nc-toast nc-toast-${type}`;
  toast.innerHTML = `<i class="bi ${icon}"></i> ${message}`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ── Status Badge HTML ────────────────────────────────────────
function statusBadge(status) {
  const key = status.toLowerCase();
  return `<span class="nc-badge nc-badge-${key}">${status}</span>`;
}

// ── Date Formatter ───────────────────────────────────────────
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ── Init cart badge on every page load ────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
});

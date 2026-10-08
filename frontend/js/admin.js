/**
 * admin.js — Admin dashboard logic: product CRUD, order management
 */

let productModal;

document.addEventListener('DOMContentLoaded', () => {
  productModal = new bootstrap.Modal(document.getElementById('productModal'));
  loadAdminProducts();
  loadAdminOrders();
});

// ── Product Management ───────────────────────────────────────

async function loadAdminProducts() {
  const loading = document.getElementById('productsLoading');
  const table = document.getElementById('productsTable');
  const body = document.getElementById('productsBody');

  loading.style.display = 'flex';
  table.style.display = 'none';

  try {
    const products = await apiFetch('/products');
    loading.style.display = 'none';
    table.style.display = 'table';

    if (products.length === 0) {
      body.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No products found. Add your first product.</td></tr>`;
      return;
    }

    body.innerHTML = products
      .map(
        (p) => `
      <tr>
        <td><img src="${p.image}" alt="${p.name}" class="nc-admin-product-img"></td>
        <td>
          <div style="font-weight:600">${p.name}</div>
          <div style="font-size:0.78rem;color:var(--nc-gray-500)">${truncate(p.description, 60)}</div>
        </td>
        <td><span class="nc-badge nc-badge-placed">${p.category}</span></td>
        <td style="font-weight:600">${formatPrice(p.price)}</td>
        <td>
          <span class="${p.stock > 0 ? 'nc-stock-in' : 'nc-stock-out'}">${p.stock}</span>
        </td>
        <td>${p.rating.toFixed(1)}</td>
        <td>
          <div class="nc-admin-actions">
            <button class="btn btn-sm btn-outline-secondary" onclick='editProduct(${JSON.stringify(p)})' title="Edit">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${p._id}', '${escapeHtml(p.name)}')" title="Delete">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>`
      )
      .join('');
  } catch (err) {
    loading.style.display = 'none';
    showToast('Failed to load products', 'error');
  }
}

function openProductModal(product = null) {
  const form = document.getElementById('productForm');
  form.reset();
  document.getElementById('pmId').value = '';
  document.getElementById('pmRating').value = '0';

  if (product) {
    document.getElementById('productModalTitle').textContent = 'Edit Product';
    document.getElementById('pmSaveBtn').textContent = 'Update Product';
    document.getElementById('pmId').value = product._id;
    document.getElementById('pmName').value = product.name;
    document.getElementById('pmDesc').value = product.description;
    document.getElementById('pmPrice').value = product.price;
    document.getElementById('pmStock').value = product.stock;
    document.getElementById('pmCategory').value = product.category;
    document.getElementById('pmRating').value = product.rating;
    document.getElementById('pmImage').value = product.image;
  } else {
    document.getElementById('productModalTitle').textContent = 'Add Product';
    document.getElementById('pmSaveBtn').textContent = 'Save Product';
  }

  productModal.show();
}

function editProduct(product) {
  openProductModal(product);
}

async function saveProduct() {
  const id = document.getElementById('pmId').value;
  const data = {
    name: document.getElementById('pmName').value.trim(),
    description: document.getElementById('pmDesc').value.trim(),
    price: parseFloat(document.getElementById('pmPrice').value),
    stock: parseInt(document.getElementById('pmStock').value, 10),
    category: document.getElementById('pmCategory').value.trim(),
    rating: parseFloat(document.getElementById('pmRating').value) || 0,
    image: document.getElementById('pmImage').value.trim(),
  };

  // Frontend validation
  if (!data.name) return showToast('Product name is required', 'error');
  if (!data.description) return showToast('Description is required', 'error');
  if (isNaN(data.price) || data.price < 0) return showToast('Price must be 0 or greater', 'error');
  if (isNaN(data.stock) || data.stock < 0) return showToast('Stock must be 0 or greater', 'error');
  if (!data.category) return showToast('Category is required', 'error');
  if (!data.image) return showToast('Image URL is required', 'error');

  const btn = document.getElementById('pmSaveBtn');
  btn.disabled = true;
  btn.textContent = 'Saving...';

  try {
    if (id) {
      await apiFetch(`/admin/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      showToast('Product updated successfully');
    } else {
      await apiFetch('/admin/products', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      showToast('Product added successfully');
    }

    productModal.hide();
    loadAdminProducts();
  } catch (err) {
    showToast(err.message || 'Failed to save product', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = id ? 'Update Product' : 'Save Product';
  }
}

async function deleteProduct(id, name) {
  if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

  try {
    await apiFetch(`/admin/products/${id}`, { method: 'DELETE' });
    showToast('Product deleted successfully');
    loadAdminProducts();
  } catch (err) {
    showToast(err.message || 'Failed to delete product', 'error');
  }
}

// ── Order Management ─────────────────────────────────────────

async function loadAdminOrders() {
  const loading = document.getElementById('ordersLoading');
  const list = document.getElementById('adminOrdersList');
  const empty = document.getElementById('ordersEmpty');

  loading.style.display = 'flex';
  list.innerHTML = '';
  empty.style.display = 'none';

  try {
    const orders = await apiFetch('/orders/admin/all');
    loading.style.display = 'none';

    if (orders.length === 0) {
      empty.style.display = 'block';
      return;
    }

    list.innerHTML = orders.map(renderAdminOrderCard).join('');
  } catch (err) {
    loading.style.display = 'none';
    showToast('Failed to load orders', 'error');
  }
}

function renderAdminOrderCard(order) {
  const statusOptions = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const selectHtml = statusOptions
    .map((s) => `<option value="${s}" ${s === order.status ? 'selected' : ''}>${s}</option>`)
    .join('');

  const itemsSummary = order.items
    .map((i) => `${i.name} × ${i.quantity}`)
    .join(', ');

  return `
    <div class="nc-order-card">
      <div class="nc-order-header">
        <div>
          <div class="nc-order-id">Order #${order._id.slice(-8).toUpperCase()}</div>
          <div class="nc-order-date">${formatDate(order.createdAt)}</div>
        </div>
        <div class="d-flex align-items-center gap-2 flex-wrap">
          ${statusBadge(order.paymentStatus)}
          <select class="form-select form-select-sm" style="width:auto;font-size:0.8rem;border-radius:50px" onchange="updateOrderStatus('${order._id}', this.value)">
            ${selectHtml}
          </select>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-md-4">
          <div style="font-size:0.78rem;color:var(--nc-gray-500);text-transform:uppercase;letter-spacing:0.5px;font-weight:600;margin-bottom:0.25rem">Customer</div>
          <div style="font-weight:600;font-size:0.9rem">${order.customer.name}</div>
          <div style="font-size:0.82rem;color:var(--nc-gray-500)">${order.customer.email}</div>
          <div style="font-size:0.82rem;color:var(--nc-gray-500)">${order.customer.address}, ${order.customer.city} – ${order.customer.pincode}</div>
        </div>
        <div class="col-md-5">
          <div style="font-size:0.78rem;color:var(--nc-gray-500);text-transform:uppercase;letter-spacing:0.5px;font-weight:600;margin-bottom:0.25rem">Items</div>
          <div style="font-size:0.85rem">${itemsSummary}</div>
        </div>
        <div class="col-md-3 text-md-end">
          <div style="font-size:0.78rem;color:var(--nc-gray-500);text-transform:uppercase;letter-spacing:0.5px;font-weight:600;margin-bottom:0.25rem">Total</div>
          <div style="font-size:1.15rem;font-weight:700">${formatPrice(order.totalAmount)}</div>
        </div>
      </div>
    </div>`;
}

async function updateOrderStatus(orderId, status) {
  try {
    await apiFetch(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    showToast(`Order status updated to ${status}`);
    loadAdminOrders();
  } catch (err) {
    showToast(err.message || 'Failed to update order', 'error');
    loadAdminOrders(); // Revert UI
  }
}

// ── Helpers ──────────────────────────────────────────────────

function truncate(str, len) {
  return str.length > len ? str.substring(0, len) + '...' : str;
}

function escapeHtml(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

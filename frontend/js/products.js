/**
 * products.js — Home page logic: fetch products, search, filter by category
 */

let allProducts = [];
let currentCategory = 'All';
let searchTimeout;

document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadProducts();

  // Search with debounce
  document.getElementById('searchInput').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => loadProducts(), 350);
  });
});

async function loadCategories() {
  try {
    const categories = await apiFetch('/products/categories');
    const container = document.getElementById('categoryFilters');
    let html = `<button class="nc-category-btn active" onclick="filterCategory('All', this)">All</button>`;
    categories.forEach((cat) => {
      html += `<button class="nc-category-btn" onclick="filterCategory('${cat}', this)">${cat}</button>`;
    });
    container.innerHTML = html;
  } catch (err) {
    console.error('Failed to load categories:', err);
  }
}

async function loadProducts() {
  const grid = document.getElementById('productGrid');
  const loading = document.getElementById('productsLoading');
  const empty = document.getElementById('productsEmpty');
  const search = document.getElementById('searchInput').value.trim();

  loading.style.display = 'flex';
  grid.innerHTML = '';
  empty.style.display = 'none';

  try {
    let query = '/products?';
    if (search) query += `search=${encodeURIComponent(search)}&`;
    if (currentCategory && currentCategory !== 'All') query += `category=${encodeURIComponent(currentCategory)}`;

    allProducts = await apiFetch(query);
    loading.style.display = 'none';

    if (allProducts.length === 0) {
      empty.style.display = 'block';
      return;
    }

    grid.innerHTML = allProducts.map(productCard).join('');
  } catch (err) {
    loading.style.display = 'none';
    grid.innerHTML = `<div class="col-12"><div class="alert alert-danger">Failed to load products. Please try again.</div></div>`;
  }
}

function filterCategory(category, btn) {
  currentCategory = category;
  document.querySelectorAll('.nc-category-btn').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  loadProducts();
}

function resetFilters() {
  currentCategory = 'All';
  document.getElementById('searchInput').value = '';
  document.querySelectorAll('.nc-category-btn').forEach((b) => b.classList.remove('active'));
  const allBtn = document.querySelector('.nc-category-btn');
  if (allBtn) allBtn.classList.add('active');
  loadProducts();
}

function productCard(product) {
  const inStock = product.stock > 0;
  return `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="nc-product-card">
        <a href="product.html?id=${product._id}" class="card-img-wrap">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </a>
        <div class="card-body">
          <div class="nc-card-category">${product.category}</div>
          <h6 class="nc-card-title"><a href="product.html?id=${product._id}">${product.name}</a></h6>
          <div class="nc-card-rating">${renderStars(product.rating)}</div>
          <p class="nc-card-desc">${product.description}</p>
          <div class="nc-card-bottom">
            <div>
              <div class="nc-card-price">${formatPrice(product.price)}</div>
              <div class="nc-card-stock ${inStock ? 'nc-stock-in' : 'nc-stock-out'}">
                ${inStock ? `In stock (${product.stock})` : 'Out of stock'}
              </div>
            </div>
            <button class="nc-card-add-btn" onclick="addToCartFromGrid('${product._id}')" ${!inStock ? 'disabled' : ''}>
              ${inStock ? '<i class="bi bi-bag-plus"></i> Add' : 'Sold out'}
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

function addToCartFromGrid(productId) {
  const product = allProducts.find((p) => p._id === productId);
  if (!product || product.stock <= 0) return;
  Cart.addItem(product, 1);
  showToast(`${product.name} added to cart`);
}

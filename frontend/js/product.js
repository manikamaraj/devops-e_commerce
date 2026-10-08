/**
 * product.js — Product detail page logic
 */

let currentProduct = null;

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    showError();
    return;
  }
  loadProduct(id);
});

async function loadProduct(id) {
  const loading = document.getElementById('productLoading');
  const detail = document.getElementById('productDetail');
  const error = document.getElementById('productError');

  try {
    currentProduct = await apiFetch(`/products/${id}`);
    loading.style.display = 'none';

    // Populate page
    document.title = `${currentProduct.name} — NovaCart`;
    document.getElementById('bcName').textContent = currentProduct.name;
    document.getElementById('pdImage').src = currentProduct.image;
    document.getElementById('pdImage').alt = currentProduct.name;
    document.getElementById('pdCategory').textContent = currentProduct.category;
    document.getElementById('pdName').textContent = currentProduct.name;
    document.getElementById('pdRating').innerHTML = renderStars(currentProduct.rating);
    document.getElementById('pdPrice').textContent = formatPrice(currentProduct.price);
    document.getElementById('pdDesc').textContent = currentProduct.description;

    const inStock = currentProduct.stock > 0;
    document.getElementById('pdStock').className = `nc-card-stock ${inStock ? 'nc-stock-in' : 'nc-stock-out'}`;
    document.getElementById('pdStock').textContent = inStock ? `In stock (${currentProduct.stock} available)` : 'Out of stock';

    if (!inStock) {
      document.getElementById('pdAddBtn').disabled = true;
      document.getElementById('pdAddBtn').innerHTML = 'Out of stock';
      document.getElementById('pdActions').querySelector('.nc-qty-selector').style.display = 'none';
    }

    detail.style.display = 'block';
  } catch (err) {
    loading.style.display = 'none';
    showError();
  }
}

function showError() {
  document.getElementById('productLoading').style.display = 'none';
  document.getElementById('productError').style.display = 'block';
}

function changeQty(delta) {
  const input = document.getElementById('pdQty');
  let val = parseInt(input.value, 10) + delta;
  if (val < 1) val = 1;
  if (currentProduct && val > currentProduct.stock) val = currentProduct.stock;
  input.value = val;
}

function addToCartDetail() {
  if (!currentProduct || currentProduct.stock <= 0) return;
  const qty = parseInt(document.getElementById('pdQty').value, 10);
  Cart.addItem(currentProduct, qty);
  showToast(`${currentProduct.name} added to cart`);
}

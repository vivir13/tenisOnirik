import { CartManager } from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
  const product = JSON.parse(localStorage.getItem('selectedProduct'));

  if (!product) {
    alert('No se encontró el producto');
    window.location.href = '/index.html';
    return;
  }

  // Elementos del DOM
  const img = document.getElementById('product-image');
  const nameEl = document.getElementById('product-name');
  const categoryEl = document.getElementById('product-category');
  const priceEl = document.getElementById('product-price');
  const descriptionEl = document.getElementById('product-description');
  const colorSelect = document.getElementById('color-select');
  const sizeSelect = document.getElementById('size-select');
  const quantityInput = document.getElementById('quantity');
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  const buyNowBtn = document.getElementById('buy-now-btn');

  // Rellenar información
  img.src = product.image || '/images/default.png';
  img.alt = product.name;
  nameEl.textContent = product.name;
  categoryEl.textContent = product.category || '';
  priceEl.textContent = `$${product.price.toFixed(2)}`;
  descriptionEl.textContent = product.description || 'Descripción no disponible';

  // Rellenar colores y tallas
  (product.colors || []).forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    colorSelect.appendChild(opt);
  });

  (product.sizes || []).forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    sizeSelect.appendChild(opt);
  });

  const cart = new CartManager();

  addToCartBtn.addEventListener('click', () => {
    const prodToCart = {
      ...product,
      color: colorSelect.value,
      size: sizeSelect.value,
      quantity: parseInt(quantityInput.value, 10) || 1
    };
    cart.addToCart(prodToCart);
    alert(`${product.name} agregado al carrito`);
  });

  buyNowBtn.addEventListener('click', () => {
    const prodToCart = {
      ...product,
      color: colorSelect.value,
      size: sizeSelect.value,
      quantity: parseInt(quantityInput.value, 10) || 1
    };
    cart.addToCart(prodToCart);
    window.location.href = '/assets/pages/carrito/carrito.html';
  });
});

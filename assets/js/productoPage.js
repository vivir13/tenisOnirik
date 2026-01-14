import { CartManager } from './modales/modal/cart.js'

document.addEventListener('DOMContentLoaded', () => {
  const cart = new CartManager()
  const productData = JSON.parse(localStorage.getItem('selectedProduct'))

  if (!productData) {
    alert('No se encontró el producto')
    window.location.href = '/index.html'
    return
  }

  const imgEl = document.querySelector('#product-image')
  const nameEl = document.querySelector('#product-name')
  const priceEl = document.querySelector('#product-price')
  const categoryEl = document.querySelector('#product-category')
  const descEl = document.querySelector('#product-description')
  const colorSelect = document.querySelector('#color-select')
  const sizeSelect = document.querySelector('#size-select')
  const quantityInput = document.querySelector('#quantity')

  imgEl.src = productData.image
  imgEl.alt = productData.name
  nameEl.textContent = productData.name
  priceEl.textContent = `$${productData.price}`
  categoryEl.textContent = productData.category
  descEl.textContent = productData.description || 'Sin descripción'

  // Colores
  if (productData.colors?.length) {
    productData.colors.forEach((color) => {
      const option = document.createElement('option')
      option.value = color
      option.textContent = color
      colorSelect.appendChild(option)
    })
  }

  // Tallas
  if (productData.sizes?.length) {
    productData.sizes.forEach((size) => {
      const option = document.createElement('option')
      option.value = size
      option.textContent = size
      sizeSelect.appendChild(option)
    })
  }

  const createCartProduct = () => ({
    id: productData.id,
    name: productData.name,
    price: parseFloat(productData.price),
    image: productData.image,
    color: colorSelect.value,
    size: sizeSelect.value,
    quantity: parseInt(quantityInput.value, 10) || 1,
  })

  // Añadir al carrito
  document.querySelector('#add-to-cart-btn').addEventListener('click', () => {
    const prodToCart = createCartProduct()
    cart.addToCart(prodToCart)
    alert(`${prodToCart.name} agregado al carrito`)
  })

  // Comprar ahora → abre modal del carrito
  document.querySelector('#buy-now-btn').addEventListener('click', () => {
    const prodToCart = createCartProduct()
    cart.addToCart(prodToCart)
    cart.openCart() // Abre modal con el producto agregado
  })
})

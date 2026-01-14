import { addToCart } from './modales/modal/CartManager.js'

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.add-to-cart-btn, .btn-compra')

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const product = {
        id: button.dataset.productId,
        name: button.dataset.productName,
        price: parseFloat(button.dataset.productPrice),
        image:
          button.dataset.productImage ||
          '/assets/images/placeholder-product.jpg',
      }

      addToCart(product)
    })
  })
})

// Importaciones CORRECTAS (elimina una de las dos importaciones de productCardHandler)
import { navbarHandler, scrollHandler } from './modales/navbar/navbar.js'
import { modalHandler } from './modales/modal/registro.js'
import { wishlistHandler } from './modales/modal/wishlist.js'
import { CartManager } from './modales/modal/cart.js'
import { initProductVariants } from './modales/productos/productVariants.js'
import { initProductList } from './modales/productos/lista-producto.js'
import { initProductRedirect } from './productoHandler.js'
//import { productCardHandler } from './modales/products/productCartlogica.js' // Ruta corregida
//import { filterProducts } from './modales/products/filtrarProdu.js'
//import { initProductQuickView } from './modales/products/deta-producto.js'
//import { initStripeCheckout } from './modales/stripe/stripeService.js'
//import { cartHandler } from './modales/cart/cartHandler.js'
//import { CartManager } from './modales/cart/CartManager.js' // Ruta corregida

document.addEventListener('DOMContentLoaded', () => {
  const cartManager = new CartManager()

  // Inicializa las funciones
  navbarHandler()
  scrollHandler()
  modalHandler()
  wishlistHandler()
  initProductVariants()
  initProductList()
  initProductRedirect()

  // Opcional: exponer para depuración
  window.cartManager = cartManager

  //filterProducts()

  //initProductQuickView()
  //initStripeCheckout()
  //cartHandler()

  // Usa la versión que recibe cartManager
})
// Inicialización CORRECTA del carrito
//CartUI.init()
// Si necesitas el carrito

// 3. Inicializar wishlist

//const cart = cartHandler()
// productCardHandler(cart)

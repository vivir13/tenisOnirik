const BACKEND_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:4242'
    : 'http://localhost:4242' // mientras no tengas producción, deja localhost

export class CartManager {
  constructor() {
    // Cargar carrito guardado con validación
    try {
      const savedCart = JSON.parse(localStorage.getItem('cart')) || []
      this.cartItems = savedCart.filter(
        (item) =>
          item &&
          typeof item.id === 'string' &&
          item.id.trim() !== '' &&
          typeof item.name === 'string' &&
          item.name.trim() !== '' &&
          typeof item.price === 'number' &&
          !isNaN(item.price) &&
          item.price > 0 &&
          typeof item.quantity === 'number' &&
          item.quantity > 0
      )
    } catch (e) {
      console.error('Error al cargar el carrito:', e)
      this.cartItems = []
    }

    // Elementos del DOM
    this.cartModal = document.querySelector('#cart-modal')
    this.cartItemsContainer = document.querySelector('#cart-items')
    this.cartCounter = document.querySelector('.cart-counter')
    this.cartTotal = document.querySelector('#cart-total')
    this.checkoutBtn = document.querySelector('#checkout-btn')
    this.closeBtn = document.querySelector('#close-cart')
    this.openBtn = document.querySelector('#open-cart')

    if (!this.cartModal || !this.cartItemsContainer) {
      console.error('Elementos esenciales del carrito no encontrados')
      return
    }

    this.init()
  }

  init() {
    if (this.openBtn)
      this.openBtn.addEventListener('click', () => this.openCart())
    if (this.closeBtn)
      this.closeBtn.addEventListener('click', () => this.closeCart())
    if (this.checkoutBtn)
      this.checkoutBtn.addEventListener('click', () => this.checkout())

    // Delegación de eventos para agregar productos
    document.addEventListener('click', (e) => {
      const addToCartBtn =
        e.target.closest('.add-to-cart-btn') || e.target.closest('.btn-compra')
      if (addToCartBtn) {
        const productElement =
          addToCartBtn.closest('.product-card') ||
          addToCartBtn.closest('.product-item')
        if (productElement) {
          const productData = this.getProductData(productElement, addToCartBtn)
          if (productData) {
            this.addToCart(productData)
            this.showNotification(`${productData.name} añadido al carrito`)
          }
        }
      }
    })

    this.renderCartItems()
    this.updateCartCounter()
  }

  openCart() {
    try {
      this.cartModal.classList.remove('hidden')
      document.body.style.overflow = 'hidden'
      this.cartModal.setAttribute('aria-hidden', 'false')
    } catch (e) {
      console.error('Error al abrir el carrito:', e)
    }
  }

  closeCart() {
    try {
      this.cartModal.classList.add('hidden')
      document.body.style.overflow = ''
      this.cartModal.setAttribute('aria-hidden', 'true')
      if (this.openBtn) this.openBtn.focus()
    } catch (e) {
      console.error('Error al cerrar el carrito:', e)
    }
  }

  getProductData(productElement, button = null) {
    const btn =
      button ||
      productElement.querySelector('.add-to-cart-btn') ||
      productElement.querySelector('.btn-compra') ||
      productElement
    const defaultImage = '/images/default.png'

    const productId = btn.dataset.productId
    const productName = btn.dataset.productName
    const productPrice = parseFloat(btn.dataset.productPrice)

    if (
      !productId ||
      !productName ||
      isNaN(productPrice) ||
      productPrice <= 0
    ) {
      console.error('Datos incompletos para producto, no se agrega:', {
        productId,
        productName,
        productPrice,
      })
      return null
    }

    let productImage = btn.dataset.productImage
    if (!productImage) {
      const imgElement = productElement.querySelector('img')
      productImage = imgElement ? imgElement.src : defaultImage
    }

    if (
      productImage &&
      !productImage.startsWith('http') &&
      !productImage.startsWith('/')
    ) {
      productImage = '/' + productImage
    }

    if (!productImage || productImage.includes('undefined')) {
      productImage = defaultImage
    }

    return {
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      quantity: 1,
    }
  }

  addToCart(product) {
    if (
      !product ||
      !product.id ||
      !product.name ||
      typeof product.price !== 'number' ||
      isNaN(product.price)
    ) {
      console.error('Producto inválido, no se añadirá:', product)
      return
    }

    const existingProduct = this.cartItems.find(
      (item) => item.id === product.id
    )

    if (existingProduct) {
      existingProduct.quantity++
    } else {
      this.cartItems.push(product)
    }

    this.saveCart()
    this.renderCartItems()
    this.updateCartCounter()
  }

  removeFromCart(productId) {
    this.cartItems = this.cartItems.filter((item) => item.id !== productId)
    this.saveCart()
    this.renderCartItems()
    this.updateCartCounter()
  }

  updateQuantity(productId, newQuantity) {
    const product = this.cartItems.find((item) => item.id === productId)
    if (product) {
      product.quantity = Math.max(1, newQuantity)
      this.saveCart()
      this.renderCartItems()
      this.updateCartCounter()
    }
  }

  renderCartItems() {
    try {
      this.cartItemsContainer.innerHTML = ''

      if (this.cartItems.length === 0) {
        this.cartItemsContainer.innerHTML =
          '<li class="empty-cart-message">Tu carrito está vacío</li>'
        if (this.cartTotal) this.cartTotal.textContent = '0.00'
        if (this.checkoutBtn) this.checkoutBtn.disabled = true
        return
      }

      this.cartItems.forEach((item) => {
        const li = document.createElement('li')
        li.className = 'cart-item'

        const imageUrl =
          item.image && !item.image.includes('undefined')
            ? item.image
            : '/images/default.png'

        li.innerHTML = `
          <div class="cart-item-image">
            <img src="${imageUrl}" alt="${
          item.name
        }" loading="lazy" onerror="this.onerror=null;this.src='/images/default.png'">
          </div>
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <p>$${(item.price || 0).toFixed(2)} c/u</p>
            <div class="cart-item-quantity">
              <button class="quantity-btn minus" data-id="${
                item.id
              }" aria-label="Reducir cantidad">-</button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn plus" data-id="${
                item.id
              }" aria-label="Aumentar cantidad">+</button>  
            </div>
          </div>
          <div class="cart-item-subtotal">
            $${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
          </div>
          <button class="remove-item-btn" data-id="${
            item.id
          }" aria-label="Eliminar producto">
            <ion-icon name="trash-outline"></ion-icon>
          </button>
        `
        this.cartItemsContainer.appendChild(li)
      })

      this.addDynamicEvents()
      this.updateTotal()

      if (this.checkoutBtn) this.checkoutBtn.disabled = false
    } catch (e) {
      console.error('Error al renderizar items del carrito:', e)
    }
  }

  addDynamicEvents() {
    this.cartItemsContainer
      .querySelectorAll('.quantity-btn.minus')
      .forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const id = e.target.closest('button').dataset.id
          const product = this.cartItems.find((item) => item.id === id)
          if (product && product.quantity > 1) {
            this.updateQuantity(id, product.quantity - 1)
          } else {
            this.removeFromCart(id)
          }
        })
      })

    this.cartItemsContainer
      .querySelectorAll('.quantity-btn.plus')
      .forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const id = e.target.closest('button').dataset.id
          const product = this.cartItems.find((item) => item.id === id)
          if (product) {
            this.updateQuantity(id, product.quantity + 1)
          }
        })
      })

    this.cartItemsContainer
      .querySelectorAll('.remove-item-btn')
      .forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const id = e.target.closest('button').dataset.id
          this.removeFromCart(id)
        })
      })
  }

  updateTotal() {
    if (this.cartTotal) {
      try {
        const total = this.cartItems.reduce(
          (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
          0
        )
        this.cartTotal.textContent = total.toFixed(2)
      } catch (e) {
        console.error('Error al calcular total:', e)
        this.cartTotal.textContent = '0.00'
      }
    }
  }

  updateCartCounter() {
    if (this.cartCounter) {
      const totalItems = this.cartItems.reduce(
        (acc, item) => acc + (item.quantity || 1),
        0
      )
      this.cartCounter.textContent = totalItems
      this.cartCounter.style.display = totalItems > 0 ? 'flex' : 'none'
    }
  }

  saveCart() {
    try {
      localStorage.setItem('cart', JSON.stringify(this.cartItems))
    } catch (e) {
      console.error('Error al guardar el carrito:', e)
    }
  }

  //Pasarela de pago
  async checkout() {
    if (this.cartItems.length === 0) {
      alert('Tu carrito está vacío')
      return
    }

    try {
      this.checkoutBtn.disabled = true
      this.checkoutBtn.textContent = 'Procesando...'

      const itemsToSend = this.cartItems.map((item) => {
        let imageUrl = item.image || '/images/default.png'
        // Si no es una URL absoluta (http/https), construye la ruta completa
        if (!imageUrl.startsWith('http')) {
          // Elimina barras iniciales duplicadas
          const cleanPath = imageUrl.replace(/^\/+/, '')
          // Usa la ruta relativa al servidor
          imageUrl = `${window.location.origin}/${cleanPath}`
        }
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size || 'N/A',
          image: imageUrl,
        }
      })

      const response = await fetch(
        `${BACKEND_URL}/api/checkout/create-checkout-session`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: itemsToSend }),
        }
      )

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Error en el servidor')

      if (data.url) window.location.href = data.url
      else throw new Error('No se recibió URL de checkout')
    } catch (error) {
      console.error('Error completo:', error)
      alert(`Error al procesar el pago: ${error.message}`)
      this.checkoutBtn.disabled = false
      this.checkoutBtn.textContent = 'Pagar'
    }
  }
  showNotification(message) {
    // Aquí puedes añadir notificación tipo toast si quieres
    console.log('NOTIFICACIÓN:', message)
  }
}

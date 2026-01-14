import { showToast } from '/assets/js/modales/utils/notification.js'

export const wishlistHandler = () => {
  // Estado privado
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || []

  // Métodos privados
  const saveWishlist = () => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }

  //Contador  aca  cuenta los productos que esten, hay color del N#
  const updateWishlistCounter = () => {
    const counter = document.getElementById('wishlist-count')
    if (!counter) return

    if (wishlist.length > 0) {
      counter.textContent = wishlist.length
      counter.style.color = 'black'
    } else {
      counter.style.display = 'none'
    }
  }

  const renderWishlist = () => {
    const listElement = document.getElementById('wishlist-items')
    if (!listElement) return

    listElement.innerHTML =
      wishlist.length === 0 ? getEmptyTemplate() : getItemsTemplate()

    if (wishlist.length === 0) {
      document.getElementById('clear-wishlist').style.display = 'none'
      document.getElementById('checkout-wishlist').style.display = 'none'
    } else {
      document.getElementById('clear-wishlist').style.display = 'block'
      document.getElementById('checkout-wishlist').style.display = 'block'
      document.getElementById(
        'wishlist-total'
      ).textContent = `Total: $${wishlist
        .reduce((sum, item) => sum + Number(item.price), 0)
        .toFixed(0)}`
    }

    setupItemEvents()
  }

  const getEmptyTemplate = () => `
    <li class="empty-wishlist">
      <ion-icon name="heart-dislike-outline"></ion-icon>
      <p>No hay productos en tu lista de deseos</p>
    </li>
  `

  const getItemsTemplate = () =>
    wishlist
      .map(
        (item, index) => `
    <li class="wishlist-item">
      <div class="wishlist-item-content">
        <img src="${item.image}" alt="${item.title}" loading="lazy" />
        <div class="wishlist-item-details">
          <h3>${item.title}</h3>
          <p class="price">$${item.price}</p>
          ${item.color ? `<p>Color: <strong>${item.color}</strong></p>` : ''}
          ${item.size ? `<p>Talla: <strong>${item.size}</strong></p>` : ''}
        </div>
      </div>
      <div class="wishlist-item-actions">
        <button class="btn btn-primary wishlist-buy-btn" data-index="${index}">
          <ion-icon name="bag-outline"></ion-icon> Comprar
        </button>
        <button class="btn btn-secondary remove-wishlist-item" data-index="${index}">
          <ion-icon name="trash-outline"></ion-icon>
        </button>
      </div>
    </li>
  `
      )
      .join('')

  const setupItemEvents = () => {
    document.querySelectorAll('.remove-wishlist-item').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        removeFromWishlist(parseInt(btn.dataset.index))
      })
    })

    document.querySelectorAll('.wishlist-buy-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        buyFromWishlist(parseInt(btn.dataset.index))
      })
    })
  }

  const addToWishlist = (product) => {
    const exists = wishlist.some(
      (item) =>
        item.id === product.id &&
        item.color === product.color &&
        item.size === product.size
    )

    if (!exists) {
      wishlist.push(product)
      saveWishlist()
      updateWishlistCounter()
      showToast('Producto agregado a tu lista de deseos')
      return true
    } else {
      showToast('Este producto ya está en tu lista de deseos', 'warning')
      return false
    }
  }

  const removeFromWishlist = (index) => {
    wishlist.splice(index, 1)
    saveWishlist()
    renderWishlist()
    updateWishlistCounter()
    showToast('Producto eliminado de tu lista de deseos')
  }

  const clearWishlist = () => {
    wishlist = []
    saveWishlist()
    renderWishlist()
    updateWishlistCounter()
    showToast('Lista de deseos vacía')
  }

  const buyFromWishlist = (index) => {
    const product = wishlist[index]
    localStorage.setItem('selectedProduct', JSON.stringify(product))
    window.location.href = '/assets/deta.produc/deta-produc.html'
  }

  const checkoutWishlist = () => {
    if (wishlist.length === 0) {
      showToast('Tu lista de deseos está vacía', 'warning')
      return
    }
    localStorage.setItem('wishlistToCheckout', JSON.stringify(wishlist))
    window.location.href = '/assets/carrito/carrito.html'
  }

  // Métodos de inicialización
  const setupSizeSelection = () => {
    document.querySelectorAll('.size-btn').forEach((btn) => {
      btn.addEventListener('click', function () {
        this.closest('.product-sizes')
          ?.querySelectorAll('.size-btn')
          .forEach((b) => {
            b.classList.remove('selected')
            b.removeAttribute('aria-selected')
          })
        this.classList.add('selected')
        this.setAttribute('aria-selected', 'true')
      })
    })
  }

  const handleWishlistClick = (e) => {
    const wishlistBtn = e.target.closest('.wishlist-btn')
    if (!wishlistBtn) return

    e.preventDefault()
    const card = wishlistBtn.closest('.product-card')

    // Feedback visual
    wishlistBtn.classList.add('processing')

    // Obtener datos del producto
    const productData = {
      id: wishlistBtn.dataset.productId || card?.dataset.productId,
      title:
        wishlistBtn.dataset.title ||
        card?.querySelector('.card-title')?.textContent?.trim(),
      price: wishlistBtn.dataset.price || card?.dataset.productPrice,
      image:
        card?.querySelector('.color-dot.selected')?.dataset.imagen ||
        wishlistBtn.dataset.image ||
        card?.querySelector('.card-banner img')?.src,
      color:
        card?.querySelector('.color-dot.selected')?.dataset.color || 'Único',
      size:
        card?.querySelector('.size-btn.selected')?.textContent?.trim() ||
        (card?.querySelector('.product-sizes') ? null : 'Única'),
    }

    // Validar talla si es necesario
    if (productData.size === null) {
      showToast('Por favor selecciona una talla primero', 'warning')
      const sizesContainer = card?.querySelector('.product-sizes')
      sizesContainer?.classList.add('shake')
      setTimeout(() => sizesContainer?.classList.remove('shake'), 500)
      wishlistBtn.classList.remove('processing')
      return
    }

    // Agregar con animación
    setTimeout(() => {
      const added = addToWishlist(productData)
      wishlistBtn.classList.remove('processing')
      if (added) {
        wishlistBtn.classList.add('added')
        setTimeout(() => wishlistBtn.classList.remove('added'), 1000)
      }
    }, 300)
  }

  const setupModalEvents = () => {
    const modal = document.getElementById('wishlist-modal')
    if (!modal) return

    document.getElementById('open-wishlist')?.addEventListener('click', (e) => {
      e.preventDefault()
      modal.classList.add('active')
      document.body.classList.add('no-scroll')
      renderWishlist()
    })

    document
      .querySelector('.close-wishlist')
      ?.addEventListener('click', (e) => {
        e.preventDefault()
        modal.classList.remove('active')
        document.body.classList.remove('no-scroll')
      })

    document
      .getElementById('clear-wishlist')
      ?.addEventListener('click', (e) => {
        e.preventDefault()
        clearWishlist()
      })

    document
      .getElementById('checkout-wishlist')
      ?.addEventListener('click', (e) => {
        e.preventDefault()
        checkoutWishlist()
      })

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active')
        document.body.classList.remove('no-scroll')
      }
    })
  }

  // Inicialización pública
  const init = () => {
    setupSizeSelection()
    document.addEventListener('click', handleWishlistClick)
    setupModalEvents()
    updateWishlistCounter()
    renderWishlist()
  }

  // Retornar solo lo necesario
  return {
    init,
    getWishlist: () => [...wishlist], // Copia para evitar mutaciones externas
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
  }
}

// Uso:
const { init } = wishlistHandler()
init()

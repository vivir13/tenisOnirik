// assets/js/modales/products/deta-producto.js

// Configuración
const PRODUCT_CONFIG = {
  detailPage: '/assets/pages/detaproduc/index.html',
  fallbackImage: '/assets/images/placeholder-product.jpg',
}

/**
 * Maneja el evento de vista rápida/vista de detalle
 */
export function initProductQuickView() {
  document.addEventListener('click', async (e) => {
    // Detectar clics en imágenes de producto o botones de vista rápida
    const productImage = e.target.closest('.card-banner img, .product-image')
    const quickViewBtn = e.target.closest(
      '.card-action-btn[aria-label="Vista rápida"], .quick-view-btn'
    )

    const trigger = productImage || quickViewBtn
    if (!trigger) return

    e.preventDefault()

    try {
      const productCard = trigger.closest('.product-card')
      if (!productCard) throw new Error('Product card not found')

      // Extraer datos del producto
      const productData = {
        id: productCard.dataset.productId || generateId(),
        title: getProductTitle(productCard),
        price: getProductPrice(productCard),
        image: getProductImage(productCard),
        colors: getProductColors(productCard),
        sizes: getProductSizes(productCard),
        selectedColor: getSelectedOption(productCard, 'color'),
        selectedSize: getSelectedOption(productCard, 'size'),
      }

      // Validar datos mínimos
      if (!productData.image) {
        productData.image = PRODUCT_CONFIG.fallbackImage
      }

      // Guardar datos para la página de detalle
      localStorage.setItem('selectedProduct', JSON.stringify(productData))

      // Redirigir
      window.location.href = PRODUCT_CONFIG.detailPage
    } catch (error) {
      console.error('Error en vista rápida:', error)
      showErrorNotification('No se pudo cargar el detalle del producto')
    }
  })
}

// Helper functions
function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

function getProductTitle(productCard) {
  return (
    productCard.querySelector('.card-title a')?.textContent.trim() ||
    productCard.querySelector('.card-title')?.textContent.trim() ||
    'Producto sin nombre'
  )
}

function getProductPrice(productCard) {
  const priceText = productCard.querySelector('.card-price')?.textContent
  return priceText ? priceText.replace(/[^0-9.]/g, '') : '0'
}

function getProductImage(productCard) {
  return (
    productCard.querySelector('.card-banner img')?.src ||
    productCard.dataset.productImage
  )
}

function getProductColors(productCard) {
  const colors = []
  productCard.querySelectorAll('.color-dot').forEach((btn) => {
    colors.push({
      color: btn.dataset.color || btn.getAttribute('aria-label'),
      image: btn.dataset.imagen,
      sizes: btn.dataset.sizes ? btn.dataset.sizes.split(',') : [],
    })
  })
  return colors
}

function getProductSizes(productCard) {
  const sizes = []
  productCard.querySelectorAll('.size-btn').forEach((btn) => {
    sizes.push(btn.textContent.trim())
  })
  return sizes
}

function getSelectedOption(productCard, type) {
  const activeElement = productCard.querySelector(
    `.color-dot.selected, .size-btn.active`
  )
  if (!activeElement) return ''

  return type === 'color'
    ? activeElement.dataset.color || activeElement.getAttribute('aria-label')
    : activeElement.textContent.trim()
}

function showErrorNotification(message) {
  // Implementa tu sistema de notificaciones aquí
  alert(message) // Ejemplo básico
}

// Inicialización automática si es necesario
if (document.querySelector('.product-card')) {
  initProductQuickView()
}

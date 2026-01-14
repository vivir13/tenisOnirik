// assets/js/productos/productHandler.js
export const initProductRedirect = () => {
  document.addEventListener('click', (e) => {
    const productCard = e.target.closest('.product-card')
    if (!productCard) return

    const clickedImg = e.target.tagName === 'IMG'
    const quickViewBtn = e.target
      .closest('.card-action-btn')
      ?.querySelector('ion-icon[name="eye-outline"]')

    if (clickedImg || quickViewBtn) {
      // Datos del producto
      const productData = {
        id: productCard.dataset.productId,
        name:
          productCard.dataset.productName ||
          productCard.querySelector('.card-title a')?.textContent,
        price: parseFloat(productCard.dataset.productPrice),
        image:
          productCard.dataset.productImage ||
          productCard.querySelector('img')?.src,
        category:
          productCard.querySelector('.genero-zapato')?.textContent || '',
        description:
          productCard.dataset.productDescription || 'Descripción no disponible',
        colors: (productCard.dataset.colors || 'Negro,Blanco').split(','),
        sizes: (productCard.dataset.sizes || '38,39,40,41,42,43,44').split(','),
      }

      localStorage.setItem('selectedProduct', JSON.stringify(productData))
      window.location.href = '/assets/pages/producto.html'
    }
  })
}

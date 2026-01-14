export const initProductList = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const productList = document.querySelector('.product-list')
    if (!productList) return

    productList.addEventListener('click', (e) => {
      const productCard = e.target.closest('.product-card')
      if (!productCard) return

      const imgClick = e.target.tagName === 'IMG'
      const quickViewBtn = e.target
        .closest('.card-action-btn')
        ?.querySelector('ion-icon[name="eye-outline"]')

      if (imgClick || quickViewBtn) {
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
        }
        localStorage.setItem('selectedProduct', JSON.stringify(productData))
        window.location.href = '/assets/pages/producto.html'
      }
    })
  })
}

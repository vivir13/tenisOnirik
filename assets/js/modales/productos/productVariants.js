// este hace el cambio de color talla titulo y precio  de producto  sirve para
// cuando se  tiene  un producto con mismas caracteristicas  como ejem modelo de teni con diferente color y tallas

export function initProductVariants() {
  document.querySelectorAll('.product-item').forEach((productItem) => {
    const colorButtons = productItem.querySelectorAll('.color-dot')
    const productImage = productItem.querySelector('.card-banner img')
    const productTitleLink = productItem.querySelector('.card-title a')
    const sizesContainer = productItem.querySelector('.product-sizes')

    function renderSizes(sizes) {
      sizesContainer.innerHTML = '<span>Tallas:</span>'
      sizes.forEach((size) => {
        const btn = document.createElement('button')
        btn.classList.add('size-btn')
        btn.setAttribute('aria-label', `Talla ${size}`)
        btn.textContent = size
        btn.addEventListener('click', () => {
          sizesContainer
            .querySelectorAll('.size-btn')
            .forEach((b) => b.classList.remove('selected'))
          btn.classList.add('selected')
        })
        sizesContainer.appendChild(btn)
      })
    }

    colorButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Cambiar imagen
        const img = btn.getAttribute('data-imagen')
        productImage.src = img
        productImage.alt = `Zapatillas deportivas Supra ${btn.getAttribute(
          'data-title'
        )}`

        // Cambiar título
        productTitleLink.textContent = btn.getAttribute('data-title')

        // Cambiar tallas
        const sizes = btn
          .getAttribute('data-sizes')
          .split(',')
          .map((s) => s.trim())
        renderSizes(sizes)

        // Cambiar botón seleccionado
        colorButtons.forEach((b) => b.classList.remove('selected'))
        btn.classList.add('selected')
      })
    })
  })
}

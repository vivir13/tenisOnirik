// Mostrar notificaciones tipo toast
export const showToast = (message, type = 'success') => {
  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`
  toast.textContent = message
  document.body.appendChild(toast)

  setTimeout(() => toast.classList.add('show'), 10)
  setTimeout(() => {
    toast.classList.remove('show')
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

// Verifica si una URL existe antes de redirigir (para vista rápida)
export const checkPageExists = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

// Navbar toggle para móvil
export const navbarHandler = () => {
  const overlay = document.querySelector('[data-overlay]')
  const navOpenBtn = document.querySelector('[data-nav-open-btn]')
  const navbar = document.querySelector('[data-navbar]')
  const navCloseBtn = document.querySelector('[data-nav-close-btn]')

  const toggleNavbar = () => {
    navbar.classList.toggle('active')
    overlay.classList.toggle('active')
    document.body.classList.toggle('no-scroll')
  }

  ;[overlay, navOpenBtn, navCloseBtn].forEach((el) =>
    el?.addEventListener('click', toggleNavbar)
  )
}

// Efectos de scroll: header fijo + botón ir arriba
export const scrollHandler = () => {
  const header = document.querySelector('[data-header]')
  const goTopBtn = document.querySelector('[data-go-top]')

  if (!header || !goTopBtn) return

  window.addEventListener('scroll', () => {
    const isScrolled = window.scrollY >= 80
    header.classList.toggle('active', isScrolled)
    goTopBtn.classList.toggle('active', isScrolled)
  })
}

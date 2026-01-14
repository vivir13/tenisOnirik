// navbar.js - Versión corregida
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

  ;[overlay, navOpenBtn, navCloseBtn].forEach((element) => {
    if (element) element.addEventListener('click', toggleNavbar)
  })
}

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

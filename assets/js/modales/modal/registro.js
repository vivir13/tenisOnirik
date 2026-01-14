/**
 * MODAL HANDLER - Maneja modales de login/registro
 */

export const modalHandler = () => {
  const loginModal = document.getElementById('login-modal')
  const registerModal = document.getElementById('register-modal')
  const openLoginBtn = document.getElementById('open-login')

  if (!loginModal || !registerModal || !openLoginBtn) return

  const closeLoginBtn = loginModal.querySelector('.close-modal')
  const closeRegisterBtn = registerModal.querySelector('.close-modal')
  const switchToRegister = loginModal.querySelector('.registro-link')
  const switchToLogin = registerModal.querySelector('.registro-link')

  const openModal = (modal) => {
    document
      .querySelectorAll('.modal.active')
      .forEach((m) => m.classList.remove('active'))
    modal.classList.add('active')
    document.body.classList.add('no-scroll')
  }

  const closeModal = (modal) => {
    modal.classList.remove('active')
    document.body.classList.remove('no-scroll')
  }

  const closeAllModals = () => {
    document
      .querySelectorAll('.modal.active')
      .forEach((modal) => closeModal(modal))
  }

  // Event listeners
  openLoginBtn.addEventListener('click', (e) => {
    e.preventDefault()
    openModal(loginModal)
  })

  closeLoginBtn?.addEventListener('click', () => closeModal(loginModal))
  closeRegisterBtn?.addEventListener('click', () => closeModal(registerModal))

  switchToRegister?.addEventListener('click', (e) => {
    e.preventDefault()
    closeModal(loginModal)
    openModal(registerModal)
  })

  switchToLogin?.addEventListener('click', (e) => {
    e.preventDefault()
    closeModal(registerModal)
    openModal(loginModal)
  })

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      closeModal(e.target)
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals()
  })
}

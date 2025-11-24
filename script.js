document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('contactModal');
  const openBtn = document.getElementById('openContact');
  const closeBtn = document.getElementById('closeModal');
  const contactForm = document.getElementById('contactForm');

  // Open Modal
  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('is-visible');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  });

  // Close Modal Function
  const closeModal = () => {
    modal.classList.remove('is-visible');
    document.body.style.overflow = '';
  };

  // Close on X button
  closeBtn.addEventListener('click', closeModal);

  // Close on Backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-visible')) {
      closeModal();
    }
  });
});
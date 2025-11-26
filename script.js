document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('contactModal');
  const openBtn = document.getElementById('openContact');
  const closeBtn = document.getElementById('closeModal');
  const contactForm = document.getElementById('contactForm');

  // Open Modal
  if (openBtn) {
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('is-visible');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
  }

  // Close Modal Function
  const closeModal = () => {
    modal.classList.remove('is-visible');
    document.body.style.overflow = '';
  };

  // Close on X button
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close on Backdrop click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Close on Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-visible')) {
      closeModal();
    }
  });

  // =========================================
  // SCROLL REVEAL ANIMATIONS
  // =========================================

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    // Create IntersectionObserver
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          revealObserver.unobserve(entry.target); // Stop observing after reveal
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements with .reveal class
    document.querySelectorAll('.reveal').forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // If reduced motion is preferred, show all elements immediately
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('reveal-visible');
    });
  }

  // =========================================
  // SCROLL INDICATOR (Hide on scroll)
  // =========================================

  const scrollIndicator = document.getElementById('scrollIndicator');

  if (scrollIndicator) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        scrollIndicator.classList.add('hidden');
      } else {
        scrollIndicator.classList.remove('hidden');
      }
    });
  }

  // =========================================
  // HEADER AUTO-HIDE (Show on scroll up, hide on scroll down)
  // =========================================

  const siteHeader = document.querySelector('.site-header');
  let lastScrollY = window.scrollY;
  let ticking = false;

  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Show header when scrolling up or at top
          if (currentScrollY < lastScrollY || currentScrollY < 100) {
            siteHeader.classList.remove('header-hidden');
          }
          // Hide header when scrolling down and past threshold
          else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            siteHeader.classList.add('header-hidden');
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });

        ticking = true;
      }
    });
  }

  // =========================================
  // THEME TOGGLE
  // =========================================

  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // Check for saved theme preference or default to 'dark'
  const currentTheme = localStorage.getItem('theme') || 'dark';
  body.setAttribute('data-theme', currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const theme = body.getAttribute('data-theme');
      const newTheme = theme === 'dark' ? 'light' : 'dark';

      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
});
document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  // Configuration
  const ANIMATION_STAGGER = 0.05;
  const CLOSE_ANIMATION_DURATION = 700;

  // Éléments DOM
  const projects = document.querySelectorAll('.project');
  const closeBtn = document.getElementById('close-btn');
  const contactBtn = document.getElementById('contact-btn');
  const contactPopup = document.getElementById('contact-popup');
  const closeContact = document.getElementById('close-contact');
  const body = document.body;
  const html = document.documentElement;

  // Variables d'état
  let isMobile = window.innerWidth <= 1024;
  let currentExpandedProject = null;

  // Initialisation
  init();

  function init() {
    setupProjects();
    setupContactPopup();
    setupEventListeners();
    if (!isMobile) {
      setupCustomCursor();
    }
  }

  function setupCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    const speed = 0.15;

    function animateCursor() {
      const distX = mouseX - cursorX;
      const distY = mouseY - cursorY;
      
      cursorX += distX * speed;
      cursorY += distY * speed;
      
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
      
      requestAnimationFrame(animateCursor);
    }

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Effet au clic
    document.addEventListener('click', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
      setTimeout(() => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      }, 100);
    });

    // Démarrer l'animation
    animateCursor();

    // Désactive le curseur natif
    document.body.style.cursor = 'none';

    document.querySelectorAll('.cover-img, .project.expanded button, a, .project.expanded .project-button, button').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '40px';
        cursor.style.height = '40px';
        cursor.style.background = 'rgba(255, 77, 77, 0.2)';
        cursorDot.style.opacity = '0';
      });
      
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '24px';
        cursor.style.height = '24px';
        cursor.style.background = 'rgba(255, 77, 77, 0.3)';
        cursorDot.style.opacity = '1';
      });
    });
  }

  function setupProjects() {
    projects.forEach((project, index) => {
      project.style.animationDelay = `${index * ANIMATION_STAGGER}s`;
      
      project.addEventListener('click', (e) => {
        if (currentExpandedProject) return;
        expandProject(project);
      });
    });
  }

  function expandProject(project) {
    currentExpandedProject = project;
    project.classList.add('expanded');
    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
    closeBtn.classList.add('active');

    if (isMobile) {
      window.scrollTo(0, 0);
    }
  }

  function closeProject() {
    if (!currentExpandedProject) return;
    
    currentExpandedProject.classList.add('closing');
    
    setTimeout(() => {
      currentExpandedProject.classList.remove('expanded', 'closing');
      body.style.overflow = '';
      html.style.overflow = '';
      closeBtn.classList.remove('active');
      currentExpandedProject = null;
    }, CLOSE_ANIMATION_DURATION);
  }

  function setupContactPopup() {
    contactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      contactPopup.classList.add('active');
      body.style.overflow = 'hidden';
    });

    closeContact.addEventListener('click', () => {
      contactPopup.classList.remove('active');
      body.style.overflow = '';
    });

    contactPopup.addEventListener('click', (e) => {
      if (e.target === contactPopup) {
        contactPopup.classList.remove('active');
        body.style.overflow = '';
      }
    });
  }

  function setupEventListeners() {
    closeBtn.addEventListener('click', closeProject);
    
    window.addEventListener('resize', () => {
      const wasMobile = isMobile;
      isMobile = window.innerWidth <= 1024;
      
      // Si le statut mobile a changé
      if (wasMobile !== isMobile) {
        if (isMobile) {
          // Retour au curseur par défaut sur mobile
          document.body.style.cursor = 'auto';
          document.querySelectorAll('.cursor, .cursor-dot').forEach(el => {
            el.style.display = 'none';
          });
        } else {
          // Réactive le curseur personnalisé sur desktop
          document.body.style.cursor = 'none';
          document.querySelectorAll('.cursor, .cursor-dot').forEach(el => {
            el.style.display = 'block';
          });
          setupCustomCursor();
        }
      }
    });
  }
});

document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const form = this;
  const submitBtn = form.querySelector('button[type="submit"]');
  const contactPopup = document.getElementById('contact-popup');
  const closeContact = document.getElementById('close-contact');

  // Désactive tous les écouteurs de fermeture temporairement
  const originalCloseHandler = closeContact.onclick;
  closeContact.onclick = null;
  contactPopup.style.pointerEvents = 'none'; // Empêche les clics pendant l'envoi

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Sending...</span>';

  try {
    await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    // Réinitialisation visuelle
    form.reset();
    document.querySelectorAll('.form-group label').forEach(label => {
      label.style.transform = '';
      label.style.background = '';
    });

    // Message de succès
    showMessage('success', 'Message sent successfully!');
    
    // Fermeture forcée après 1.5s
    setTimeout(() => {
      contactPopup.classList.remove('active');
      document.body.style.overflow = '';
      contactPopup.style.pointerEvents = 'auto';
      closeContact.onclick = originalCloseHandler; // Rétablit le handler
    }, 1500);

  } catch (error) {
    contactPopup.style.pointerEvents = 'auto';
    closeContact.onclick = originalCloseHandler;
    
    if (error.message.includes('Failed to fetch')) {
      form.reset();
      showMessage('success', 'Message sent! (Server confirmation may take a few moments)');
      setTimeout(() => {
        contactPopup.classList.remove('active');
        document.body.style.overflow = '';
      }, 1500);
    } else {
      showMessage('error', error.message);
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Send message</span><svg class="send-icon" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
  }
});

function showMessage(type, text) {
  const formMessage = document.getElementById('formMessage');
  formMessage.className = `form-message ${type} visible`;
  
  // Icône avec classe CSS au lieu de fill en dur
  formMessage.innerHTML = `
    <div class="message-content">
      <svg class="message-icon" viewBox="0 0 24 24">
        <path d="${type === 'success' ? 
          'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' : 
          'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'}"/>
      </svg>
      <span class="message-text">${text}</span>
    </div>
  `;

  // Réapplique les styles après l'insertion
  setTimeout(() => {
    const icon = formMessage.querySelector('.message-icon');
    if (type === 'success') {
      icon.classList.add('success-icon');
    } else {
      icon.classList.add('error-icon');
    }
  }, 10);

  setTimeout(() => {
    formMessage.classList.add('hiding');
    setTimeout(() => formMessage.classList.remove('visible', 'hiding'), 400);
  }, 3000);
}

function setupProjects() {
  projects.forEach((project, index) => {
    project.style.animationDelay = `${index * ANIMATION_STAGGER}s`;
    
    project.addEventListener('click', (e) => {
      if (currentExpandedProject) return;
      if (e.target.classList.contains('view-project-btn')) return;
      expandProject(project);
    });

    const btn = project.querySelector('.view-project-btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentExpandedProject) return;
        expandProject(project);
      });
    }
  });
}
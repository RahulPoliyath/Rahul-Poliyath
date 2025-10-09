// Futuristic Portfolio JavaScript (patched for safety & clarity)
// Hybrid: readable + concise

class FuturisticPortfolio {
  constructor() {
    // safely initialize features that depend on external libs or DOM
    this.initializeParticles();
    this.initializeThemeToggle();
    this.initializeScrollAnimations();
    this.initializeSkillBars();
    this.initializeContactForm();
    this.initializeBackToTop();
    this.initializeSmoothScroll();

    // typing animation after a short delay
    setTimeout(() => this.initializeTypingAnimation(), 500);
  }

  // --- Particles (guarded) ---
  initializeParticles() {
    if (typeof particlesJS === 'undefined') {
      console.warn('particles.js not found — skipping particles background.');
      return;
    }

    // Ensure target exists
    const container = document.getElementById('particles-js');
    if (!container) return;

    try {
      particlesJS('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: ['#00ffc6', '#ba4aff', '#3b82f6'] },
          shape: { type: ['circle', 'triangle', 'edge'], stroke: { width: 0 } },
          opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
          size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1 } },
          line_linked: { enable: true, distance: 150, color: '#00ffc6', opacity: 0.2, width: 1 },
          move: { enable: true, speed: 2, out_mode: 'out', attract: { enable: true, rotateX: 600, rotateY: 1200 } }
        },
        interactivity: {
          detect_on: 'canvas',
          events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
          modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
        },
        retina_detect: true
      });
    } catch (err) {
      console.warn('particles initialization failed:', err);
    }
  }

  // Typing animation for hero name
  initializeTypingAnimation() {
    const nameElement = document.getElementById('typing-name');
    if (!nameElement) return;

    const name = 'Alex Thompson';
    let i = 0;
    nameElement.innerHTML = '';

    const typeWriter = () => {
      if (i < name.length) {
        nameElement.innerHTML += name.charAt(i);
        i++;
        setTimeout(typeWriter, 150);
      } else {
        setTimeout(() => {
          if (!nameElement.querySelector('.cursor')) {
            nameElement.innerHTML += '<span class="cursor">|</span>';
            if (!document.querySelector('#cursor-style')) {
              const style = document.createElement('style');
              style.id = 'cursor-style';
              style.textContent = `
                .cursor { animation: blink 1s infinite; color: var(--accent-primary); }
                @keyframes blink { 0%,50%{opacity:1}51%,100%{opacity:0} }
              `;
              document.head.appendChild(style);
            }
          }
        }, 500);
      }
    };

    typeWriter();
  }

  // Theme toggle with guards
  initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-switch');
    const docEl = document.documentElement;
    const body = document.body;

    // Default to 'dark' if not set
    const currentTheme = localStorage.getItem('theme') || 'dark';
    // Keep document and body in sync early
    docEl.setAttribute('data-theme', currentTheme);
    if (body) body.setAttribute('data-theme', currentTheme);

    if (themeToggle) {
      themeToggle.checked = currentTheme === 'light';
      themeToggle.addEventListener('change', () => {
        const theme = themeToggle.checked ? 'light' : 'dark';
        docEl.setAttribute('data-theme', theme);
        if (body) body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateParticlesTheme(theme);
      });
    } else {
      // nothing to toggle; just ensure particles reflect theme
      this.updateParticlesTheme(currentTheme);
    }
  }

  // Update particles colors safely
  updateParticlesTheme(theme) {
    try {
      const colors = theme === 'light'
        ? ['#14b8a6', '#8b5cf6', '#3b82f6']
        : ['#00ffc6', '#ba4aff', '#3b82f6'];

      const pJ = window.pJSDom?.[0]?.pJS;
      if (pJ && pJ.particles && Array.isArray(pJ.particles.array)) {
        pJ.particles.array.forEach(p => {
          p.color.value = colors[Math.floor(Math.random() * colors.length)];
        });
      }
    } catch (e) {
      // non-critical; fail silently
    }
  }

  // Scroll animations using IntersectionObserver
  initializeScrollAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          if (entry.target.classList.contains('skills-grid')) {
            this.animateSkillBars();
          }
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(50px)';
      section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      observer.observe(section);
    });

    const elements = document.querySelectorAll('.project-card, .skill-item, .contact-form-wrapper');
    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  // Initialize skill bars (set to 0)
  initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => bar.style.width = '0%');
  }

  // Animate skill bars
  animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach((bar, i) => {
      const width = bar.getAttribute('data-width') || '0';
      setTimeout(() => bar.style.width = width + '%', i * 200);
    });
  }

  // Contact form handling (with guards)
  initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
      input.addEventListener('focus', () => input.parentElement?.classList?.add('focused'));
      input.addEventListener('blur', () => {
        if (!input.value) input.parentElement?.classList?.remove('focused');
      });
      if (input.value) input.parentElement?.classList?.add('focused');
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      if (this.validateForm(data)) this.submitForm(data);
    });
  }

  validateForm(data) {
    const errors = [];
    if (!data.name || data.name.trim().length < 2) errors.push('Name must be at least 2 characters long');
    if (!data.email || !this.isValidEmail(data.email)) errors.push('Please enter a valid email address');
    if (!data.subject || data.subject.trim().length < 3) errors.push('Subject must be at least 3 characters long');
    if (!data.message || data.message.trim().length < 10) errors.push('Message must be at least 10 characters long');
    if (errors.length) {
      this.showFormErrors(errors);
      return false;
    }
    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showFormErrors(errors) {
    // remove any previous messages
    document.querySelectorAll('.form-error, .form-success').forEach(el => el.remove());

    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.style.cssText = 'background: rgba(255,84,89,0.08);border:1px solid rgba(255,84,89,0.2);color:#ff5459;padding:1rem;border-radius:.5rem;margin-bottom:1rem;';

    errorDiv.innerHTML = `<strong>Please fix the following errors:</strong>
      <ul style="margin:.5rem 0 0 1.2rem;">${errors.map(e => `<li>${e}</li>`).join('')}</ul>`;

    const form = document.getElementById('contactForm');
    if (form) form.insertBefore(errorDiv, form.firstChild);

    setTimeout(() => errorDiv.remove(), 5000);
  }

  // Submit form (demo)
  submitForm(data) {
    const submitButton = document.querySelector('.submit-button');
    if (!submitButton) return;

    const original = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;

    setTimeout(() => {
      // remove old messages
      document.querySelectorAll('.form-error, .form-success').forEach(el => el.remove());

      // success node
      const successDiv = document.createElement('div');
      successDiv.className = 'form-success';
      successDiv.style.cssText = 'background: rgba(0,255,198,0.06);border:1px solid rgba(0,255,198,0.18);color:#00ffc6;padding:1rem;border-radius:.5rem;margin-bottom:1rem;text-align:center;';
      successDiv.innerHTML = `<i class="fas fa-check-circle" aria-hidden="true"></i>
        <strong style="display:block;">Message sent successfully!</strong>
        <p style="margin:.5rem 0 0 0;">Thank you for reaching out. I'll get back to you soon!</p>`;

      const form = document.getElementById('contactForm');
      if (form) form.insertBefore(successDiv, form.firstChild);

      // reset form
      document.getElementById('contactForm').reset();
      submitButton.innerHTML = original;
      submitButton.disabled = false;
      document.querySelectorAll('.form-group').forEach(g => g.classList.remove('focused'));

      setTimeout(() => successDiv.remove(), 5000);
    }, 1200);
  }

  // Back to top
  initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) backToTopBtn.classList.add('show');
      else backToTopBtn.classList.remove('show');
    });

    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Smooth scroll for nav & CTA buttons
  initializeSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarEl = document.querySelector('.navbar');
    const navHeight = navbarEl ? navbarEl.offsetHeight : 0;

    navLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          const pos = target.offsetTop - navHeight - 20;
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      });
    });

    const ctas = document.querySelectorAll('.cta-button');
    ctas.forEach(button => {
      const href = button.getAttribute('href') || '';
      if (href.startsWith('#')) {
        button.addEventListener('click', e => {
          e.preventDefault();
          const t = document.querySelector(href);
          if (t) {
            const pos = t.offsetTop - navHeight - 20;
            window.scrollTo({ top: pos, behavior: 'smooth' });
          }
        });
      }
    });
  }
}

// Additional animations & effects (kept concise)
class AnimationController {
  constructor() {
    this.initializeParallax();
    this.initializeHoverEffects();
    this.initializeTextAnimations();
  }

  initializeParallax() {
    // throttle using Utils.throttle if needed (kept simple)
    window.addEventListener('scroll', Utils.throttle(() => {
      const scrolled = window.pageYOffset;
      document.querySelectorAll('.hero-content').forEach(el => {
        el.style.transform = `translateY(${scrolled * 0.5}px)`;
      });
    }, 50));
  }

  initializeHoverEffects() {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-15px) scale(1.02)');
      card.addEventListener('mouseleave', () => card.style.transform = '');
    });

    document.querySelectorAll('.social-link').forEach(link => {
      link.addEventListener('mouseenter', () => link.style.boxShadow = '0 0 30px var(--glow-primary)');
      link.addEventListener('mouseleave', () => link.style.boxShadow = 'var(--glass-shadow)');
    });
  }

  initializeTextAnimations() {
    const textObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.bio-text, .contact-info p').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      textObserver.observe(el);
    });
  }
}

// Utilities (debounce & throttle)
class Utils {
  static debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Throttled navbar update (guarded)
const optimizedScroll = Utils.throttle(() => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const scrolled = window.pageYOffset;
  navbar.style.background = scrolled > 100 ? 'rgba(30,41,59,0.9)' : 'var(--bg-glass)';
}, 16);

window.addEventListener('scroll', optimizedScroll);

// Initialize after DOM ready (scripts loaded with defer)
document.addEventListener('DOMContentLoaded', () => {
  try {
    new FuturisticPortfolio();
    new AnimationController();
  } catch (e) {
    console.error('Initialization error:', e);
  }
});

// Resize handler for particles (safe)
window.addEventListener('resize', Utils.debounce(() => {
  try {
    if (window.pJSDom?.[0]?.pJS?.fn?.particlesRefresh) {
      window.pJSDom[0].pJS.fn.particlesRefresh();
    }
  } catch (e) {
    // ignore
  }
}, 250));

// Page load (loader removal)
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }
  document.body.classList.add('loaded');
});

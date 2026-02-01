// Shared Navigation Functionality

// Mobile menu toggle
function initMobileNav() {
  const menuBtn = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const body = document.body;

  if (!menuBtn || !mobileNav) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('is-open');
    mobileNav.classList.toggle('is-open');
    menuBtn.classList.toggle('is-active');
    body.classList.toggle('nav-open');
    menuBtn.setAttribute('aria-expanded', !isOpen);
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      menuBtn.classList.remove('is-active');
      body.classList.remove('nav-open');
    });
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      mobileNav.classList.remove('is-open');
      menuBtn.classList.remove('is-active');
      body.classList.remove('nav-open');
    }
  });
}

// Sticky header on scroll
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const scrollThreshold = 100;

  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  });
}

// Smooth scroll to anchors
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Intersection Observer for fade-in animations (fallback when GSAP is absent)
function initScrollAnimations() {
  // If GSAP + ScrollTrigger are loaded, they handle scroll animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
}

// Active nav link on scroll
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop .nav-link');
  if (!sections.length || !navLinks.length) return;

  const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;

  function updateActive() {
    const scrollY = window.scrollY + headerHeight + 60;
    let currentId = '';

    sections.forEach(section => {
      if (scrollY >= section.offsetTop) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
}

// Initialize all navigation features
function initNavigation() {
  initMobileNav();
  initStickyHeader();
  initSmoothScroll();
  initScrollAnimations();
  initActiveNav();
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavigation);
} else {
  initNavigation();
}

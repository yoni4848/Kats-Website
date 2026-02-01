// K. TingTing Gray — GSAP Animations
// Concert hall warmth: restrained, confident, never bouncy.

(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  // ── Constants ──────────────────────────────────────
  var EASE_REVEAL = 'power4.out';
  var EASE_SMOOTH = 'power2.out';
  var EASE_INOUT  = 'power2.inOut';

  var DUR_FAST = 0.5;
  var DUR_BASE = 0.8;
  var DUR_SLOW = 1.2;
  var STAGGER  = 0.1;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.innerWidth < 768;

  // Mobile adjustments
  var dur = function (d) { return isMobile ? d * 0.8 : d; };
  var dist = function (d) { return isMobile ? d * 0.5 : d; };

  // ── Text Splitting Utility (safe DOM methods) ──────
  function splitWords(el) {
    var text = el.textContent;
    el.setAttribute('aria-label', text);
    // Clear using safe DOM methods
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
    var wordsArray = text.split(' ');
    wordsArray.forEach(function (word, i) {
      var span = document.createElement('span');
      span.style.display = 'inline-block';
      span.textContent = word;
      span.className = 'split-word';
      el.appendChild(span);
      if (i < wordsArray.length - 1) {
        el.appendChild(document.createTextNode('\u00A0'));
      }
    });
    return el.querySelectorAll('.split-word');
  }

  // ── Reduced Motion: show everything, exit ──────────
  if (prefersReducedMotion) {
    document.addEventListener('DOMContentLoaded', function () {
      gsap.set('.fade-in, .role-card, .blog-card, .gallery-item, .form-group, .blog-post-header, .blog-post-content > *, .blog-nav-link', {
        opacity: 1, y: 0, x: 0, scale: 1, clearProps: 'transform'
      });
    });
    return;
  }

  // ── Clear CSS initial hidden state ──────────────────
  // .fade-in sets opacity:0 in CSS. We must override it so
  // GSAP from() tweens animate TO opacity:1 (not TO 0).
  // This runs synchronously before paint, so no flash.
  function clearFadeInCSS() {
    gsap.set('.fade-in', { opacity: 1, y: 0 });
  }

  // ── Hero Timeline (page load) ──────────────────────
  function initHero() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var tl = gsap.timeline({ defaults: { ease: EASE_REVEAL } });

    // Portrait
    tl.from('.hero-portrait', {
      opacity: 0,
      y: dist(30),
      scale: 0.95,
      duration: dur(1.0)
    });

    // Name — word split
    var h1 = hero.querySelector('h1');
    if (h1) {
      var words = splitWords(h1);
      tl.from(words, {
        opacity: 0,
        y: dist(20),
        duration: dur(0.7),
        stagger: 0.06
      }, '-=0.4');
    }

    // Tagline
    tl.from('.hero .tagline', {
      opacity: 0,
      y: dist(12),
      duration: dur(0.6)
    }, '-=0.3');

    // Divider
    var divider = hero.querySelector('.divider-short');
    if (divider) {
      tl.from(divider, {
        scaleX: 0,
        duration: dur(0.5),
        ease: EASE_INOUT
      }, '-=0.2');
    }

    // Lead text
    tl.from('.hero .lead', {
      opacity: 0,
      y: dist(10),
      duration: dur(0.6)
    }, '-=0.2');

    // Scroll indicator
    var indicator = hero.querySelector('.scroll-indicator');
    if (indicator) {
      tl.from(indicator, {
        opacity: 0,
        y: dist(10),
        duration: dur(0.5),
        ease: EASE_SMOOTH
      }, '-=0.1');
    }

    // Hero portrait parallax (desktop only)
    if (!isMobile) {
      gsap.to('.hero-portrait', {
        y: 60,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  }

  // ── Section Header Helper ──────────────────────────
  function animateSectionHeader(trigger) {
    var header = trigger.querySelector('.section-header');
    if (!header) return;

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        once: true
      }
    });

    var h2 = header.querySelector('h2');
    if (h2) {
      tl.from(h2, {
        opacity: 0, y: dist(20), duration: dur(DUR_BASE), ease: EASE_REVEAL
      });
    }

    var lead = header.querySelector('.lead');
    if (lead) {
      tl.from(lead, {
        opacity: 0, y: dist(12), duration: dur(0.6), ease: EASE_REVEAL
      }, '-=0.5');
    }

    var dividerEl = header.querySelector('.divider-short');
    if (dividerEl) {
      tl.from(dividerEl, {
        scaleX: 0, duration: dur(0.5), ease: EASE_INOUT
      }, '-=0.3');
    }
  }

  // ── Scroll-Triggered Section Animations ────────────
  function initScrollAnimations() {

    // Roles grid
    var rolesSection = document.querySelector('.roles-section');
    if (rolesSection) {
      animateSectionHeader(rolesSection);

      gsap.from('.role-card', {
        opacity: 0,
        y: dist(24),
        duration: dur(DUR_BASE),
        stagger: STAGGER,
        ease: EASE_REVEAL,
        scrollTrigger: {
          trigger: '.roles-grid',
          start: 'top 80%',
          once: true
        }
      });

      // SVG icon stroke draw (desktop only)
      if (!isMobile) {
        document.querySelectorAll('.role-icon svg path').forEach(function (path) {
          if (path.getTotalLength) {
            var length = path.getTotalLength();
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
            gsap.to(path, {
              strokeDashoffset: 0,
              duration: dur(0.8),
              ease: EASE_SMOOTH,
              scrollTrigger: {
                trigger: path.closest('.role-card'),
                start: 'top 80%',
                once: true
              }
            });
          }
        });
      }
    }

    // Book section
    var bookSection = document.querySelector('.book-section');
    if (bookSection) {
      var bookCover = bookSection.querySelector('.book-cover');
      if (bookCover) {
        gsap.from(bookCover, {
          opacity: 0,
          x: dist(-40),
          rotateY: 8,
          duration: dur(1.0),
          ease: EASE_REVEAL,
          scrollTrigger: {
            trigger: '.book-content',
            start: 'top 75%',
            once: true
          }
        });
      }

      var bookInfo = bookSection.querySelector('.book-info');
      if (bookInfo) {
        var children = bookInfo.children;
        gsap.from(children, {
          opacity: 0,
          y: dist(16),
          duration: dur(0.6),
          stagger: 0.1,
          ease: EASE_REVEAL,
          scrollTrigger: {
            trigger: '.book-content',
            start: 'top 75%',
            once: true
          }
        });
      }
    }

    // Blog section
    var blogSection = document.querySelector('.blog-section');
    if (blogSection) {
      animateSectionHeader(blogSection);

      gsap.from('.blog-card', {
        opacity: 0,
        y: dist(30),
        duration: dur(DUR_BASE),
        stagger: 0.12,
        ease: EASE_REVEAL,
        scrollTrigger: {
          trigger: '.blog-grid',
          start: 'top 80%',
          once: true
        }
      });

      // Card image zoom settle
      gsap.from('.blog-card-image img', {
        scale: 1.08,
        duration: dur(DUR_SLOW),
        ease: EASE_SMOOTH,
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.blog-grid',
          start: 'top 80%',
          once: true
        }
      });
    }

    // Philanthropy section
    var philanthropy = document.querySelector('#philanthropy');
    if (philanthropy) {
      var aboutContent = philanthropy.querySelector('.about-content');
      var aboutImage = philanthropy.querySelector('.about-image');

      if (aboutContent) {
        gsap.from(aboutContent, {
          opacity: 0,
          x: dist(-30),
          duration: dur(0.9),
          ease: EASE_REVEAL,
          scrollTrigger: {
            trigger: '.about-section',
            start: 'top 75%',
            once: true
          }
        });
      }

      if (aboutImage) {
        gsap.from(aboutImage, {
          opacity: 0,
          x: dist(30),
          duration: dur(0.9),
          ease: EASE_REVEAL,
          delay: 0.15,
          scrollTrigger: {
            trigger: '.about-section',
            start: 'top 75%',
            once: true
          }
        });
      }
    }

    // Music section
    var musicSection = document.querySelector('#music');
    if (musicSection) {
      animateSectionHeader(musicSection);

      gsap.from('.gallery-item', {
        opacity: 0,
        y: dist(40),
        scale: 0.97,
        duration: dur(DUR_SLOW),
        stagger: 0.15,
        ease: EASE_REVEAL,
        scrollTrigger: {
          trigger: '.gallery-item',
          start: 'top 80%',
          once: true
        }
      });

      // Gallery parallax (desktop only)
      if (!isMobile) {
        document.querySelectorAll('.gallery-item').forEach(function (item) {
          gsap.to(item, {
            y: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          });
        });
      }
    }

    // Contact section
    var contactSection = document.querySelector('#contact');
    if (contactSection) {
      animateSectionHeader(contactSection);

      gsap.from('.form-group', {
        opacity: 0,
        y: dist(16),
        duration: dur(DUR_FAST),
        stagger: 0.08,
        ease: EASE_SMOOTH,
        scrollTrigger: {
          trigger: '.contact-form',
          start: 'top 80%',
          once: true
        }
      });

      var submitBtn = contactSection.querySelector('.contact-form .btn');
      if (submitBtn) {
        gsap.from(submitBtn, {
          opacity: 0,
          y: dist(12),
          duration: dur(DUR_FAST),
          ease: EASE_SMOOTH,
          scrollTrigger: {
            trigger: submitBtn,
            start: 'top 90%',
            once: true
          }
        });
      }
    }

    // Footer
    var footer = document.querySelector('.footer');
    if (footer) {
      gsap.from('.footer-brand, .footer-nav, .footer-contact', {
        opacity: 0,
        y: dist(12),
        duration: dur(DUR_FAST),
        stagger: 0.08,
        ease: EASE_SMOOTH,
        scrollTrigger: {
          trigger: '.footer',
          start: 'top 90%',
          once: true
        }
      });
    }
  }

  // ── Blog Post Page Animations ──────────────────────
  function initBlogPostAnimations() {
    var blogPost = document.querySelector('.blog-post');
    if (!blogPost) return;

    var tl = gsap.timeline({ defaults: { ease: EASE_REVEAL } });

    // Illustration
    var illustration = blogPost.querySelector('.blog-illustration');
    if (illustration) {
      tl.from(illustration, {
        opacity: 0,
        scale: 1.05,
        duration: dur(DUR_BASE),
        ease: EASE_SMOOTH
      });
    }

    // Date
    var dateEl = blogPost.querySelector('.blog-post-date');
    if (dateEl) {
      tl.from(dateEl, {
        opacity: 0, y: dist(10), duration: dur(DUR_FAST)
      }, '-=0.3');
    }

    // Title — word split
    var title = blogPost.querySelector('.blog-post-title');
    if (title) {
      var words = splitWords(title);
      tl.from(words, {
        opacity: 0,
        y: dist(16),
        duration: dur(0.7),
        stagger: 0.04
      }, '-=0.2');
    }

    // Content paragraphs and headings — batch reveal on scroll
    var contentElements = blogPost.querySelectorAll('.blog-post-content > *');
    if (contentElements.length) {
      ScrollTrigger.batch(contentElements, {
        onEnter: function (elements) {
          gsap.from(elements, {
            opacity: 0,
            y: dist(16),
            duration: dur(DUR_BASE),
            stagger: 0.08,
            ease: EASE_REVEAL
          });
        },
        start: 'top 85%',
        once: true
      });
    }

    // Prev/next nav
    var navLinks = blogPost.querySelectorAll('.blog-nav-link');
    if (navLinks.length) {
      gsap.from(navLinks, {
        opacity: 0,
        y: dist(12),
        duration: dur(DUR_FAST),
        stagger: 0.1,
        ease: EASE_SMOOTH,
        scrollTrigger: {
          trigger: '.blog-nav',
          start: 'top 90%',
          once: true
        }
      });
    }
  }

  // ── Initialize ─────────────────────────────────────
  function init() {
    clearFadeInCSS();
    initHero();
    initScrollAnimations();
    initBlogPostAnimations();

    // Refresh ScrollTrigger after images load
    window.addEventListener('load', function () {
      ScrollTrigger.refresh();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

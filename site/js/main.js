// K. TingTing Gray — Main JavaScript

// Form submission with validation feedback
document.addEventListener('DOMContentLoaded', function() {
  var form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Check validity
    if (!form.checkValidity()) {
      form.querySelectorAll('.form-input, .form-textarea').forEach(function(field) {
        if (!field.validity.valid) {
          field.classList.add('touched');
        }
      });
      return;
    }

    // Get form data
    var formData = new FormData(form);
    var data = Object.fromEntries(formData);
    console.log('Form submitted:', data);

    // Show success — replace form with thank-you message using safe DOM methods
    while (form.firstChild) {
      form.removeChild(form.firstChild);
    }
    var successDiv = document.createElement('div');
    successDiv.className = 'form-success';

    var thankYou = document.createElement('p');
    thankYou.style.textAlign = 'center';
    thankYou.style.fontSize = 'var(--text-lg)';
    thankYou.style.color = 'var(--color-text)';
    thankYou.textContent = 'Thank you for your message.';

    var followUp = document.createElement('p');
    followUp.style.textAlign = 'center';
    followUp.style.color = 'var(--color-text-secondary)';
    followUp.textContent = 'Katrine will get back to you soon.';

    successDiv.appendChild(thankYou);
    successDiv.appendChild(followUp);
    form.appendChild(successDiv);
  });
});

// Image lazy loading
document.addEventListener('DOMContentLoaded', function() {
  var images = document.querySelectorAll('img[data-src]');

  var imageObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(function(img) { imageObserver.observe(img); });
});

// Parallax handled by GSAP ScrollTrigger in animations.js

/* =========================================
   Navigation — mobile menu toggle
   ========================================= */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger?.addEventListener('click', () => {
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', String(!expanded));
  mobileNav.classList.toggle('is-open');
  document.body.style.overflow = expanded ? '' : 'hidden';
});

// Close mobile menu on link click
mobileNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('is-open');
    document.body.style.overflow = '';
  });
});

// Close mobile menu on ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileNav?.classList.contains('is-open')) {
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('is-open');
    document.body.style.overflow = '';
    hamburger.focus();
  }
});

/* =========================================
   Contact form — validation + submit
   ========================================= */
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

const validators = {
  name:    v => v.trim().length >= 2          || 'Please enter your full name.',
  email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.',
  subject: v => v.trim().length >= 3          || 'Please enter a subject.',
  message: v => v.trim().length >= 10         || 'Message must be at least 10 characters.',
};

function validateField(name, value) {
  const result = validators[name]?.(value);
  return result === true ? null : result;
}

function showFieldError(fieldEl, errorEl, msg) {
  fieldEl.setAttribute('aria-invalid', 'true');
  errorEl.textContent = msg;
  errorEl.classList.add('is-visible');
}

function clearFieldError(fieldEl, errorEl) {
  fieldEl.removeAttribute('aria-invalid');
  errorEl.classList.remove('is-visible');
}

// Live validation on blur
form?.querySelectorAll('input, textarea').forEach(field => {
  const errorEl = document.getElementById(`${field.id}-error`);
  if (!errorEl) return;

  field.addEventListener('blur', () => {
    const msg = validateField(field.name, field.value);
    if (msg) {
      showFieldError(field, errorEl, msg);
    } else {
      clearFieldError(field, errorEl);
    }
  });

  field.addEventListener('input', () => {
    if (field.getAttribute('aria-invalid') === 'true') {
      const msg = validateField(field.name, field.value);
      if (!msg) clearFieldError(field, errorEl);
    }
  });
});

form?.addEventListener('submit', async e => {
  e.preventDefault();

  const fields = ['name', 'email', 'subject', 'message'];
  let firstInvalid = null;

  // Validate all fields
  fields.forEach(name => {
    const field = form.elements[name];
    const errorEl = document.getElementById(`${name}-error`);
    const msg = validateField(name, field.value);
    if (msg) {
      showFieldError(field, errorEl, msg);
      if (!firstInvalid) firstInvalid = field;
    } else {
      clearFieldError(field, errorEl);
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  // Submit simulation (replace with your real endpoint)
  const submitBtn = form.querySelector('[type="submit"]');
  submitBtn.classList.add('btn--loading');
  submitBtn.setAttribute('aria-busy', 'true');
  formStatus.className = 'form__status';

  try {
    // Simulated async delay — replace with fetch() to your backend/form service
    await new Promise(resolve => setTimeout(resolve, 1200));

    formStatus.className = 'form__status is-success';
    formStatus.innerHTML = `
      <svg class="icon" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
      Message sent! I'll get back to you soon.
    `;
    formStatus.setAttribute('role', 'status');
    form.reset();
  } catch {
    formStatus.className = 'form__status is-error';
    formStatus.innerHTML = `
      <svg class="icon" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
      Something went wrong. Please try again or email me directly.
    `;
    formStatus.setAttribute('role', 'alert');
  } finally {
    submitBtn.classList.remove('btn--loading');
    submitBtn.removeAttribute('aria-busy');
  }
});

/* =========================================
   Intersection Observer — fade-in animation
   ========================================= */
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('[data-animate]').forEach(el => {
  el.classList.add('animate-hidden');
  observer.observe(el);
});

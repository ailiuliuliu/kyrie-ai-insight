// Active nav link highlighting on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });

sections.forEach(section => observer.observe(section));

// Add active style
const style = document.createElement('style');
style.textContent = `.nav-link.active { background: #21262d; color: #f0f6fc; }`;
document.head.appendChild(style);

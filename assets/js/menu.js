const menuToggle = document.querySelector('.menu-toggle');
const siteHeader = document.querySelector('.site-header');
const navigationLinks = document.querySelectorAll('.main-nav a, .header-actions a, .social-links a');

const closeMenu = () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation menu');
  siteHeader.classList.remove('is-menu-open');
};

menuToggle.addEventListener('click', () => {
  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isExpanded));
  menuToggle.setAttribute('aria-label', isExpanded ? 'Open navigation menu' : 'Close navigation menu');
  siteHeader.classList.toggle('is-menu-open', !isExpanded);
});

navigationLinks.forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

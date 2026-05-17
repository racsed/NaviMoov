// ============================================
// NaviMoov — Interactions du site
// ============================================

// Navbar : effet de scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Menu burger (mobile)
const burger = document.getElementById('nav-burger');
const navLinks = document.querySelector('.nav-links');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Fermer le menu mobile au clic sur un lien
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// Animations reveal au scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

// Marquer tous les éléments pour le reveal
document.querySelectorAll('.section-title, .section-lead, .step, .usager-card, .feature, .dept-card, .big-stat, .probleme-story, .festival-banner').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// Smooth scroll avec offset pour la navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navHeight = 72;
    const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top: targetPos, behavior: 'smooth' });
  });
});

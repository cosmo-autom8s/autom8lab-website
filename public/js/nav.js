(function () {
  const nav = document.getElementById('main-nav');
  const navInner = document.getElementById('nav-inner');
  if (!nav || !navInner) return;

  const SCROLL_THRESHOLD = 50;

  function updateNav() {
    const scrolled = window.scrollY > SCROLL_THRESHOLD;
    nav.classList.toggle('bg-page/80', scrolled);
    nav.classList.toggle('backdrop-blur-xl', scrolled);
    nav.classList.toggle('border-b', scrolled);
    nav.classList.toggle('border-border-subtle', scrolled);
    nav.classList.toggle('shadow-lg', scrolled);
    navInner.classList.toggle('h-20', !scrolled);
    navInner.classList.toggle('h-16', scrolled);
  }

  const menuBtn = document.getElementById('mobile-menu-btn');
  const menuClose = document.getElementById('mobile-menu-close');
  const menu = document.getElementById('mobile-menu');
  const menuOverlay = document.getElementById('mobile-menu-overlay');
  const menuPanel = document.getElementById('mobile-menu-panel');

  function openMenu() {
    menu.classList.remove('hidden');
    requestAnimationFrame(() => {
      menuPanel.classList.remove('translate-x-full');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuPanel.classList.add('translate-x-full');
    setTimeout(() => {
      menu.classList.add('hidden');
    }, 300);
    document.body.style.overflow = '';
  }

  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

  menu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();

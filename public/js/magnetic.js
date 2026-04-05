(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const PROXIMITY = 50;
  const STRENGTH = 0.3;

  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.style.transition = 'transform 0.3s ease-out';

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = Math.max(rect.width, rect.height) / 2 + PROXIMITY;

      if (dist < maxDist) {
        el.style.transform = `translate(${dx * STRENGTH}px, ${dy * STRENGTH}px)`;
      }
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
})();

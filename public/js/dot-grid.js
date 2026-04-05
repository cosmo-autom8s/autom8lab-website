(function () {
  const canvas = document.getElementById('dot-grid');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const GRID_SPACING = 40;
  const DOT_RADIUS = 1;
  const GLOW_RADIUS = 150;
  const BASE_ALPHA = 0.15;
  const GLOW_ALPHA = 0.6;
  const DOT_COLOR = { r: 59, g: 130, b: 246 };

  let mouse = { x: -9999, y: -9999 };
  let animFrame = null;
  let dots = [];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasPointer = window.matchMedia('(pointer: fine)').matches;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
    buildDots();
    draw();
  }

  function buildDots() {
    dots = [];
    const cols = Math.ceil(canvas.width / GRID_SPACING);
    const rows = Math.ceil(canvas.height / GRID_SPACING);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dots.push({
          x: col * GRID_SPACING + GRID_SPACING / 2,
          y: row * GRID_SPACING + GRID_SPACING / 2,
        });
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const dot of dots) {
      let alpha = BASE_ALPHA;
      if (hasPointer && !prefersReducedMotion) {
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < GLOW_RADIUS) {
          const factor = 1 - dist / GLOW_RADIUS;
          alpha = BASE_ALPHA + (GLOW_ALPHA - BASE_ALPHA) * factor * factor;
        }
      }
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${DOT_COLOR.r}, ${DOT_COLOR.g}, ${DOT_COLOR.b}, ${alpha})`;
      ctx.fill();
    }
  }

  function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY + window.scrollY;
    if (!animFrame) {
      animFrame = requestAnimationFrame(() => {
        draw();
        animFrame = null;
      });
    }
  }

  const resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(document.documentElement);
  window.addEventListener('resize', resize, { passive: true });

  if (hasPointer && !prefersReducedMotion) {
    window.addEventListener('mousemove', onMouseMove, { passive: true });
  }

  resize();

  // Cursor glow follower
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && hasPointer && !prefersReducedMotion) {
    cursorGlow.style.opacity = '1';
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    }, { passive: true });
  }
})();

(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setVisible(el) {
    el.style.opacity = '1';
    el.style.transform = 'translate3d(0, 0, 0) scale(1)';
  }

  function setHidden(el, options) {
    el.style.opacity = '0';
    el.style.transform = options.transform;
    el.style.transition = 'opacity ' + options.duration + 'ms ' + options.easing + ' ' + options.delay + 'ms, transform ' + options.duration + 'ms ' + options.easing + ' ' + options.delay + 'ms';
    el.style.willChange = 'opacity, transform';
  }

  function revealOnIntersect(elements, makeOptions) {
    if (!elements.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach(setVisible);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        setVisible(entry.target);
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15,
    });

    elements.forEach(function (el, index) {
      setHidden(el, makeOptions(index, el));
      observer.observe(el);
    });
  }

  function animateHero() {
    var items = [
      document.querySelector('[data-hero-anim="headline"]'),
      document.querySelectorAll('[data-hero-anim="sub"]')[0],
      document.querySelectorAll('[data-hero-anim="sub"]')[1],
      document.querySelector('[data-hero-anim="cta"]'),
    ].filter(Boolean);

    if (!items.length) return;

    if (prefersReducedMotion) {
      items.forEach(setVisible);
      return;
    }

    items.forEach(function (el, index) {
      setHidden(el, {
        transform: 'translate3d(0, 28px, 0)',
        duration: 700,
        delay: index * 100,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      });
    });

    window.requestAnimationFrame(function () {
      items.forEach(setVisible);
    });
  }

  function animateServices() {
    revealOnIntersect(Array.from(document.querySelectorAll('[data-service-card]')), function (index) {
      return {
        transform: 'translate3d(0, 36px, 0)',
        duration: 650,
        delay: index * 80,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      };
    });
  }

  function animateTimeline() {
    var steps = Array.from(document.querySelectorAll('[data-timeline-step]'));
    if (!steps.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      steps.forEach(function (step) {
        var card = step.querySelector('.glass-card');
        var dot = step.querySelector('[data-timeline-dot]');
        if (card) setVisible(card);
        if (dot) setVisible(dot);
      });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var step = entry.target;
          var index = steps.indexOf(step);
          var card = step.querySelector('.glass-card');
          var dot = step.querySelector('[data-timeline-dot]');
          var offset = index % 2 === 0 ? '-48px' : '48px';

          if (card) {
            setHidden(card, {
              transform: 'translate3d(' + offset + ', 0, 0)',
              duration: 700,
              delay: 0,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            });
          }
          if (dot) {
            setHidden(dot, {
              transform: 'translate3d(0, 0, 0) scale(0.6)',
              duration: 450,
              delay: 120,
              easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            });
          }

          window.requestAnimationFrame(function () {
            if (card) setVisible(card);
            if (dot) setVisible(dot);
          });
          observer.unobserve(step);
        });
      }, {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.2,
      });

      steps.forEach(function (step) {
        observer.observe(step);
      });
    }

    var fill = document.getElementById('timeline-fill');
    var timeline = document.getElementById('timeline');
    if (!fill || !timeline) return;

    function updateFill() {
      var rect = timeline.getBoundingClientRect();
      var viewportHeight = window.innerHeight;
      var start = viewportHeight * 0.6;
      var end = rect.height + viewportHeight * 0.4;
      var progress = (start - rect.top) / end;
      var clamped = Math.max(0, Math.min(progress, 1));
      fill.style.height = (clamped * 100) + '%';
    }

    window.addEventListener('scroll', updateFill, { passive: true });
    window.addEventListener('resize', updateFill, { passive: true });
    updateFill();
  }

  function animateResults() {
    revealOnIntersect(Array.from(document.querySelectorAll('[data-result-card]')), function (index) {
      return {
        transform: 'translate3d(0, 32px, 0)',
        duration: 600,
        delay: index * 100,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      };
    });

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-count-to]').forEach(function (el) {
        var prefix = el.dataset.countPrefix || '';
        var suffix = el.dataset.countSuffix || '';
        el.textContent = prefix + el.dataset.countTo + suffix;
      });
      return;
    }

    document.querySelectorAll('[data-count-to]').forEach(function (el) {
      var target = Number(el.dataset.countTo);
      var from = Number(el.dataset.countFrom || 0);
      var prefix = el.dataset.countPrefix || '';
      var suffix = el.dataset.countSuffix || '';
      var duration = 1400;
      var started = false;

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || started) return;
          started = true;
          var startTime = performance.now();

          function frame(now) {
            var progress = Math.min((now - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var value = from + (target - from) * eased;
            el.textContent = prefix + Math.round(value) + suffix;
            if (progress < 1) {
              requestAnimationFrame(frame);
            }
          }

          requestAnimationFrame(frame);
          observer.disconnect();
        });
      }, {
        threshold: 0.35,
      });

      observer.observe(el);
    });
  }

  function animateContact() {
    var sidebar = document.querySelector('[data-contact-sidebar]');
    var form = document.querySelector('[data-contact-form]');
    revealOnIntersect([sidebar].filter(Boolean), function () {
      return {
        transform: 'translate3d(-36px, 0, 0)',
        duration: 650,
        delay: 0,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      };
    });
    revealOnIntersect([form].filter(Boolean), function () {
      return {
        transform: 'translate3d(36px, 0, 0)',
        duration: 650,
        delay: 100,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      };
    });
  }

  function animateFaq() {
    revealOnIntersect(Array.from(document.querySelectorAll('[data-faq-list] details')), function (index) {
      return {
        transform: 'translate3d(0, 24px, 0)',
        duration: 500,
        delay: index * 80,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      };
    });
  }

  animateHero();
  animateServices();
  animateTimeline();
  animateResults();
  animateContact();
  animateFaq();
})();

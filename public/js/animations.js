// TODO: Fix GSAP ScrollTrigger animations — elements stuck at opacity:0
// Temporarily disabled until we can debug the ScrollTrigger timing issue
// with gsap.from() immediateRender and toggleActions.

/*
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  var defaultTrigger = { start: 'top 85%', toggleActions: 'play none none none' };

  function animateHero() {
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('[data-hero-anim="headline"]', { y: 40, opacity: 0, duration: 0.8 })
      .from('[data-hero-anim="sub"]', { y: 30, opacity: 0, duration: 0.7 }, '-=0.5')
      .from('[data-hero-anim="cta"]', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4');
  }

  function animateServices() {
    gsap.from('[data-service-card]', {
      scrollTrigger: Object.assign({}, defaultTrigger, { trigger: '#services' }),
      y: 60, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
    });
  }

  function animateTimeline() {
    var fill = document.getElementById('timeline-fill');
    var timeline = document.getElementById('timeline');
    if (!fill || !timeline) return;

    ScrollTrigger.create({
      trigger: timeline,
      start: 'top 60%',
      end: 'bottom 60%',
      scrub: 0.5,
      onUpdate: function (self) { fill.style.height = (self.progress * 100) + '%'; },
    });

    var steps = document.querySelectorAll('[data-timeline-step]');
    steps.forEach(function (step, i) {
      var fromLeft = i % 2 === 0;
      gsap.from(step.querySelector('.glass-card'), {
        scrollTrigger: Object.assign({}, defaultTrigger, { trigger: step }),
        x: fromLeft ? -60 : 60, opacity: 0, duration: 0.7, ease: 'power3.out',
      });
      gsap.from(step.querySelector('[data-timeline-dot]'), {
        scrollTrigger: Object.assign({}, defaultTrigger, { trigger: step }),
        scale: 0, opacity: 0, duration: 0.4, ease: 'back.out(1.7)',
      });
    });
  }

  function animateResults() {
    gsap.from('[data-result-card]', {
      scrollTrigger: Object.assign({}, defaultTrigger, { trigger: '#results' }),
      y: 50, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
    });

    document.querySelectorAll('[data-count-to]').forEach(function (el) {
      var target = parseInt(el.dataset.countTo);
      var suffix = el.dataset.countSuffix || '';
      var from = parseInt(el.dataset.countFrom) || 0;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
        onEnter: function () {
          gsap.to({ val: from }, {
            val: target,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: function () {
              el.textContent = Math.round(this.targets()[0].val) + suffix;
            },
          });
        },
      });
    });
  }

  function animateContact() {
    gsap.from('[data-contact-sidebar]', {
      scrollTrigger: Object.assign({}, defaultTrigger, { trigger: '#contact' }),
      x: -40, opacity: 0, duration: 0.7, ease: 'power3.out',
    });
    gsap.from('[data-contact-form]', {
      scrollTrigger: Object.assign({}, defaultTrigger, { trigger: '#contact' }),
      x: 40, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.2,
    });
  }

  function animateFaq() {
    gsap.from('[data-faq-list] details', {
      scrollTrigger: Object.assign({}, defaultTrigger, { trigger: '#faq' }),
      y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
    });
  }

  window.addEventListener('load', function () {
    animateHero();
    animateServices();
    animateTimeline();
    animateResults();
    animateContact();
    animateFaq();
    setTimeout(function () { ScrollTrigger.refresh(); }, 200);
  });
})();
*/

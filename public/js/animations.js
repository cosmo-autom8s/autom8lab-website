(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  function animateHero() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('[data-hero-anim="headline"]', { y: 40, opacity: 0, duration: 0.8 })
      .from('[data-hero-anim="sub"]', { y: 30, opacity: 0, duration: 0.7 }, '-=0.5')
      .from('[data-hero-anim="cta"]', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4');
  }

  function animateServices() {
    gsap.from('[data-service-card]', {
      scrollTrigger: { trigger: '#services', start: 'top 80%', once: true },
      y: 60, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
    });
  }

  function animateTimeline() {
    const fill = document.getElementById('timeline-fill');
    const timeline = document.getElementById('timeline');
    if (!fill || !timeline) return;

    ScrollTrigger.create({
      trigger: timeline,
      start: 'top 60%',
      end: 'bottom 60%',
      scrub: 0.5,
      onUpdate: (self) => { fill.style.height = (self.progress * 100) + '%'; },
    });

    const steps = document.querySelectorAll('[data-timeline-step]');
    steps.forEach((step, i) => {
      const fromLeft = i % 2 === 0;
      gsap.from(step.querySelector('.glass-card'), {
        scrollTrigger: { trigger: step, start: 'top 80%', once: true },
        x: fromLeft ? -60 : 60, opacity: 0, duration: 0.7, ease: 'power3.out',
      });
      gsap.from(step.querySelector('[data-timeline-dot]'), {
        scrollTrigger: { trigger: step, start: 'top 80%', once: true },
        scale: 0, opacity: 0, duration: 0.4, ease: 'back.out(1.7)',
      });
    });
  }

  function animateResults() {
    gsap.from('[data-result-card]', {
      scrollTrigger: { trigger: '#results', start: 'top 80%', once: true },
      y: 50, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
    });

    document.querySelectorAll('[data-count-to]').forEach((el) => {
      const target = parseInt(el.dataset.countTo);
      const suffix = el.dataset.countSuffix || '';
      const from = parseInt(el.dataset.countFrom) || 0;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
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
      scrollTrigger: { trigger: '#contact', start: 'top 80%', once: true },
      x: -40, opacity: 0, duration: 0.7, ease: 'power3.out',
    });
    gsap.from('[data-contact-form]', {
      scrollTrigger: { trigger: '#contact', start: 'top 80%', once: true },
      x: 40, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.2,
    });
  }

  function animateFaq() {
    gsap.from('[data-faq-list] details', {
      scrollTrigger: { trigger: '#faq', start: 'top 80%', once: true },
      y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
    });
  }

  animateHero();
  animateServices();
  animateTimeline();
  animateResults();
  animateContact();
  animateFaq();
})();

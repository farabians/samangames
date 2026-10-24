(() => {
  window.samanMotion = true;
  if (!document.documentElement.classList.contains('js-motion')) return;

  // Stagger children of [data-reveal-stagger] groups.
  document.querySelectorAll('[data-reveal-stagger]').forEach((group) => {
    const step = Number(group.dataset.revealStagger) || 100;
    group.querySelectorAll(':scope > [data-reveal]').forEach((item, index) => {
      item.style.setProperty('--d', `${index * step}ms`);
    });
  });

  const compactNumber = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 0 });

  const countUp = (element) => {
    const target = Number(element.dataset.count);
    const suffix = element.dataset.suffix || '';
    const finalText = element.textContent;
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = progress < 1 ? `${compactNumber.format(Math.round(target * eased))}${suffix}` : finalText;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const revealItems = document.querySelectorAll('[data-reveal]');
  const reveal = (item) => {
    item.classList.add('is-visible');
    item.querySelectorAll('[data-count]').forEach(countUp);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -40px 0px' },
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach(reveal);
  }

  // Game cards tilt toward the pointer, with a glare that follows it.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.game-card').forEach((card) => {
      const glare = document.createElement('span');
      glare.className = 'game-card__glare';
      glare.setAttribute('aria-hidden', 'true');
      card.append(glare);

      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        card.classList.add('is-tilting');
        card.style.setProperty('--ry', `${(x - 0.5) * 10}deg`);
        card.style.setProperty('--rx', `${(0.5 - y) * 10}deg`);
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
      });

      card.addEventListener('pointerleave', () => {
        card.classList.remove('is-tilting');
        ['--rx', '--ry', '--mx', '--my'].forEach((name) => card.style.removeProperty(name));
      });
    });
  }

  // Bubbles float up through the hero and pop when tapped.
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const layer = document.createElement('div');
  layer.className = 'hero-bubbles';
  layer.setAttribute('aria-hidden', 'true');
  hero.append(layer);

  const tints = ['255 189 38', '245 121 18', '255 128 170', '104 196 255', '140 214 110'];
  const random = (min, max) => min + Math.random() * (max - min);

  const updateRise = () => layer.style.setProperty('--rise', `${hero.offsetHeight}px`);
  updateRise();
  window.addEventListener('resize', updateRise);

  const spawnBubble = (spreadOut) => {
    const bubble = document.createElement('span');
    const duration = random(10, 19);
    bubble.className = 'hero-bubble';
    bubble.style.setProperty('--size', `${random(16, 60).toFixed(0)}px`);
    bubble.style.setProperty('--x', `${random(2, 96).toFixed(1)}%`);
    bubble.style.setProperty('--dur', `${duration.toFixed(1)}s`);
    bubble.style.setProperty('--delay', spreadOut ? `${(-random(0, duration)).toFixed(1)}s` : '0s');
    bubble.style.setProperty('--sway', `${random(8, 26).toFixed(0)}px`);
    bubble.style.setProperty('--tint', tints[Math.floor(Math.random() * tints.length)]);
    bubble.append(document.createElement('span'));

    bubble.addEventListener('pointerdown', () => {
      if (bubble.classList.contains('is-popping')) return;
      bubble.classList.add('is-popping');
      window.setTimeout(() => {
        bubble.remove();
        spawnBubble(false);
      }, 340);
    });

    layer.append(bubble);
  };

  const bubbleCount = window.innerWidth < 760 ? 6 : 11;
  for (let index = 0; index < bubbleCount; index += 1) spawnBubble(true);
})();

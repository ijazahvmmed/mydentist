import { gsap } from 'gsap';
const motion = matchMedia('(prefers-reduced-motion: no-preference)');

document.querySelector<HTMLButtonElement>('.clinic-spark')?.addEventListener('click', (event) => {
  if (!motion.matches) return;
  const box = (event.currentTarget as HTMLElement).getBoundingClientRect();
  for (let i = 0; i < 6; i++) {
    const dot = document.createElement('i');
    dot.className = 'smile-spark';
    dot.setAttribute('aria-hidden', 'true');
    document.body.append(dot);
    gsap.set(dot, { left: box.x + box.width / 2, top: box.y + box.height / 2 });
    const angle = (i / 5) * Math.PI;
    gsap.to(dot, {
      x: Math.cos(angle) * 58,
      y: Math.sin(angle) * 38 - 55,
      scale: 1.2,
      duration: 0.55,
      ease: 'back.out(2)',
      onComplete: () => {
        gsap.to(dot, {
          y: '-=15',
          opacity: 0,
          delay: 0.5,
          duration: 0.45,
          onComplete: () => dot.remove(),
        });
      },
    });
  }
});
const featured = document.querySelector<HTMLElement>('.featured-treatment');
featured?.addEventListener('pointermove', (event) => {
  if (!motion.matches || event.pointerType === 'touch') return;
  const r = featured.getBoundingClientRect();
  featured.style.setProperty('--pointer-x', `${((event.clientX - r.left) / r.width) * 100}%`);
  featured.style.setProperty('--pointer-y', `${((event.clientY - r.top) / r.height) * 100}%`);
});
const header = document.querySelector<HTMLElement>('.site-header');
const progress = () =>
  header?.style.setProperty(
    '--read-progress',
    String(scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight))
  );
addEventListener('scroll', progress, { passive: true });
progress();

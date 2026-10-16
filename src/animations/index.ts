import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
/** Group measured words into visual lines without changing the accessible heading. */
export function revealText(element: HTMLElement, delay = 0) {
  const original = element.innerHTML;
  const probe = document.createElement('div');
  probe.innerHTML = original.replace(/<br\b[^>]*>/gi, ' | ');
  const label = probe.textContent?.replace(/\s+/g, ' ').trim() || '';
  const words = label.split(' ');
  element.setAttribute('aria-label', label.replace(/ \| /g, ' '));
  element.innerHTML = words
    .map((word) =>
      word === '|' ? '<br>' : `<span class="measure-word" aria-hidden="true">${word} </span>`
    )
    .join('');
  const lines: string[][] = [];
  let top = -1;
  element.querySelectorAll<HTMLElement>('.measure-word').forEach((word) => {
    if (word.offsetTop !== top) {
      lines.push([]);
      top = word.offsetTop;
    }
    lines.at(-1)!.push(word.textContent!);
  });
  element.innerHTML = lines
    .map(
      (line) => `<span class="line-mask" aria-hidden="true"><span>${line.join('')}</span></span>`
    )
    .join('');
  gsap.from(element.querySelectorAll('.line-mask > span'), {
    yPercent: 108,
    duration: 0.85,
    stagger: 0.09,
    delay,
    ease: 'power3.out',
  });
  return () => {
    element.innerHTML = original;
    element.removeAttribute('aria-label');
  };
}
export function revealImage(element: HTMLElement, delay = 0) {
  const mediaMotion = element.dataset.mediaMotion;
  gsap.from(element, {
    clipPath: mediaMotion === 'horizontal' ? 'inset(0 100% 0 0)' : 'inset(100% 0 0 0)',
    duration: 1.1,
    delay,
    ease: 'power3.inOut',
  });
  const image = element.querySelector('img');
  if (image) {
    gsap.fromTo(
      element.querySelector('picture') || image,
      { scale: mediaMotion === 'none' ? 1.025 : 1.06 },
      { scale: 1, duration: 1.3, delay, ease: 'power2.out', clearProps: 'transform' }
    );
    if (mediaMotion !== 'none') {
      const horizontal = mediaMotion === 'horizontal';
      gsap.fromTo(
        image,
        horizontal ? { xPercent: -2, scale: 1.05 } : { yPercent: -3, scale: 1.07 },
        {
          ...(horizontal ? { xPercent: 2 } : { yPercent: 3 }),
          ease: 'none',
          scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        }
      );
    }
  }
}
export function initMotion() {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const restores: Array<() => void> = [];
    const context = gsap.context(() => {
      gsap.from('.header-inner > *', {
        y: -10,
        opacity: 0,
        duration: 0.65,
        stagger: 0.06,
        ease: 'power2.out',
      });
      document.querySelectorAll<HTMLElement>('.tech-card').forEach((card, i) => {
        const visual = card.querySelector('.digital-visual');
        if (!visual) return;
        gsap.from(visual, {
          scale: 0.92,
          opacity: 0.2,
          duration: 1.1,
          delay: i * 0.15,
          scrollTrigger: { trigger: card, start: 'top 92%', once: true },
        });
      });
      const art = document.querySelector<HTMLElement>('.aligner-art');
      if (art)
        gsap.fromTo(
          art,
          { rotate: -3 },
          {
            rotate: 3,
            ease: 'none',
            scrollTrigger: { trigger: art, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
          }
        );
    });
    const entrance = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entrance.unobserve(entry.target);
          context.add(() => {
            const el = entry.target as HTMLElement;
            if (el.matches('[data-service-family]')) {
              const number = el.querySelector('[data-family-number]');
              const heading = el.querySelector<HTMLElement>(
                '.family-heading h2,.family-heading h3'
              );
              gsap.from(number, {
                opacity: 0,
                y: 12,
                duration: 0.5,
                clearProps: 'opacity,transform',
              });
              if (heading) restores.push(revealText(heading, 0.12));
              gsap.from(el.querySelectorAll('[data-family-service]'), {
                opacity: 0,
                y: 10,
                duration: 0.55,
                stagger: 0.065,
                delay: 0.28,
                clearProps: 'opacity,transform',
              });
              const media = el.querySelector<HTMLElement>('.editorial-media');
              if (media) revealImage(media, 0.45);
              const cta = el.querySelector('[data-family-cta]');
              if (cta)
                gsap.from(cta, {
                  opacity: 0,
                  y: 8,
                  delay: 0.75,
                  duration: 0.45,
                  clearProps: 'opacity,transform',
                });
            } else if (el.matches('[data-care-motion]')) {
              gsap.from(el.querySelector('.duration-mask strong'), {
                yPercent: 108,
                duration: 0.95,
                ease: 'power3.out',
              });
              gsap.from(el.querySelectorAll('.care-duration .eyebrow,.care-duration p'), {
                opacity: 0,
                y: 8,
                duration: 0.65,
                stagger: 0.1,
                delay: 0.15,
                clearProps: 'opacity,transform',
              });
              const heading = el.querySelector<HTMLElement>('.care-network-heading h2');
              if (heading) restores.push(revealText(heading, 0.15));
              gsap.from(el.querySelectorAll('.network-location'), {
                opacity: 0,
                y: 10,
                duration: 0.6,
                stagger: 0.07,
                delay: 0.35,
                clearProps: 'opacity,transform',
              });
            } else if (
              el.matches('h1,h2,.technology-chapter-copy h3,.tech-copy h3,.featured-treatment h3')
            )
              restores.push(revealText(el));
            else if (el.matches('.aligner-art,.treatment-media,.editorial-media')) revealImage(el);
            else
              gsap.from(el, {
                opacity: 0,
                y: 12,
                duration: 0.6,
                delay: 0.1,
                clearProps: 'opacity,transform',
              });
          });
        });
      },
      { rootMargin: '0px 0px 4% 0px' }
    );
    document
      .querySelectorAll(
        'h1,h2,.technology-chapter-copy h3,.tech-copy h3,.featured-treatment h3,.eyebrow,.hero-topline,.hero-copy>p,.hero-actions,.tech-copy>p,.aligner-art,.treatment-media,.editorial-media,[data-service-family],[data-care-motion]'
      )
      .forEach((el) => {
        if (el.closest('[data-service-family]') && !el.matches('[data-service-family]')) return;
        if (el.closest('[data-care-motion]') && !el.matches('[data-care-motion]')) return;
        if (el.matches('.treatment-media') && el.querySelector('.editorial-media')) return;
        entrance.observe(el);
      });
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('in-view', e.isIntersecting)),
      { threshold: 0.1 }
    );
    document
      .querySelectorAll('.digital-visual,.media-scanning')
      .forEach((el) => observer.observe(el));
    return () => {
      context.revert();
      restores.forEach((fn) => fn());
      observer.disconnect();
      entrance.disconnect();
    };
  });
  const visibility = () =>
    document.documentElement.classList.toggle('is-page-hidden', document.hidden);
  document.addEventListener('visibilitychange', visibility);
  visibility();
  const header = document.querySelector('.site-header');
  const scroll = () => header?.classList.toggle('is-scrolled', scrollY > 30);
  addEventListener('scroll', scroll, { passive: true });
  scroll();
  document.addEventListener(
    'astro:before-swap',
    () => {
      mm.revert();
      removeEventListener('scroll', scroll);
      document.removeEventListener('visibilitychange', visibility);
    },
    { once: true }
  );
}
void document.fonts.ready.then(initMotion);

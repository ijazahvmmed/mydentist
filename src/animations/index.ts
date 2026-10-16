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
  const cinematic = mediaMotion === 'cinematic' || mediaMotion === 'depth';
  const horizontal = mediaMotion === 'horizontal';
  const mobile = matchMedia('(max-width: 700px)').matches;
  const entranceDelay = delay + (element.closest('.conversation-media') ? 0.18 : 0);
  gsap.from(element, {
    clipPath: mobile ? 'inset(8% 0 0 0)' : horizontal ? 'inset(0 100% 0 0)' : 'inset(100% 0 0 0)',
    duration: mobile ? 0.7 : cinematic ? 1.1 : 0.9,
    delay: entranceDelay,
    ease: 'power3.inOut',
  });
  const image = element.querySelector('img');
  if (image && mediaMotion !== 'none') {
    gsap.fromTo(
      element.querySelector('picture') || image,
      { scale: 1.025 },
      {
        scale: 1,
        duration: cinematic ? 1.8 : 1.3,
        delay: entranceDelay,
        ease: 'power2.out',
        clearProps: 'transform',
      }
    );
    // Phone crops remain stable; desktop movement stays inside a small overscan.
    if (!mobile) {
      const distance = 0.7;
      gsap.fromTo(
        image,
        horizontal ? { xPercent: -distance, scale: 1.025 } : { yPercent: -distance, scale: 1.025 },
        {
          ...(horizontal ? { xPercent: distance } : { yPercent: distance }),
          ease: 'none',
          scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        }
      );
    }
  }
}
/** Reveal the fixed experience milestone without changing the stated number. */
function revealExperience(element: HTMLElement) {
  const digits = element.querySelectorAll('[data-experience-digit]');
  if (!digits.length) return;
  const palette = getComputedStyle(element);
  const mobile = matchMedia('(max-width: 700px)').matches;
  const timeline = gsap.timeline({
    scrollTrigger: { trigger: element, start: 'top 78%', once: true },
    defaults: { ease: 'power3.out' },
  });
  timeline
    .from(
      element.querySelector('.duration-rule'),
      { scaleX: 0, opacity: 0, duration: 1, clearProps: 'transform,opacity' },
      0
    )
    .from(
      digits,
      {
        yPercent: 112,
        rotationX: -30,
        opacity: 0.2,
        duration: mobile ? 1.05 : 1.3,
        stagger: 0.14,
        ease: 'power4.out',
        clearProps: 'transform,opacity',
      },
      0.08
    )
    .fromTo(
      element.querySelector('.duration-value'),
      { color: palette.getPropertyValue('--blue-deep').trim() },
      {
        color: palette.getPropertyValue('--brand').trim(),
        duration: 1.25,
        clearProps: 'color',
      },
      0.08
    )
    .from(
      element.querySelector('.eyebrow'),
      { y: 10, opacity: 0, duration: 0.7, clearProps: 'transform,opacity' },
      0.35
    )
    .from(
      element.querySelector('p'),
      { y: 12, opacity: 0, duration: 0.8, clearProps: 'transform,opacity' },
      0.52
    );
}
export function initMotion() {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const restores: Array<() => void> = [];
    const context = gsap.context(() => {
      document.querySelectorAll<HTMLElement>('[data-care-reveal]').forEach(revealExperience);
      gsap.from('.header-inner', {
        y: -10,
        opacity: 0,
        duration: 0.65,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
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
      const campaign = document.querySelector('.home-campaign');
      if (campaign) {
        const palette = getComputedStyle(campaign);
        const brandColor = palette.getPropertyValue('--brand').trim();
        const inkColor = palette.getPropertyValue('--ink').trim();
        const paperColor = palette.getPropertyValue('--paper').trim();
        const blueColor = palette.getPropertyValue('--blue').trim();
        const hero = campaign.querySelector('.hero');
        const heroPicture = hero?.querySelector('.hero-artwork');
        const heroImage = hero?.querySelector('.hero-artwork img');
        if (heroPicture)
          gsap.fromTo(
            heroPicture,
            { scale: 1.055 },
            { scale: 1, duration: 1.8, ease: 'power3.out', clearProps: 'transform' }
          );
        if (hero && heroImage)
          gsap.fromTo(
            heroImage,
            { scale: 1.035, yPercent: -0.6 },
            {
              scale: 1.035,
              yPercent: matchMedia('(max-width: 700px)').matches ? 0.6 : 1.4,
              ease: 'none',
              scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.9 },
            }
          );
        const technology = campaign.querySelector('.technology-editorial');
        if (technology)
          gsap.fromTo(
            technology,
            { '--chapter-bg': brandColor },
            {
              '--chapter-bg': inkColor,
              immediateRender: false,
              ease: 'none',
              scrollTrigger: { trigger: technology, start: 'top 95%', end: 'top 22%', scrub: 1 },
            }
          );
        const locations = campaign.querySelector('[data-location-surface]');
        if (locations)
          gsap.fromTo(
            locations,
            { '--location-bg': paperColor },
            {
              '--location-bg': blueColor,
              immediateRender: false,
              ease: 'none',
              scrollTrigger: { trigger: locations, start: 'top 95%', end: 'top 30%', scrub: 0.8 },
            }
          );
        campaign.querySelectorAll<HTMLElement>('[data-cinematic-depth]').forEach((figure) => {
          const picture = figure.querySelector('.imaging-base');
          const depth = matchMedia('(max-width: 700px)').matches ? 1 : 3;
          if (picture)
            gsap.fromTo(
              picture,
              { rotationY: -depth, rotationX: 1, yPercent: -1 },
              {
                rotationY: depth,
                rotationX: -1,
                yPercent: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: figure,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1.2,
                },
              }
            );
        });
        campaign.querySelectorAll<HTMLElement>('[data-cinematic-opg]').forEach((figure) => {
          const visual = figure.querySelector('.opg-imaging-visual');
          if (!visual) return;
          gsap.fromTo(
            visual,
            { scale: 1.025 },
            {
              scale: 1,
              ease: 'power1.out',
              scrollTrigger: { trigger: figure, start: 'top 90%', end: 'top 35%', scrub: 1 },
            }
          );
          ScrollTrigger.create({
            trigger: figure,
            start: 'top 40%',
            end: 'bottom top',
            toggleClass: { targets: visual, className: 'is-scanning' },
          });
        });
      }
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
              const careMedia = el.querySelector<HTMLElement>(
                '.care-network-media .editorial-media'
              );
              if (careMedia) revealImage(careMedia, 0.15);
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
              el.matches(
                'h1,h2,h3[data-story-title],.technology-chapter-copy h3,.tech-copy h3,.featured-treatment h3'
              )
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
        'h1,h2,h3[data-story-title],.technology-chapter-copy h3,.tech-copy h3,.featured-treatment h3,.eyebrow,.hero-topline,.hero-copy>p,.hero-actions,.tech-copy>p,.aligner-art,.treatment-media,.editorial-media,[data-service-family],[data-care-motion]'
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

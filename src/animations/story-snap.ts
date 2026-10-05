import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function getStoryStops(stage: Element) {
  const chapters = Array.from(stage.querySelectorAll<HTMLElement>('.story-chapter'));
  if (stage.classList.contains('mobile-story')) {
    const rect = stage.getBoundingClientRect();
    const viewport = stage.querySelector('.story-text-viewport')!.getBoundingClientRect().height;
    const distance = (rect.height - viewport) / (chapters.length - 1);
    return chapters.map((_, i) => rect.top + window.scrollY + i * distance);
  }
  return chapters.map((chapter) => {
    const rect = chapter.getBoundingClientRect();
    return rect.top + window.scrollY + (rect.height - window.innerHeight) / 2;
  });
}

/** Snap only the enhanced tooth story, using the same chapter stops as the 3D timeline. */
export function createStorySnap(stage: Element) {
  let stops: number[] = [];
  const measure = () => {
    stops = getStoryStops(stage);
  };

  return ScrollTrigger.create({
    id: 'tooth-story-snap',
    trigger: stage,
    start: () => {
      measure();
      return stops[0] - window.innerHeight * 0.28;
    },
    end: () => stops[stops.length - 1] + window.innerHeight * 0.28,
    snap: {
      delay: 0.18,
      duration: { min: 0.22, max: 0.45 },
      ease: 'power2.inOut',
      inertia: false,
      directional: false,
      snapTo: (progress, trigger) => {
        if (!trigger) return progress;
        const scroll = trigger.scroll();
        // A small outward scroll at either end must release the story, not pull it back.
        if (
          (trigger.direction < 0 && scroll < stops[0]) ||
          (trigger.direction > 0 && scroll > stops[stops.length - 1]) ||
          document.hidden ||
          (stage.contains(document.activeElement) &&
            document.activeElement?.matches(
              'a, button:not([data-story-step]), input, select, textarea'
            ))
        )
          return progress;
        const target = gsap.utils.snap(stops, scroll);
        return (target - trigger.start) / (trigger.end - trigger.start);
      },
    },
  });
}

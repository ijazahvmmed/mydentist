import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getStoryStops } from './story-snap';

/** One clipped horizontal reading area; the document still scrolls vertically. */
export function createMobileStory(stage: Element) {
  const query = matchMedia('(max-width: 899px) and (prefers-reduced-motion: no-preference)');
  const track = stage.querySelector<HTMLElement>('.story-chapters')!;
  const chapters = Array.from(stage.querySelectorAll<HTMLElement>('.story-chapter'));
  const buttons = Array.from(stage.querySelectorAll<HTMLButtonElement>('[data-story-step]'));
  let phase = 0;
  let current = -1;
  let frame = 0;
  const update = (next: number) => {
    phase = next;
    if (!query.matches) return;
    track.style.transform = `translate3d(${-next * 100}%,0,0)`;
    const index = Math.round(next);
    if (index === current) return;
    current = index;
    chapters.forEach((chapter, i) => {
      chapter.inert = i !== index;
      chapter.setAttribute('aria-hidden', String(i !== index));
      if (i === index) buttons[i].setAttribute('aria-current', 'step');
      else buttons[i].removeAttribute('aria-current');
    });
  };
  const reset = () => {
    track.style.removeProperty('transform');
    chapters.forEach((chapter) => {
      chapter.inert = false;
      chapter.removeAttribute('aria-hidden');
    });
    buttons.forEach((button) => button.removeAttribute('aria-current'));
    current = -1;
  };
  const configure = () => {
    reset();
    stage.classList.toggle('mobile-story', query.matches);
    update(phase);
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => ScrollTrigger.refresh());
  };
  const select = (event: Event) => {
    const button = event.currentTarget as HTMLButtonElement;
    const index = Number(button.dataset.storyStep);
    window.scrollTo({ top: getStoryStops(stage)[index], behavior: 'smooth' });
  };
  buttons.forEach((button) => button.addEventListener('click', select));
  query.addEventListener('change', configure);
  configure();
  return {
    update,
    destroy() {
      cancelAnimationFrame(frame);
      query.removeEventListener('change', configure);
      buttons.forEach((button) => button.removeEventListener('click', select));
      stage.classList.remove('mobile-story');
      reset();
    },
  };
}

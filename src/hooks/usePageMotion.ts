import { useLayoutEffect } from 'react';

const motionSelector = [
  'main:not(.landing-main) .section-heading',
  'main:not(.landing-main) [data-reveal]',
  '.landing-main .privacy-heading > .eyebrow',
  '.landing-main .privacy-heading > h2',
  '.landing-main .privacy-aside > *',
  '.landing-main .section-heading > div > .eyebrow',
  '.landing-main .section-heading > div > h2',
  '.landing-main .section-heading > p',
  '.landing-main .questions-heading > *',
  '.landing-main .closing-inner > .eyebrow',
  '.landing-main .closing-inner > h2',
  '.landing-main .section-artwork[data-reveal]',
  '.landing-main .breathing-room[data-reveal]',
].join(',');

const staggerGroupSelector = '.privacy-heading,.privacy-aside,.section-heading,.questions-heading,.closing-inner';

export function usePageMotion(page: string) {
  useLayoutEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(motionSelector));
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    let listening = false;

    const reveal = (node: HTMLElement) => {
      node.classList.add('is-revealed');
      observer?.unobserve(node);
    };
    const revealAll = () => nodes.forEach(reveal);
    const paintProgress = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty('--scroll-progress', String(max > 0 ? Math.min(1, window.scrollY / max) : 0));
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(paintProgress); };
    const onFocus = (event: FocusEvent) => {
      const node = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-motion]');
      if (node) reveal(node);
    };

    const removeMotionState = () => {
      document.documentElement.classList.remove('has-reveals');
      nodes.forEach((node) => {
        delete node.dataset.motion;
        node.style.removeProperty('--reveal-delay');
      });
    };
    const stop = () => {
      observer?.disconnect();
      observer = undefined;
      window.cancelAnimationFrame(frame);
      frame = 0;
      if (listening) {
        window.removeEventListener('scroll', onScroll);
        document.removeEventListener('focusin', onFocus);
        listening = false;
      }
    };
    const start = () => {
      if (listening || preference.matches) return;
      nodes.forEach((node) => { node.dataset.motion = ''; });
      nodes.forEach((node) => {
        const group = node.closest<HTMLElement>(staggerGroupSelector);
        const groupIndex = group
          ? nodes.filter((candidate) => candidate.closest(staggerGroupSelector) === group).indexOf(node)
          : 0;
        const delay = groupIndex * 72;
        node.style.setProperty('--reveal-delay', `${delay}ms`);
      });
      document.documentElement.classList.add('has-reveals');
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => { if (entry.isIntersecting) reveal(entry.target as HTMLElement); });
        }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
        nodes.forEach((node) => observer?.observe(node));
      } else {
        revealAll();
      }
      paintProgress();
      window.addEventListener('scroll', onScroll, { passive: true });
      document.addEventListener('focusin', onFocus);
      listening = true;
    };
    const onPreference = () => {
      stop();
      if (preference.matches) {
        revealAll();
        removeMotionState();
      } else {
        nodes.forEach((node) => {
          if (node.getBoundingClientRect().top >= window.innerHeight) node.classList.remove('is-revealed');
        });
        start();
      }
    };

    if (preference.matches) revealAll();
    else start();
    preference.addEventListener('change', onPreference);

    return () => {
      preference.removeEventListener('change', onPreference);
      stop();
      removeMotionState();
      nodes.forEach((node) => node.classList.remove('is-revealed'));
      document.documentElement.style.removeProperty('--scroll-progress');
    };
  }, [page]);
}

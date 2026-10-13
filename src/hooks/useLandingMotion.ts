import { useLayoutEffect } from 'react';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function useLandingMotion(page: string) {
  useLayoutEffect(() => {
    const artworks = Array.from(document.querySelectorAll<HTMLElement>('.landing-main .section-artwork'));
    const notebooks = Array.from(document.querySelectorAll<HTMLElement>('.landing-main .notebook'));
    if (!artworks.length) return;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 680px)');
    const visible = new Set<HTMLElement>();
    let observer: IntersectionObserver | undefined;
    let inkObserver: IntersectionObserver | undefined;
    let frame = 0;
    let listening = false;

    const reset = (node: HTMLElement) => {
      node.style.removeProperty('--parallax-y');
      node.style.removeProperty('--parallax-rotate');
    };
    const setStatic = () => {
      document.documentElement.classList.remove('has-landing-motion');
      artworks.forEach(reset);
      notebooks.forEach((node) => node.classList.add('is-inked'));
    };
    const paint = () => {
      frame = 0;
      const viewportCenter = window.innerHeight / 2;
      const distance = Math.max(1, window.innerHeight * 0.65);
      const travel = mobile.matches ? 8 : 16;
      visible.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const progress = clamp((viewportCenter - (rect.top + rect.height / 2)) / distance, -1, 1);
        const direction = node.classList.contains('section-artwork--possibilities') ? -0.72 : 0.72;
        node.style.setProperty('--parallax-y', `${(progress * travel).toFixed(2)}px`);
        node.style.setProperty('--parallax-rotate', `${(progress * direction).toFixed(3)}deg`);
      });
    };
    const schedule = () => {
      if (visible.size && !frame) frame = window.requestAnimationFrame(paint);
    };
    const stop = () => {
      observer?.disconnect();
      observer = undefined;
      inkObserver?.disconnect();
      inkObserver = undefined;
      window.cancelAnimationFrame(frame);
      frame = 0;
      visible.clear();
      if (listening) {
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        mobile.removeEventListener('change', schedule);
        listening = false;
      }
      setStatic();
    };
    const start = () => {
      if (listening) return;
      if (preference.matches || !('IntersectionObserver' in window)) {
        setStatic();
        return;
      }
      document.documentElement.classList.add('has-landing-motion');
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const node = entry.target as HTMLElement;
          if (entry.isIntersecting) visible.add(node);
          else { visible.delete(node); reset(node); }
        });
        schedule();
      }, { rootMargin: '18% 0px 18% 0px' });
      artworks.forEach((node) => observer?.observe(node));
      inkObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-inked');
          inkObserver?.unobserve(entry.target);
        });
      }, { threshold: 0.18 });
      notebooks.forEach((node) => {
        node.classList.remove('is-inked');
        inkObserver?.observe(node);
      });
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      mobile.addEventListener('change', schedule);
      listening = true;
    };
    const onPreference = () => { if (preference.matches) stop(); else start(); };

    start();
    preference.addEventListener('change', onPreference);
    return () => {
      preference.removeEventListener('change', onPreference);
      stop();
    };
  }, [page]);
}

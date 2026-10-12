import { useLayoutEffect } from 'react';

export function usePageMotion(page: string) {
  useLayoutEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(
      'main .section-heading, main .notebook, main .model-row, main .questions-list, main .privacy-heading, main .privacy-aside, main [data-reveal]',
    )).filter(node => !node.parentElement?.closest('[data-motion]'));
    let observer: IntersectionObserver | undefined;
    let frame = 0;

    const revealAll = () => nodes.forEach(node => node.classList.add('is-revealed'));
    if (preference.matches || !('IntersectionObserver' in window)) {
      revealAll();
    } else {
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer?.unobserve(entry.target);
          }
        }
      }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
      nodes.forEach((node, i) => {
        node.dataset.motion = '';
        node.style.setProperty('--reveal-delay', `${node.classList.contains('notebook') ? (i % 3) * 80 : 0}ms`);
        observer?.observe(node);
      });
      document.documentElement.classList.add('has-reveals');
    }

    const progress = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty('--scroll-progress', String(max > 0 ? Math.min(1, window.scrollY / max) : 0));
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(progress); };
    const onPreference = () => { if (preference.matches) { observer?.disconnect(); revealAll(); } };
    progress();
    window.addEventListener('scroll', onScroll, { passive: true });
    preference.addEventListener('change', onPreference);
    return () => {
      observer?.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      preference.removeEventListener('change', onPreference);
      document.documentElement.classList.remove('has-reveals');
      nodes.forEach(node => { delete node.dataset.motion; node.classList.remove('is-revealed'); });
    };
  }, [page]);
}

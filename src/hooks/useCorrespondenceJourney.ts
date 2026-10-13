import { useLayoutEffect, type RefObject } from 'react';

type Pose = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  letter: number;
  opacity: number;
  storyProgress: number;
};

type JourneyStop = {
  element: HTMLElement;
  stop: number;
  worldX: number;
  worldY: number;
  scale: number;
  mobileScale: number;
  rotation: number;
  letter: number;
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (value: number) => {
  const progress = clamp(value);
  return progress * progress * (3 - 2 * progress);
};
const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;
const readNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export function useCorrespondenceJourney(artRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const art = artRef.current;
    const story = document.querySelector<HTMLElement>('.letter-story');
    const heroAnchor = story?.querySelector<HTMLElement>('.mail-anchor');
    if (!art || !story || !heroAnchor) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileLayout = window.matchMedia('(max-width: 680px)');
    const journeyAnchors = Array.from(document.querySelectorAll<HTMLElement>('[data-journey]'));
    let baseWidth = 0;
    let baseHeight = 0;
    let heroStop = 0;
    let heroWorldX = 0;
    let heroWorldY = 0;
    let stops: JourneyStop[] = [];
    let frame = 0;
    let initializationFrame = 0;
    let initialized = false;
    let activeMobileAnchor: HTMLElement | null = null;
    let current: Pose = { x: 0, y: 0, scale: 1, rotation: 0, letter: 0, opacity: 1, storyProgress: 0 };
    let target: Pose = { ...current };
    let observer: ResizeObserver | null = null;
    let listening = false;
    let disposed = false;
    let activeSection = 'hero';

    const headerHeight = () => document.querySelector<HTMLElement>('.site-header')?.getBoundingClientRect().height ?? 0;
    const visibleCenter = () => {
      const header = headerHeight();
      return header + (window.innerHeight - header) / 2;
    };

    const setOpening = (element: HTMLElement, progress: number) => {
      element.style.setProperty('--seal-release', smoothstep((progress - 0.04) / 0.24).toFixed(4));
      element.style.setProperty('--flap-open', smoothstep((progress - 0.17) / 0.3).toFixed(4));
      element.style.setProperty('--letter-out', smoothstep((progress - 0.36) / 0.46).toFixed(4));
    };

    const setLetterState = (element: HTMLElement, letter: number) => {
      setOpening(element, clamp(letter));
    };

    const setPhase = (element: HTMLElement, progress: number) => {
      element.dataset.phase = progress < 0.22 ? 'sealed' : progress < 0.63 ? 'opening' : 'unfolded';
    };

    const measure = () => {
      const scrollY = window.scrollY;
      const anchorRect = heroAnchor.getBoundingClientRect();
      const artRect = art.getBoundingClientRect();
      baseWidth = anchorRect.width || artRect.width;
      baseHeight = anchorRect.height || artRect.height;
      if (baseWidth <= 0 || baseHeight <= 0) return false;

      const header = headerHeight();
      const storyRect = story.getBoundingClientRect();
      const storyTop = storyRect.top + scrollY;
      const travel = Math.max(0, story.offsetHeight - (window.innerHeight - header));
      heroStop = storyTop + travel - header;

      const stage = heroAnchor.closest<HTMLElement>('.letter-stage');
      const stageRect = stage?.getBoundingClientRect();
      const pinnedTop = stageRect ? header + (anchorRect.top - stageRect.top) : anchorRect.top;
      heroWorldX = anchorRect.left;
      heroWorldY = pinnedTop + heroStop;

      const center = visibleCenter();
      stops = journeyAnchors.map((element) => {
        const rect = element.getBoundingClientRect();
        const scale = Math.max(0, readNumber(element.dataset.journeyScale, 1));
        const mobileScale = Math.max(0, readNumber(element.dataset.journeyScaleMobile, scale));
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + scrollY + rect.height / 2;
        return {
          element,
          stop: centerY - center,
          worldX: centerX - (baseWidth * scale) / 2,
          worldY: centerY - (baseHeight * scale) / 2,
          scale,
          mobileScale,
          rotation: readNumber(element.dataset.journeyRotation, 0),
          letter: clamp(readNumber(element.dataset.journeyLetter, 1)),
        };
      }).sort((a, b) => a.stop - b.stop);

      art.style.width = `${baseWidth.toFixed(2)}px`;
      art.style.height = `${baseHeight.toFixed(2)}px`;
      return true;
    };

    const heroProgress = () => {
      const header = headerHeight();
      const travel = story.offsetHeight - (window.innerHeight - header);
      return travel > 0 ? clamp((header - story.getBoundingClientRect().top) / travel) : 1;
    };

    const poseForDesktop = (scrollY: number, progress: number): Pose => {
      if (progress < 1 || stops.length === 0) {
        activeSection = 'hero';
        const rect = heroAnchor.getBoundingClientRect();
        return { x: rect.left, y: rect.top, scale: 1, rotation: 0, letter: progress, opacity: 1, storyProgress: progress };
      }

      const heroNode: JourneyStop = {
        element: heroAnchor,
        stop: heroStop,
        worldX: heroWorldX,
        worldY: heroWorldY,
        scale: 1,
        mobileScale: 1,
        rotation: 0,
        letter: 1,
      };
      const nodes = [heroNode, ...stops];
      const nearest = stops.reduce((best, stop) => Math.abs(stop.stop - scrollY) < Math.abs(best.stop - scrollY) ? stop : best);
      activeSection = nearest.element.dataset.journey ?? '';
      let from = nodes[0];
      let to = nodes[1] ?? nodes[0];
      if (scrollY >= nodes[nodes.length - 1].stop) {
        from = nodes[nodes.length - 1];
        to = from;
      } else {
        for (let index = 0; index < nodes.length - 1; index += 1) {
          if (scrollY <= nodes[index + 1].stop) {
            from = nodes[index];
            to = nodes[index + 1];
            break;
          }
        }
      }
      const span = Math.max(1, to.stop - from.stop);
      const linear = from === to ? 1 : clamp((scrollY - from.stop) / span);
      const amount = smoothstep(linear);
      const changesColumn = Math.abs(to.worldX - from.worldX) > baseWidth * 0.35;
      const xAmount = !changesColumn
        ? amount
        : to.worldX < from.worldX
          ? smoothstep((linear - 0.6) / 0.4)
          : smoothstep(linear / 0.4);
      const verticalArc = changesColumn ? Math.sin(Math.PI * linear) * baseHeight * 0.22 : 0;
      return {
        x: mix(from.worldX, to.worldX, xAmount),
        y: mix(from.worldY, to.worldY, amount) - scrollY + verticalArc,
        scale: mix(from.scale, to.scale, amount),
        rotation: mix(from.rotation, to.rotation, amount),
        letter: mix(from.letter, to.letter, amount),
        opacity: 1,
        storyProgress: 1,
      };
    };

    const poseForMobile = (progress: number): Pose => {
      if (progress < 1) {
        activeMobileAnchor = null;
        activeSection = 'hero';
        const rect = heroAnchor.getBoundingClientRect();
        return { x: rect.left, y: rect.top, scale: 1, rotation: 0, letter: progress, opacity: 1, storyProgress: progress };
      }
      if (stops.length === 0) {
        activeMobileAnchor = null;
        activeSection = 'hero';
        return { ...current, opacity: 0, storyProgress: 1 };
      }

      const header = headerHeight();
      const center = visibleCenter();
      const candidates = stops.map((stop) => ({ stop, rect: stop.element.getBoundingClientRect() }))
        .filter(({ rect }) => rect.bottom > header && rect.top < window.innerHeight)
        .sort((a, b) => Math.abs(a.rect.top + a.rect.height / 2 - center) - Math.abs(b.rect.top + b.rect.height / 2 - center));
      const closest = candidates[0];
      if (!closest) {
        activeMobileAnchor = null;
        const nearest = stops.reduce((best, stop) => Math.abs(stop.stop - window.scrollY) < Math.abs(best.stop - window.scrollY) ? stop : best);
        activeSection = nearest.element.dataset.journey ?? '';
        return { ...current, opacity: 0, storyProgress: 1 };
      }

      const { stop, rect } = closest;
      activeSection = stop.element.dataset.journey ?? '';
      const enteringAnchor = activeMobileAnchor !== stop.element;
      activeMobileAnchor = stop.element;
      const scale = stop.mobileScale;
      const x = rect.left + (rect.width - baseWidth * scale) / 2;
      const y = rect.top + (rect.height - baseHeight * scale) / 2;
      const overlap = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, header));
      const opacity = clamp(overlap / Math.min(96, Math.max(1, rect.height / 2)));
      if (enteringAnchor && initialized) {
        current.x = x;
        current.y = y;
        current.scale = scale;
        current.rotation = stop.rotation;
        current.letter = stop.letter;
      }
      return { x, y, scale, rotation: stop.rotation, letter: stop.letter, opacity, storyProgress: 1 };
    };

    const paint = () => {
      art.style.transform = `translate3d(${current.x.toFixed(2)}px,${current.y.toFixed(2)}px,0) scale(${current.scale.toFixed(4)}) rotate(${current.rotation.toFixed(2)}deg)`;
      art.style.opacity = current.opacity.toFixed(4);
      art.dataset.journeySection = activeSection;
      story.style.setProperty('--story-progress', current.storyProgress.toFixed(4));
      if (current.storyProgress < 1) {
        setOpening(art, current.storyProgress);
        setOpening(story, current.storyProgress);
        setPhase(art, current.storyProgress);
        setPhase(story, current.storyProgress);
      } else {
        setLetterState(art, current.letter);
        setLetterState(story, current.letter);
        setPhase(art, current.letter);
        setPhase(story, current.letter);
      }
    };

    const animate = () => {
      frame = 0;
      let unsettled = false;
      (Object.keys(current) as Array<keyof Pose>).forEach((key) => {
        const delta = target[key] - current[key];
        const epsilon = key === 'x' || key === 'y' ? 0.08 : 0.0004;
        if (Math.abs(delta) <= epsilon) current[key] = target[key];
        else {
          current[key] += delta * 0.16;
          unsettled = true;
        }
      });
      paint();
      if (unsettled) frame = window.requestAnimationFrame(animate);
    };

    const update = () => {
      if (reducedMotion.matches || !baseWidth || !baseHeight) return;
      const progress = heroProgress();
      target = mobileLayout.matches ? poseForMobile(progress) : poseForDesktop(window.scrollY, progress);
      if (!initialized) {
        current = { ...target };
        initialized = true;
        paint();
        return;
      }
      if (!frame) frame = window.requestAnimationFrame(animate);
    };

    const remeasure = () => {
      if (reducedMotion.matches) return;
      if (measure()) update();
    };

    const stopMotion = () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(initializationFrame);
      frame = 0;
      initializationFrame = 0;
      if (listening) {
        window.removeEventListener('scroll', update);
        window.removeEventListener('resize', remeasure);
        window.removeEventListener('load', remeasure);
        mobileLayout.removeEventListener('change', remeasure);
        observer?.disconnect();
        observer = null;
        listening = false;
      }
    };

    const startMotion = () => {
      if (listening || reducedMotion.matches) return;
      art.style.opacity = '0';
      initialized = false;
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', remeasure);
      window.addEventListener('load', remeasure);
      mobileLayout.addEventListener('change', remeasure);
      observer = new ResizeObserver(remeasure);
      observer.observe(story);
      observer.observe(document.body);
      journeyAnchors.forEach((anchor) => observer?.observe(anchor));
      listening = true;
      initializationFrame = window.requestAnimationFrame(() => {
        initializationFrame = 0;
        if (!disposed && !reducedMotion.matches) remeasure();
      });
      void document.fonts?.ready.then(() => { if (!disposed) remeasure(); });
    };

    const applyReducedMotion = () => {
      stopMotion();
      art.style.opacity = '0';
      art.dataset.journeySection = 'hero';
      story.style.setProperty('--story-progress', '1');
      setLetterState(story, 1);
      setPhase(story, 1);
    };

    const onMotionPreference = () => {
      if (reducedMotion.matches) applyReducedMotion();
      else startMotion();
    };

    if (reducedMotion.matches) applyReducedMotion();
    else startMotion();
    reducedMotion.addEventListener('change', onMotionPreference);

    return () => {
      disposed = true;
      reducedMotion.removeEventListener('change', onMotionPreference);
      stopMotion();
      art.style.removeProperty('width');
      art.style.removeProperty('height');
      art.style.removeProperty('transform');
      art.style.removeProperty('opacity');
      art.style.removeProperty('--seal-release');
      art.style.removeProperty('--flap-open');
      art.style.removeProperty('--letter-out');
      delete art.dataset.phase;
      delete art.dataset.journeySection;
      story.style.removeProperty('--story-progress');
      story.style.removeProperty('--seal-release');
      story.style.removeProperty('--flap-open');
      story.style.removeProperty('--letter-out');
      delete story.dataset.phase;
    };
  }, [artRef]);
}

import { useLayoutEffect, type RefObject } from 'react';

type Channels = {
  x: number; y: number; z: number; scale: number;
  rotateX: number; rotateY: number; rotateZ: number;
  sealRelease: number; flapOpen: number; letterOut: number;
  opacity: number; storyProgress: number;
};

type SceneAnchor = {
  element: HTMLElement;
  name: string;
  scale: number;
  mobileScale: number;
  rotation: number;
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (value: number) => { const p = clamp(value); return p * p * (3 - 2 * p); };
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
    const anchors: SceneAnchor[] = Array.from(document.querySelectorAll<HTMLElement>('[data-journey]')).map((element) => {
      const scale = Math.max(0, readNumber(element.dataset.journeyScale, 1));
      return {
        element,
        name: element.dataset.journey ?? '',
        scale,
        mobileScale: Math.max(0, readNumber(element.dataset.journeyScaleMobile, scale)),
        rotation: readNumber(element.dataset.journeyRotation, 0),
      };
    });

    let baseWidth = 0;
    let baseHeight = 0;
    let frame = 0;
    let initializationFrame = 0;
    let initialized = false;
    let listening = false;
    let disposed = false;
    let observer: ResizeObserver | null = null;
    let activeAnchor: SceneAnchor | null = null;
    let pendingAnchor: SceneAnchor | null = null;
    let activeSection = 'hero';
    let current: Channels = {
      x: 0, y: 0, z: -9, scale: 1,
      rotateX: 10, rotateY: -16, rotateZ: 0,
      sealRelease: 0, flapOpen: 0, letterOut: 0,
      opacity: 0, storyProgress: 0,
    };
    let target: Channels = { ...current };

    const headerHeight = () => document.querySelector<HTMLElement>('.site-header')?.getBoundingClientRect().height ?? 0;
    const visibleCenter = () => {
      const header = headerHeight();
      return header + (window.innerHeight - header) / 2;
    };
    const heroProgress = () => {
      const header = headerHeight();
      const travel = story.offsetHeight - (window.innerHeight - header);
      return travel > 0 ? clamp((header - story.getBoundingClientRect().top) / travel) : 1;
    };
    const openingChannels = (progress: number) => ({
      sealRelease: smoothstep((progress - 0.1) / 0.13),
      flapOpen: smoothstep((progress - 0.24) / 0.22),
      letterOut: smoothstep((progress - 0.43) / 0.24),
    });
    const setPhase = (element: HTMLElement, channels: Channels) => {
      element.dataset.phase = channels.letterOut > 0.94 ? 'unfolded' : channels.flapOpen > 0.05 ? 'opening' : 'sealed';
    };

    const measure = () => {
      const anchorRect = heroAnchor.getBoundingClientRect();
      const artRect = art.getBoundingClientRect();
      baseWidth = anchorRect.width || artRect.width;
      baseHeight = anchorRect.height || artRect.height;
      if (baseWidth <= 0 || baseHeight <= 0) return false;
      art.style.width = `${baseWidth.toFixed(2)}px`;
      art.style.height = `${baseHeight.toFixed(2)}px`;
      return true;
    };

    const visibleAnchor = () => {
      const header = headerHeight();
      const center = visibleCenter();
      return anchors
        .map((anchor) => ({ anchor, rect: anchor.element.getBoundingClientRect() }))
        .filter(({ rect }) => rect.bottom > header && rect.top < window.innerHeight)
        .sort((a, b) => Math.abs(a.rect.top + a.rect.height / 2 - center) - Math.abs(b.rect.top + b.rect.height / 2 - center))[0] ?? null;
    };

    const sceneChannels = (anchor: SceneAnchor, rect: DOMRect): Channels => {
      const scale = mobileLayout.matches ? anchor.mobileScale : anchor.scale;
      const center = visibleCenter();
      const closingProgress = anchor.name === 'closing'
        ? clamp((window.innerHeight - rect.top) / Math.max(1, window.innerHeight - center))
        : 0;
      const opening = openingChannels(anchor.name === 'closing' ? 1 - closingProgress : 1);
      return {
        x: rect.left + (rect.width - baseWidth * scale) / 2,
        y: rect.top + (rect.height - baseHeight * scale) / 2,
        z: -2,
        scale,
        rotateX: 6,
        rotateY: -10,
        rotateZ: anchor.rotation,
        sealRelease: opening.sealRelease,
        flapOpen: opening.flapOpen,
        letterOut: opening.letterOut,
        opacity: 1,
        storyProgress: 1,
      };
    };

    const setDirectPosition = (pose: Channels) => {
      current.x = target.x = pose.x;
      current.y = target.y = pose.y;
      current.scale = target.scale = pose.scale;
      current.storyProgress = target.storyProgress = pose.storyProgress;
    };
    const assignSmoothTargets = (pose: Channels) => {
      target.z = pose.z;
      target.rotateX = pose.rotateX;
      target.rotateY = pose.rotateY;
      target.rotateZ = pose.rotateZ;
      target.sealRelease = pose.sealRelease;
      target.flapOpen = pose.flapOpen;
      target.letterOut = pose.letterOut;
      target.opacity = pose.opacity;
    };
    const paint = () => {
      art.style.transform = `translate3d(${current.x.toFixed(2)}px,${current.y.toFixed(2)}px,${current.z.toFixed(2)}px) scale(${current.scale.toFixed(4)}) rotateX(${current.rotateX.toFixed(2)}deg) rotateY(${current.rotateY.toFixed(2)}deg) rotateZ(${current.rotateZ.toFixed(2)}deg)`;
      art.style.opacity = current.opacity.toFixed(4);
      art.dataset.journeySection = activeSection;
      art.style.setProperty('--seal-release', current.sealRelease.toFixed(4));
      art.style.setProperty('--flap-open', current.flapOpen.toFixed(4));
      art.style.setProperty('--letter-out', current.letterOut.toFixed(4));
      story.style.setProperty('--story-progress', current.storyProgress.toFixed(4));
      story.style.setProperty('--seal-release', current.sealRelease.toFixed(4));
      story.style.setProperty('--flap-open', current.flapOpen.toFixed(4));
      story.style.setProperty('--letter-out', current.letterOut.toFixed(4));
      setPhase(art, current);
      setPhase(story, current);
    };
    const activateAnchor = (anchor: SceneAnchor) => {
      activeAnchor = anchor;
      pendingAnchor = null;
      activeSection = anchor.name;
      const pose = sceneChannels(anchor, anchor.element.getBoundingClientRect());
      setDirectPosition(pose);
      assignSmoothTargets(pose);
    };

    const smoothKeys: Array<keyof Channels> = ['z', 'rotateX', 'rotateY', 'rotateZ', 'sealRelease', 'flapOpen', 'letterOut', 'opacity'];
    const epsilonFor = (key: keyof Channels) => key === 'rotateX' || key === 'rotateY' || key === 'rotateZ' || key === 'z' ? 0.02 : 0.0004;
    const animate = () => {
      frame = 0;
      let needsFrame = false;
      smoothKeys.forEach((key) => {
        const delta = target[key] - current[key];
        const epsilon = epsilonFor(key);
        if (Math.abs(delta) <= epsilon) current[key] = target[key];
        else { current[key] += delta * 0.18; needsFrame = true; }
      });
      if (pendingAnchor && current.opacity <= 0.012) {
        current.opacity = 0;
        activateAnchor(pendingAnchor);
        needsFrame = true;
      }
      paint();
      if (needsFrame) frame = window.requestAnimationFrame(animate);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(animate); };

    const heroFraming = (framing: number) => {
      const isMobile = mobileLayout.matches;
      const isTablet = window.innerWidth > 680 && window.innerWidth <= 900;
      const isShortTablet = isTablet && window.innerHeight < 760;

      if (isMobile) return { horizontalShift: 0, verticalShift: 0, scale: 1 };
      if (isShortTablet) {
        return {
          horizontalShift: framing * baseWidth * 0.32,
          verticalShift: (1 - framing) * 20,
          scale: mix(0.8, 0.85, framing),
        };
      }
      if (isTablet) {
        return {
          horizontalShift: 0,
          verticalShift: 0,
          scale: mix(0.9, 1, framing),
        };
      }
      return {
        horizontalShift: framing * baseWidth * 0.35,
        verticalShift: (1 - framing) * 100,
        scale: mix(0.9, 1, framing),
      };
    };

    const updateHero = (progress: number) => {
      activeAnchor = null;
      pendingAnchor = null;
      activeSection = 'hero';
      const rect = heroAnchor.getBoundingClientRect();
      const camera = smoothstep(progress);
      const framing = smoothstep((progress - 0.15) / 0.25);
      const isMobile = mobileLayout.matches;
      const { horizontalShift, verticalShift, scale } = heroFraming(framing);
      const opening = openingChannels(progress);
      const pose: Channels = {
        x: rect.left + horizontalShift,
        y: rect.top + verticalShift,
        z: 0,
        scale,
        rotateX: mix(isMobile ? 5 : 10, 0, camera),
        rotateY: mix(isMobile ? -7 : -16, 0, camera),
        rotateZ: mix(isMobile ? -4 : -7, 0, camera),
        sealRelease: opening.sealRelease,
        flapOpen: opening.flapOpen,
        letterOut: opening.letterOut,
        opacity: 1,
        storyProgress: progress,
      };
      setDirectPosition(pose);
      assignSmoothTargets(pose);
    };

    const followOriginFrame = () => {
      if (activeAnchor) {
        setDirectPosition(sceneChannels(activeAnchor, activeAnchor.element.getBoundingClientRect()));
        return;
      }
      const rect = heroAnchor.getBoundingClientRect();
      const { horizontalShift, verticalShift, scale } = heroFraming(1);
      current.x = target.x = rect.left + horizontalShift;
      current.y = target.y = rect.top + verticalShift;
      current.scale = target.scale = scale;
      current.storyProgress = target.storyProgress = 1;
    };

    const updateScenes = () => {
      current.storyProgress = target.storyProgress = 1;
      const visible = visibleAnchor();
      if (!visible) {
        followOriginFrame();
        pendingAnchor = null;
        target.opacity = 0;
        return;
      }
      if (activeAnchor === visible.anchor) {
        pendingAnchor = null;
        const pose = sceneChannels(visible.anchor, visible.rect);
        setDirectPosition(pose);
        assignSmoothTargets(pose);
        return;
      }
      if (current.opacity <= 0.012) activateAnchor(visible.anchor);
      else {
        followOriginFrame();
        pendingAnchor = visible.anchor;
        target.opacity = 0;
      }
    };

    const update = () => {
      if (reducedMotion.matches || !baseWidth || !baseHeight) return;
      const progress = heroProgress();
      if (progress < 1) updateHero(progress);
      else updateScenes();
      if (!initialized) {
        current = { ...target };
        initialized = true;
        paint();
        return;
      }
      paint();
      if (pendingAnchor || smoothKeys.some((key) => Math.abs(target[key] - current[key]) > epsilonFor(key))) schedule();
    };
    const remeasure = () => { if (!reducedMotion.matches && measure()) update(); };

    const stopMotion = () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(initializationFrame);
      frame = 0;
      initializationFrame = 0;
      if (!listening) return;
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', remeasure);
      window.removeEventListener('load', remeasure);
      mobileLayout.removeEventListener('change', remeasure);
      observer?.disconnect();
      observer = null;
      listening = false;
    };
    const startMotion = () => {
      if (listening || reducedMotion.matches) return;
      art.style.opacity = '0';
      initialized = false;
      activeAnchor = null;
      pendingAnchor = null;
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', remeasure);
      window.addEventListener('load', remeasure);
      mobileLayout.addEventListener('change', remeasure);
      observer = new ResizeObserver(remeasure);
      observer.observe(story);
      observer.observe(heroAnchor);
      observer.observe(document.body);
      anchors.forEach((anchor) => observer?.observe(anchor.element));
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
      story.style.setProperty('--story-progress', '1');
      story.style.setProperty('--seal-release', '1');
      story.style.setProperty('--flap-open', '1');
      story.style.setProperty('--letter-out', '1');
      story.dataset.phase = 'unfolded';
    };
    const onMotionPreference = () => { if (reducedMotion.matches) applyReducedMotion(); else startMotion(); };

    if (reducedMotion.matches) applyReducedMotion(); else startMotion();
    reducedMotion.addEventListener('change', onMotionPreference);
    return () => {
      disposed = true;
      reducedMotion.removeEventListener('change', onMotionPreference);
      stopMotion();
      ['width', 'height', 'transform', 'opacity', '--seal-release', '--flap-open', '--letter-out'].forEach((property) => art.style.removeProperty(property));
      delete art.dataset.phase;
      delete art.dataset.journeySection;
      ['--story-progress', '--seal-release', '--flap-open', '--letter-out'].forEach((property) => story.style.removeProperty(property));
      delete story.dataset.phase;
    };
  }, [artRef]);
}

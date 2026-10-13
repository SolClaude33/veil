type JourneyAnchorProps = {
  name: string;
  scale: number;
  mobileScale?: number;
  letter: number;
  rotation?: number;
  caption?: string;
};

export default function JourneyAnchor({ name, scale, mobileScale = 0.9, letter, rotation = 0, caption }: JourneyAnchorProps) {
  return <div className={`journey-anchor journey-anchor--${name}`} data-journey={name} data-journey-scale={scale} data-journey-scale-mobile={mobileScale} data-journey-letter={letter} data-journey-rotation={rotation} aria-hidden="true">
    <img className="journey-static-image" src="/assets/hero-correspondence-v01.webp" alt="" width="1536" height="1024" loading="lazy" />
    {caption && <span className="journey-anchor-caption">{caption}</span>}
  </div>;
}

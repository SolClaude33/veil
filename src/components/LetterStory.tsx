import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { VeilSymbol } from './Brand';
import EnvelopeArtwork from './EnvelopeArtwork';
import './letter-story.css';

export default function LetterStory({ onLaunch }: { onLaunch: () => void }) {
  return (
    <section className="letter-story" aria-labelledby="hero-title" data-phase="sealed">
      <div className="letter-stage">
        <VeilSymbol className="letter-stage-monogram" />
        <div className="letter-stage-inner wrap">
          <div className="letter-intro">
            <span className="eyebrow">OPEN INTELLIGENCE. PERSONAL SPACE.</span>
            <h1 id="hero-title"><span>Think freely.</span><em>Keep it yours.</em></h1>
            <p>A space for the questions, drafts<br />and ideas you keep to yourself.</p>
          </div>
          <div className="letter-reveal" aria-hidden="true">
            <span className="eyebrow">A LITTLE ROOM FOR POSSIBILITY</span>
            <p className="letter-reveal-title">Your thoughts.<br /><em>Your own.</em></p>
            <p>Some ideas need room<br />before they need an audience.</p>
          </div>
          <div className="mail-anchor"><EnvelopeArtwork className="mail-static-fallback" withCaption={false} /></div>
          <div className="letter-stage-footer">
            <button className="button button--primary" onClick={onLaunch}>Open your studio <ArrowUpRight size={17} /></button>
            <div className="letter-chapters" aria-hidden="true"><span>01 — A thought</span><span>02 — A little space</span><span>03 — Personally yours</span><i /></div>
            <button type="button" className="letter-scroll-cue" onClick={event => {
              const story = event.currentTarget.closest<HTMLElement>('.letter-story');
              if (!story) return;
              if (story.dataset.phase === 'unfolded') {
                document.getElementById('privacy')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
              }
              const header = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 94;
              const travel = story.offsetHeight - (window.innerHeight - header);
              window.scrollTo({ top: story.getBoundingClientRect().top + window.scrollY - header + travel * .7, behavior: 'smooth' });
            }}><span className="letter-cue-unfold">Scroll to unfold</span><span className="letter-cue-continue">Continue exploring</span><ArrowDown size={15} aria-hidden="true" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

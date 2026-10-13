import { ArrowDown, ArrowUpRight } from 'lucide-react';
import EnvelopeArtwork from './EnvelopeArtwork';
import './letter-story.css';

export default function LetterStory({ onLaunch }: { onLaunch: () => void }) {

  return (
    <section className="letter-story" aria-labelledby="hero-title" data-phase="sealed">
      <div className="letter-stage">
        <div className="letter-stage-inner wrap">
          <div className="letter-copy">
            <span className="eyebrow">A PRIVATE PLACE FOR OPEN INTELLIGENCE</span>
            <h1 id="hero-title">Think freely.<br /><em>Keep it yours.</em></h1>
            <p>A space for the questions, drafts and ideas<br className="desktop-break" /> you keep to yourself.</p>
            <div className="letter-actions">
              <button className="button button--primary" onClick={onLaunch}>Open your studio <ArrowUpRight size={17} /></button>
              <a href="#/docs/overview">A look inside <ArrowUpRight size={14} /></a>
            </div>
            <div className="letter-scroll-cue"><span className="scroll-line" /><ArrowDown size={13} /><span>Scroll to unfold</span></div>
          </div>

          <div className="mail-anchor"><EnvelopeArtwork className="mail-static-fallback" /></div>
          <div className="letter-stage-footer"><span>FOR YOUR EYES. FOR YOUR MIND.</span><span className="letter-progress"><i /></span><a href="#privacy">The thinking behind VEIL <ArrowDown size={13} /></a></div>
        </div>
      </div>
    </section>
  );
}

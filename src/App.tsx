import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, Menu, X, Plus, Minus, Feather, Search, Compass } from 'lucide-react';
import Terminal from './components/Terminal';
import { WalletButton } from './components/Wallet';
import { DocsPage, PricingPage } from './components/Docs';
import { usePageMotion } from './hooks/usePageMotion';
import { Brand, VeilSymbol } from './components/Brand';
import LetterStory from './components/LetterStory';
import CorrespondenceJourney from './components/CorrespondenceJourney';
import JourneyAnchor from './components/JourneyAnchor';
import SectionArtwork from './components/SectionArtwork';
import StudioShowcase from './components/StudioShowcase';

function readRoute() {
  if (['#/terminal', '#/studio'].includes(location.hash)) return 'studio';
  if (location.hash.startsWith('#/docs')) return 'docs';
  if (location.hash === '#/pricing') return 'pricing';
  return 'home';
}

const startingPoints = [
  { id: 'make', category: 'For the makers', title: 'Make something.', emphasis: 'Make it yours.', description: 'An unexpected idea. A first sentence. Something that doesn’t exist yet.', prompt: 'Help me explore an idea I want to bring to life. Ask thoughtful questions and help me find an original starting point.', icon: Feather, label: 'Start a creative thought', note: 'A possibility, not a prescription.' },
  { id: 'explore', category: 'For the curious', title: 'Follow a thread.', emphasis: 'See where it goes.', description: 'A question that opens another. A connection you hadn’t considered.', prompt: 'I want to understand a new topic from the ground up. Help me follow the interesting questions and connect the different perspectives.', icon: Search, label: 'Start a research thought', note: 'Leave a little room for surprise.' },
  { id: 'consider', category: 'For the thoughtful', title: 'Think it through.', emphasis: 'From another angle.', description: 'A complicated decision. A different perspective. A clearer next step.', prompt: 'Help me think through a complex decision. Separate what I know from what I am assuming and explore the possible approaches.', icon: Compass, label: 'Start an analytical thought', note: 'Sometimes a second look is everything.' },
];
const questions = [
  { question: 'What kind of space is VEIL?', answer: 'A personal studio for open intelligence. Bring a question, work through an idea, or simply follow your curiosity. The conversation begins with you.' },
  { question: 'Which model should I start with?', answer: 'Core is your everyday companion for writing, making, and exploring. Reason is the considered choice for questions with more layers. You can change your model in the studio.' },
  { question: 'Can I make the studio my own?', answer: 'Choose your model, adjust the conversation preferences, and decide whether to keep new conversations in your current session. Start with a suggestion or begin on a blank page.' },
  { question: 'Do I need a fully formed question?', answer: 'An unfinished sentence is enough. Start with what is on your mind and give yourself room to see where it leads.' },
];

function App() {
  const [route, setRoute] = useState(readRoute);
  const [docSlug, setDocSlug] = useState(() => location.hash.split('/')[2] || 'overview');
  const [initialPrompt, setInitialPrompt] = useState('');
  const [initialModel, setInitialModel] = useState<'core' | 'reason'>('core');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onHash = () => { setRoute(readRoute()); setDocSlug(location.hash.split('/')[2] || 'overview'); setMobileMenu(false); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useLayoutEffect(() => {
    document.title = route === 'studio' ? 'Your studio — VEIL' : route === 'docs' ? 'Docs — VEIL' : route === 'pricing' ? 'Pricing — VEIL' : 'VEIL — A little space for yourself.';
    const anchor = route === 'home' && !location.hash.startsWith('#/') ? document.getElementById(location.hash.slice(1)) : null;
    if (anchor) anchor.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route, docSlug]);
  usePageMotion(`${route}/${docSlug}`);
  useEffect(() => {
    if (!mobileMenu) return;
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMobileMenu(false); menuRef.current?.focus(); } };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [mobileMenu]);
  function launch(prompt = '', model: 'core' | 'reason' = 'core') {
    setInitialPrompt(prompt); setInitialModel(model); location.hash = '/studio';
  }
  if (route === 'studio') return <Terminal onExit={() => { location.hash = '/'; }} initialPrompt={initialPrompt} initialModel={initialModel} />;

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={`site-header ${route === 'home' ? 'site-header--landing' : ''}`}><div className="header-inner"><Brand onClick={() => { location.hash = "/"; window.scrollTo({ top: 0, behavior: "instant" }); }}/>
      <nav className={`main-nav ${mobileMenu ? 'main-nav--open' : ''}`} aria-label="Main navigation" id="main-navigation"><a href="#privacy" onClick={() => setMobileMenu(false)}>The idea</a><a href="#models" onClick={() => setMobileMenu(false)}>Models</a><a href="#/docs/overview" aria-current={route === 'docs' ? 'page' : undefined} onClick={() => setMobileMenu(false)}>Docs</a><a href="#/pricing" aria-current={route === 'pricing' ? 'page' : undefined} onClick={() => setMobileMenu(false)}>Pricing</a><button className="mobile-studio-link" onClick={() => launch()}>Open studio <ArrowUpRight size={16}/></button></nav>
      <div className="header-actions"><WalletButton/><button className="header-studio" onClick={() => launch()}>Open studio <ArrowUpRight size={15}/></button><button className="menu-toggle" ref={menuRef} aria-label={mobileMenu ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileMenu} aria-controls="main-navigation" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X size={21}/> : <Menu size={21}/>}</button></div>
    </div></header>
    {route === 'docs' ? <DocsPage slug={docSlug} onLaunch={() => launch()}/> : route === 'pricing' ? <PricingPage onLaunch={() => launch()}/> : <main id="main" className="landing-main">
      <CorrespondenceJourney/><LetterStory onLaunch={() => launch()}/>
      <section className="privacy-section" id="privacy" aria-labelledby="privacy-title"><div className="wrap privacy-inner"><div className="privacy-heading"><span className="eyebrow">PERSONAL BY NATURE</span><h2 id="privacy-title">Not every thought<br/><em>needs an audience.</em></h2></div><div className="privacy-aside"><VeilSymbol className="privacy-fold"/><p>The question before the question. A first draft. An idea you’re not quite ready to explain.</p><p>VEIL makes room for that part of thinking. The part that’s just for you.</p></div><SectionArtwork name="privacy" src="/assets/privacy-paper-sanctuary-v01.webp"/><div className="privacy-foot"><span>Less performance. More possibility.</span><span>WITH ROOM TO BE YOURSELF.</span></div></div></section>
      <StudioShowcase onLaunch={launch}/>
      <section className="possibilities-section section wrap" id="possibilities" aria-labelledby="possibilities-title"><div className="section-heading"><div><span className="eyebrow">WHERE COULD THIS LEAD?</span><h2 id="possibilities-title">A blank page.<br/><em>Endless directions.</em></h2></div><p>You don’t need to have it figured out.<br/>Just bring a little curiosity.</p></div><div className="notebooks">{startingPoints.map(({id, category, title, emphasis, description, prompt, icon:Icon, label, note}, i) => <article className={`notebook notebook--${id}`} key={id}><div className="notebook-top"><span>{category}</span><Icon size={17} strokeWidth={1.5}/></div><div className="notebook-title"><span className="notebook-number" aria-hidden="true">0{i+1}</span><h3>{title}<br/><em>{emphasis}</em></h3></div><p>{description}</p><div className={`notebook-drawing notebook-drawing--${id}`} aria-hidden="true">{id === 'make' ? <svg viewBox="0 0 250 100" fill="none"><path d="M14 77c36-90 106-82 100-33-7 40-65 5-15-27 47-30 83 23 83 41 0 12-35 20-28-1 6-19 41-19 77 8m-10-9 11 9-13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> : id === 'explore' ? <svg viewBox="0 0 250 100" fill="none"><circle cx="93" cy="50" r="34" stroke="currentColor" strokeWidth="1.3"/><circle cx="134" cy="50" r="34" stroke="currentColor" strokeWidth="1.3"/><circle cx="175" cy="50" r="34" stroke="currentColor" strokeWidth="1.3"/></svg> : <svg viewBox="0 0 250 100" fill="none"><path d="m40 73 60-51 63 44 45-36M40 73l63 10 60-17 45-36M100 22l3 61" stroke="currentColor" strokeWidth="1.3"/><circle cx="40" cy="73" r="3" fill="currentColor"/><circle cx="100" cy="22" r="3" fill="currentColor"/><circle cx="103" cy="83" r="3" fill="currentColor"/><circle cx="163" cy="66" r="3" fill="currentColor"/><circle cx="208" cy="30" r="3" fill="currentColor"/></svg>}</div><span className="notebook-note">{note}</span><button aria-label={label} onClick={() => launch(prompt)}>Try this thought <ArrowUpRight size={17}/></button></article>)}</div><SectionArtwork name="possibilities" src="/assets/possibilities-paper-ribbon-v01.webp"/></section>
      <section className="breathing-room wrap" aria-label="A little breathing room"><span className="breathing-rule"/><div><span>A thought doesn’t have to be polished.</span><em>It just has to be yours.</em></div><span className="breathing-rule"/></section>
      <section className="models-section section wrap" id="models" aria-labelledby="models-title"><div className="section-heading"><div><span className="eyebrow">A GOOD PLACE TO BEGIN</span><h2 id="models-title">Your pace.<br/><em>Your perspective.</em></h2></div><p>Two ways into a conversation.<br/>Choose the one that feels like you.</p></div><div className="model-list"><article className="model-row"><div className="model-identity"><span className="model-name">VEIL CORE</span><h3>The first draft.</h3></div><div className="model-description"><span>QUICK, CURIOUS, EVERYDAY.</span><p>For making, writing, and following an interesting thought. A companion for the everyday questions.</p></div><button className="model-open" aria-label="Start with Core" onClick={() => launch('', 'core')}><ArrowUpRight size={24} strokeWidth={1.3}/></button></article><article className="model-row"><div className="model-identity"><span className="model-name">VEIL REASON</span><h3>The second look.</h3></div><div className="model-description"><span>PATIENT, CAREFUL, CONSIDERED.</span><p>For questions with layers. Take another angle, work through the details, and give the thought a little more time.</p></div><button className="model-open" aria-label="Start with Reason" onClick={() => launch('', 'reason')}><ArrowUpRight size={24} strokeWidth={1.3}/></button></article></div><SectionArtwork name="models" src="/assets/models-study-pair-v01.webp"/><div className="models-foot"><span>ONE PRIVATE STUDIO. YOUR OWN WAY OF THINKING.</span><button onClick={() => launch()}>Meet your studio <ArrowRight size={15}/></button></div></section>
      <section className="questions-section section wrap" id="questions" aria-labelledby="questions-title"><div className="questions-heading"><span className="eyebrow">A LITTLE CLARITY</span><h2 id="questions-title">Good <br/><em>questions.</em></h2><p>A few things you might<br/>be wondering about.</p></div><div className="questions-list">{questions.map(({question, answer}, i) => <div className={`question-item ${openQuestion === i ? 'question-item--open' : ''}`} key={question}><h3><button id={`question-${i}`} aria-controls={`answer-${i}`} aria-expanded={openQuestion === i} onClick={() => setOpenQuestion(openQuestion === i ? null : i)}><span>{question}</span><span className="question-icon">{openQuestion === i ? <Minus size={17}/> : <Plus size={17}/>}</span></button></h3><div className="question-answer" id={`answer-${i}`} role="region" aria-labelledby={`question-${i}`} hidden={openQuestion !== i}><p>{answer}</p></div></div>)}</div></section>
      <section className="closing-section" aria-labelledby="closing-title"><div className="wrap closing-inner"><div className="closing-fold" aria-hidden="true"/><JourneyAnchor name="closing" scale={0.76} mobileScale={0.95} letter={0} rotation={8}/><span className="eyebrow">FOR YOUR EYES. FOR YOUR MIND.</span><h2 id="closing-title">Keep something<br/><em>just for you.</em></h2><button className="button button--paper" onClick={() => launch()}>Open your private studio <ArrowUpRight size={18}/></button><span className="closing-signature">Personally yours,<span>veil</span></span></div></section>
    </main>}
    <footer className="site-footer wrap"><Brand onClick={() => { location.hash = "/"; window.scrollTo({ top: 0, behavior: "instant" }); }}/><span className="footer-message">A little space for yourself.</span><nav aria-label="Footer navigation"><a href="#privacy">The idea</a><a href="#/docs/overview">Docs</a><a href="#/pricing">Pricing</a><a href="#questions">Questions</a></nav><span className="footer-year">© {new Date().getFullYear()} VEIL</span></footer>
  </>;
}
export default App;

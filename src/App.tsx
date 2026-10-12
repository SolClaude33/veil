import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, LockKeyhole, Layers3, Braces, ScanLine, Check, Menu, X, Plus, Minus, Terminal as TerminalIcon, Fingerprint, ShieldCheck } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import Terminal from './components/Terminal';

const workflows = [
  { id: 'build', name: 'Build', icon: Braces, label: 'ENGINEERING', prompt: 'Review this architecture. Challenge the assumptions, trace the dependencies, and find a simpler way forward.', context: 'Architecture & systems', direction: 'Question the implementation', deliverable: 'A clearer path to build', code: ['map_dependencies(system)', 'challenge(assumptions)', 'simplify(complexity)'], },
  { id: 'research', name: 'Research', icon: ScanLine, label: 'EXPLORATION', prompt: 'Explore this idea from first principles. Connect the perspectives, identify what is missing, and help me ask better questions.', context: 'Ideas & investigation', direction: 'Look beyond the obvious', deliverable: 'A new perspective', code: ['explore(first_principles)', 'connect(perspectives)', 'surface(unknowns)'], },
  { id: 'analyze', name: 'Analyze', icon: Layers3, label: 'REASONING', prompt: 'Break this problem into its essential parts. Separate the evidence from the assumptions and weigh the possible approaches.', context: 'Decisions & complexity', direction: 'Follow the evidence', deliverable: 'Reasoned possibilities', code: ['separate(evidence, assumptions)', 'evaluate(possibilities)', 'trace(reasoning)'], },
];

function Brand({ onClick }: { onClick?: () => void }) {
  return <a className="brand" href="#/" aria-label="VEIL home" onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); onClick?.(); }}><span className="brand-mark" aria-hidden="true">[v<span>_</span>]</span><span>veil<span className="brand-period">.</span></span></a>;
}

function IdentityGlyph({ compact = false }: { compact?: boolean }) {
  return <svg className={`identity-glyph ${compact ? 'identity-glyph--compact' : ''}`} viewBox="0 0 440 450" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id={compact ? 'line-small' : 'line-hero'} x1="75" y1="40" x2="360" y2="400" gradientUnits="userSpaceOnUse"><stop stopColor="#bbef75" stopOpacity=".9"/><stop offset=".45" stopColor="#658049" stopOpacity=".55"/><stop offset="1" stopColor="#2a3424" stopOpacity=".12"/></linearGradient>
      <radialGradient id={compact ? 'glow-small' : 'glow-hero'}><stop stopColor="#aadd62" stopOpacity=".08"/><stop offset="1" stopColor="#aadd62" stopOpacity="0"/></radialGradient>
    </defs>
    <circle cx="220" cy="225" r="208" fill={`url(#${compact ? 'glow-small' : 'glow-hero'})`}/>
    <g stroke={`url(#${compact ? 'line-small' : 'line-hero'})`} strokeWidth="1.25" strokeLinecap="round">
      {Array.from({ length: 16 }, (_, i) => {
        const r = 166 - i * 9;
        const l = 220 - r;
        const right = 220 + r;
        const startY = 225 + (i % 3) * 12;
        return <path key={i} d={`M ${l} ${365 - i * 3} V ${startY} C ${l} ${startY-r*1.4} ${right} ${startY-r*1.4} ${right} ${startY} V ${270 + i * 4} C ${right} ${310+i*5} ${right+16} ${340+i*4} ${right+36} ${365+i*3}`} />;
      })}
      {Array.from({ length: 9 }, (_, i) => <path key={`tail-${i}`} d={`M ${158+i*8} ${268+i*4} C ${155+i*8} ${330+i*4} ${170+i*10} 385 ${200+i*11} 414`} />)}
    </g>
    <circle cx="220" cy="225" r="200" stroke="#3e4a34" strokeOpacity=".35" strokeDasharray="2 7"/>
    <path d="M40 65V40h25M375 40h25v25M400 385v25h-25M65 410H40v-25" stroke="#536344" strokeWidth="1.5"/>
    <path d="M220 20v15M220 415v15M15 225h15M410 225h15" stroke="#536344"/>
    <path className="glyph-scan" d="M42 223h356" stroke="#bbef75" strokeOpacity=".27"/>
    <rect x="168" y="213" width="104" height="25" fill="#0b0e0b"/>
    <text x="220" y="229" textAnchor="middle" fill="#bbef75" fontSize="8" fontFamily="IBM Plex Mono, monospace" letterSpacing="2">IDENTITY WITHHELD</text>
    <circle cx="54" cy="95" r="3" fill="#bbef75"/><circle cx="380" cy="315" r="2" fill="#bbef75" fillOpacity=".5"/>
  </svg>;
}

function App() {
  const [route, setRoute] = useState(() => location.hash === '#/terminal' ? 'terminal' : 'home');
  const [initialPrompt, setInitialPrompt] = useState('');
  const [initialModel, setInitialModel] = useState<'core' | 'reason'>('core');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuRef = useRef<HTMLButtonElement>(null);
  const workflow = workflows[activeWorkflow];

  useEffect(() => {
    const onHash = () => { setRoute(location.hash === '#/terminal' ? 'terminal' : 'home'); setMobileMenu(false); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    document.title = route === 'terminal' ? 'Terminal — VEIL' : 'VEIL — Intelligence, off the record.';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route]);
  useEffect(() => {
    if (!mobileMenu) return;
    const close = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') { setMobileMenu(false); menuRef.current?.focus(); } };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [mobileMenu]);

  function launch(prompt = '', model: 'core' | 'reason' = 'core') { setInitialPrompt(prompt); setInitialModel(model); location.hash = '/terminal'; }
  function selectTab(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (e.key === 'ArrowRight') next = (index + 1) % workflows.length;
    else if (e.key === 'ArrowLeft') next = (index - 1 + workflows.length) % workflows.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = workflows.length - 1;
    else return;
    e.preventDefault(); setActiveWorkflow(next); tabRefs.current[next]?.focus();
  }

  if (route === 'terminal') return <Terminal onExit={() => { location.hash = '/'; }} initialPrompt={initialPrompt} initialModel={initialModel} />;

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav className={`main-nav ${mobileMenu ? 'main-nav--open' : ''}`} aria-label="Main navigation" id="main-navigation">
          <a href="#models" onClick={() => setMobileMenu(false)}>Models</a>
          <a href="#protocol" onClick={() => setMobileMenu(false)}>The protocol</a>
          <a href="#privacy" onClick={() => setMobileMenu(false)}>Privacy</a>
          <button className="nav-mobile-launch" onClick={() => launch()}>Enter terminal <ArrowUpRight size={16} /></button>
        </nav>
        <div className="header-actions"><span className="header-note mono"><span className="status-dot" /> INDEPENDENT BY DESIGN</span><button className="button button--small button--outline header-launch" onClick={() => launch()}>Enter terminal <ArrowUpRight size={15}/></button><button className="menu-toggle icon-button" ref={menuRef} aria-label={mobileMenu ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileMenu} aria-controls="main-navigation" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X /> : <Menu />}</button></div>
      </div>
    </header>
    <main id="main">
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow"><span className="status-dot" /> OPEN INTELLIGENCE <span className="eyebrow-divider">/</span> PRIVATE BY DESIGN</div>
          <h1 id="hero-title">Intelligence.<br/><span>Off the record.</span><span className="hero-caret" aria-hidden="true">_</span></h1>
          <p className="hero-description">An open mind deserves an open model.<br className="desktop-break"/> Think freely. Explore deeply. Keep your own counsel.</p>
          <div className="hero-buttons"><button className="button button--primary" onClick={() => launch()}>Enter the terminal <ArrowUpRight size={19}/></button><a className="text-link" href="#models">Find your model <ArrowDown size={17}/></a></div>
          <div className="hero-footnote mono"><LockKeyhole size={13}/><span>YOUR THOUGHTS. YOUR TERMS.</span></div>
        </div>
        <figure className="identity-art" aria-label="A fingerprint fading into the dark, representing an undisclosed identity">
          <div className="art-topline mono"><span>FIG. 001 / THE INVISIBLE SELF</span><span className="art-cross">+</span></div>
          <IdentityGlyph />
          <figcaption className="art-caption mono"><span>LESS TO REVEAL.</span><span>[ ID : UNDISCLOSED ]</span></figcaption>
        </figure>
        <div className="hero-bottom mono"><span>THINK OUTSIDE THE FEED.</span><a href="#workflows" aria-label="Explore workflows">SCROLL TO EXPLORE <ArrowDown size={13}/></a></div>
      </section>
      <div className="principles-strip"><div className="wrap principles-inner">{[{ icon: Layers3, text: 'OPEN MODELS' }, { icon: LockKeyhole, text: 'PRIVATE WORKSPACE' }, { icon: Fingerprint, text: 'YOUR OWN PERSPECTIVE' }, { icon: TerminalIcon, text: 'ZERO NOISE' }].map(({ icon: Icon, text }, i) => <div className="principle" key={text}><span className="mono principle-number">0{i+1}</span><Icon size={17} strokeWidth={1.5}/><span className="mono">{text}</span></div>)}</div></div>

      <section className="workflows-section wrap section" id="workflows" aria-labelledby="workflows-title">
        <div className="section-heading"><div><div className="eyebrow">01 / ROOM TO THINK</div><h2 id="workflows-title">Good questions.<br/><span className="muted-heading">Unrestricted thinking.</span></h2></div><p>The next idea starts where the obvious answer ends. Bring a problem. Follow the possibilities.</p></div>
        <div className="workflow-window">
          <div className="window-topbar"><div className="window-controls" aria-hidden="true"><span/><span/><span/></div><span className="mono">VEIL / WORKSPACE</span><span className="mono window-topbar-end"><span className="status-dot"/> YOUR PERSPECTIVE</span></div>
          <div className="workflow-tabs" role="tablist" aria-label="Ways to work">{workflows.map(({ id, name, icon: Icon }, i) => <button id={`workflow-tab-${id}`} ref={el => { tabRefs.current[i] = el; }} role="tab" aria-selected={activeWorkflow === i} aria-controls="workflow-panel" tabIndex={activeWorkflow === i ? 0 : -1} key={id} className={activeWorkflow === i ? 'active' : ''} onClick={() => setActiveWorkflow(i)} onKeyDown={e => selectTab(e, i)}><Icon size={16}/>{name}<ArrowUpRight size={13}/></button>)}<span className="workflow-tabs-label mono">CHOOSE A STARTING POINT</span></div>
          <div className="workflow-body" id="workflow-panel" role="tabpanel" aria-labelledby={`workflow-tab-${workflow.id}`} tabIndex={0}>
            <div className="workflow-question"><div className="mono panel-label"><span className="status-dot"/> {workflow.label}<span>01</span></div><h3>Start with<br/>a better question.</h3><p>“{workflow.prompt}”</p><button className="text-link text-link--lime" onClick={() => launch(workflow.prompt)}>Take it to the terminal <ArrowUpRight size={16}/></button></div>
            <div className="workflow-direction"><div className="mono panel-label">SET THE DIRECTION<span>02</span></div><div className="workflow-code mono"><span className="code-comment">// a little less ordinary.</span>{workflow.code.map((line, i) => <div key={line}><span className="line-number">0{i+1}</span><span><span className="code-lime">{line.split('(')[0]}</span>({line.split('(')[1]}</span><span className="code-tick"><Check size={13}/></span></div>)}<div className="code-end"><span className="code-caret">▌</span></div></div><div className="direction-grid"><div><span className="mono">CONTEXT</span><p>{workflow.context}</p></div><div><span className="mono">INTENT</span><p>{workflow.direction}</p></div><div><span className="mono">FOCUS</span><p>{workflow.deliverable}</p></div></div></div>
          </div>
          <div className="window-footer mono"><span><LockKeyhole size={12}/> A CLEARER SPACE TO WORK</span><span>LESS FRICTION. MORE POSSIBILITY.</span></div>
        </div>
      </section>

      <section className="protocol-section" id="protocol" aria-labelledby="protocol-title"><div className="wrap section">
        <div className="section-heading"><div><div className="eyebrow">02 / A DIFFERENT PATH</div><h2 id="protocol-title">Your mind isn't<br/><span className="muted-heading">a data point.</span></h2></div><div className="protocol-intro"><p>A place to explore an unfinished thought, challenge a familiar idea, or find a direction of your own.</p><p>Less between you and the model. More room between the lines.</p></div></div>
        <div className="protocol-map"><div className="protocol-line" aria-hidden="true"/><div className="protocol-node"><div className="node-icon"><Fingerprint size={29} strokeWidth={1.25}/></div><span className="eyebrow">01 / YOU</span><h3>A question worth asking.</h3><p>Your curiosity is the starting point.</p></div><div className="protocol-connector mono" aria-hidden="true">→</div><div className="protocol-node protocol-node--active"><div className="node-icon"><span className="node-brand">[v_]</span></div><span className="eyebrow">02 / YOUR WORKSPACE</span><h3>A space without the noise.</h3><p>One model. One conversation. Your focus.</p></div><div className="protocol-connector mono" aria-hidden="true">→</div><div className="protocol-node"><div className="node-icon"><Layers3 size={29} strokeWidth={1.25}/></div><span className="eyebrow">03 / YOUR PERSPECTIVE</span><h3>Something to think on.</h3><p>Go deeper. See differently. Make it yours.</p></div></div>
        <div className="protocol-bottom mono"><span><ShieldCheck size={15}/> INDEPENDENCE IS THE POINT.</span><a href="#privacy">EXPLORE THE PHILOSOPHY <ArrowUpRight size={14}/></a></div>
      </div></section>

      <section className="models-section wrap section" id="models" aria-labelledby="models-title">
        <div className="section-heading"><div><div className="eyebrow">03 / THE MODELS</div><h2 id="models-title">Choose your<br/><span className="muted-heading">way of thinking.</span></h2></div><p>A fast first thought or a deeper second look. Start with the model that fits your question.</p></div>
        <div className="models-grid">
          <article className="model-card"><div className="model-card-top"><span className="eyebrow">THE EVERYDAY EXPLORER</span><span className="model-index mono">M / 01</span></div><div className="model-title"><h3>VEIL Core</h3><div className="model-symbol model-symbol--core" aria-hidden="true"><span/><span/><span/></div></div><p>A clear starting point for writing, building, and exploring the next idea.</p><div className="model-tags mono"><span>VERSATILE</span><span>DIRECT</span><span>OPEN-ENDED</span></div><ul><li><Check size={15}/> Everyday questions and ideas</li><li><Check size={15}/> Code, drafts, and creative work</li><li><Check size={15}/> A fluid conversational pace</li></ul><button className="model-button" onClick={() => launch()}>Start with Core <ArrowUpRight size={18}/></button></article>
          <article className="model-card model-card--reason"><div className="model-card-top"><span className="eyebrow">THE DEEPER THINKER</span><span className="model-index mono">M / 02</span></div><div className="model-title"><h3>VEIL Reason</h3><div className="model-symbol model-symbol--reason" aria-hidden="true"><span/><span/><span/></div></div><p>More room for complex questions, careful analysis, and the unexpected connection.</p><div className="model-tags mono"><span>DELIBERATE</span><span>ANALYTICAL</span><span>EXPLORATORY</span></div><ul><li><Check size={15}/> Problems with moving parts</li><li><Check size={15}/> Research and layered analysis</li><li><Check size={15}/> Reasoning from first principles</li></ul><button className="model-button" onClick={() => launch('', 'reason')}>Start with Reason <ArrowUpRight size={18}/></button></article>
        </div>
      </section>

      <section className="privacy-section wrap section" id="privacy" aria-labelledby="privacy-title">
        <div className="privacy-art"><div className="eyebrow">THE RIGHT TO A QUIET MIND.</div><IdentityGlyph compact/><span className="mono privacy-art-footer">[ KEEP A LITTLE TO YOURSELF. ]</span></div>
        <div className="privacy-copy"><div className="eyebrow">04 / THE PHILOSOPHY</div><h2 id="privacy-title">Some things<br/>are just <span>yours.</span></h2><p>Not every question needs an audience.<br/>Not every idea needs a paper trail.</p><p>VEIL is built around a simple belief: the space between a thought and an answer should belong to you.</p><a className="text-link text-link--lime" href="#questions">A few things, in plain text <ArrowDown size={16}/></a></div>
      </section>

      <section className="questions-section wrap section" id="questions" aria-labelledby="questions-title"><div><div className="eyebrow">BEFORE YOU BEGIN</div><h2 id="questions-title">In plain text.</h2></div><div className="questions-list">{[
        { q: 'What is VEIL?', a: 'A focused workspace for open intelligence. Choose a model, bring a question, and explore a perspective of your own.' },
        { q: 'Which model should I choose?', a: 'Core is a starting point for everyday writing, coding, and exploration. Reason is the deeper-thinking option for complex questions and layered analysis.' },
        { q: 'Can I shape the conversation?', a: 'Start from a blank page or use a starting point. In the terminal, choose your model and adjust the conversation preferences to suit the way you think.' },
        { q: 'Where do I start?', a: 'Enter the terminal, pick a model, and write your first question. The best starting point is the one already on your mind.' },
      ].map(({ q, a }, i) => <div className={`question-item ${openQuestion === i ? 'question-item--open' : ''}`} key={q}><h3><button aria-expanded={openQuestion === i} aria-controls={`answer-${i}`} id={`question-${i}`} onClick={() => setOpenQuestion(openQuestion === i ? null : i)}><span className="mono question-index">0{i+1}</span><span>{q}</span>{openQuestion === i ? <Minus size={18}/> : <Plus size={18}/>}</button></h3><div className="question-answer" id={`answer-${i}`} role="region" aria-labelledby={`question-${i}`} hidden={openQuestion !== i}><p>{a}</p></div></div>)}</div></section>

      <section className="closing-section"><div className="wrap closing-inner"><div className="eyebrow"><span className="status-dot"/> AN OPEN MIND. A PRIVATE SPACE.</div><h2>Stay curious.<br/><span>Leave less behind.</span><span className="closing-caret" aria-hidden="true">_</span></h2><button className="button button--primary" onClick={() => launch()}>Enter the terminal <ArrowUpRight size={19}/></button><div className="closing-coordinate mono" aria-hidden="true">[ END OF TRANSMISSION ]<br/>BEGIN YOUR OWN.</div></div></section>
    </main>
    <footer className="site-footer wrap"><Brand/><span className="mono">INDEPENDENT INTELLIGENCE.</span><div><a href="#models">Models</a><a href="#privacy">Privacy</a><button onClick={() => launch()}>Terminal <ArrowUpRight size={13}/></button></div><span className="footer-year mono">© {new Date().getFullYear()} VEIL</span></footer>
  </>;
}

export default App;

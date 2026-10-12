import { useEffect, useMemo, useRef, useState, type ReactElement, type ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Menu,
  Search,
  X,
} from 'lucide-react';
import {
  estimateUsageCost,
  getModelPricing,
  VEIL_MODEL_PRICING,
  type VeilModelId,
} from '../content/pricing';
import './docs.css';

type DocsPageProps = {
  slug: string;
  onLaunch: () => void;
};

type PricingPageProps = {
  onLaunch: () => void;
};

type Topic = {
  slug: string;
  label: string;
  summary: string;
  keywords: string;
  content: () => ReactElement;
};

function TopicLead({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <header className="docs-lead" data-reveal>
      <span className="docs-eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{intro}</p>
    </header>
  );
}

function Steps({ children }: { children: ReactNode }) {
  return <ol className="docs-steps">{children}</ol>;
}

const topics: Topic[] = [
  {
    slug: 'overview',
    label: 'Overview',
    summary: 'What VEIL is and how the studio is organized.',
    keywords: 'introduction studio conversation private overview',
    content: () => (
      <>
        <TopicLead
          eyebrow="A quiet place to begin"
          title="Your studio, at a glance."
          intro="VEIL is a focused writing and thinking space. Choose a model, bring a question or an unfinished idea, and shape the conversation at your own pace."
        />
        <figure className="docs-editorial-image" data-reveal>
          <img
            src="/assets/studio-still-life-v01.webp"
            width="1536"
            height="1024"
            loading="lazy"
            alt="An open notebook beside loose paper and a blue pen on a quiet writing desk"
          />
        </figure>
        <section className="docs-section" aria-labelledby="overview-workspace" data-reveal>
          <h2 id="overview-workspace">One workspace, a few deliberate choices</h2>
          <p>
            The studio keeps the essential controls close: a model selector, a conversation area,
            a composer, session history, and settings. Starting-point prompts can place an idea in
            the composer; you remain in control of when it is sent.
          </p>
          <div className="docs-note-grid">
            <article><span>01</span><h3>Choose a pace</h3><p>Use Core for everyday work or Reason when a question benefits from a more careful pass.</p></article>
            <article><span>02</span><h3>Write naturally</h3><p>Begin with a sentence, a full brief, or a question. The composer is the working page.</p></article>
            <article><span>03</span><h3>Keep the thread</h3><p>Move between conversations created during the current session, or start a clean page.</p></article>
          </div>
        </section>
        <section className="docs-section docs-section--ruled" aria-labelledby="overview-shape" data-reveal>
          <h2 id="overview-shape">The shape of a conversation</h2>
          <p>
            A useful opening gives the model a subject, the kind of help you want, and any limits
            that matter. You can refine the request over several messages instead of fitting
            everything into the first one.
          </p>
          <blockquote>“Help me compare these two directions. Ask about the tradeoffs I may be missing.”</blockquote>
        </section>
      </>
    ),
  },
  {
    slug: 'getting-started',
    label: 'Getting started',
    summary: 'From wallet selection to your first conversation.',
    keywords: 'start wallet model core reason compose settings sessions prompt',
    content: () => (
      <>
        <TopicLead
          eyebrow="First conversation"
          title="Begin with what you have."
          intro="You do not need a polished prompt. Make the few choices that shape the workspace, then start with the thought already on your mind."
        />
        <section className="docs-section" aria-labelledby="started-steps" data-reveal>
          <h2 id="started-steps">Open the studio</h2>
          <Steps>
            <li><div><strong>Select a wallet.</strong><p>Choose MetaMask, Rabby, or WalletConnect, then confirm it as your selected preference.</p></div></li>
            <li><div><strong>Choose Core or Reason.</strong><p>Core suits quick everyday work. Reason suits layered questions and more considered analysis.</p></div></li>
            <li><div><strong>Compose your thought.</strong><p>Type in the composer, or use a starting point and edit it until the request sounds like yours.</p></div></li>
            <li><div><strong>Adjust the workspace.</strong><p>Open settings to change available conversation preferences. Start a new conversation whenever you want a clean page.</p></div></li>
          </Steps>
        </section>
        <section className="docs-section docs-section--ruled" aria-labelledby="started-session" data-reveal>
          <h2 id="started-session">About the current session</h2>
          <p>
            Conversation history belongs to the current Studio session. You can revisit the threads
            listed there while you work. Leaving the Studio resets that in-memory history, so keep
            anything important in your own notes.
          </p>
        </section>
        <section className="docs-section docs-section--ruled" aria-labelledby="started-controls" data-reveal>
          <h2 id="started-controls">Controls and shortcuts</h2>
          <div className="docs-control-list">
            <div><strong>Enter</strong><span>Add the message in the composer.</span></div>
            <div><strong>Shift + Enter</strong><span>Add a new line without submitting.</span></div>
            <div><strong>Escape</strong><span>Close the settings panel or conversation drawer.</span></div>
            <div><strong>New conversation</strong><span>Begin a blank thread in the current session.</span></div>
          </div>
        </section>
      </>
    ),
  },
  {
    slug: 'models',
    label: 'Models',
    summary: 'Choose between Core and Reason.',
    keywords: 'models core reason context output everyday careful',
    content: () => (
      <>
        <TopicLead
          eyebrow="Two ways of thinking"
          title="Choose the pace that fits."
          intro="The model selector changes how you approach the work. You can choose again when you begin a new conversation."
        />
        <section className="docs-section" aria-labelledby="models-compare" data-reveal>
          <h2 id="models-compare">Core and Reason</h2>
          <div className="docs-models">
            {VEIL_MODEL_PRICING.map((model) => (
              <article key={model.id}>
                <span className="docs-model-tag">{model.name}</span>
                <h3>{model.id === 'core' ? 'The first draft.' : 'The second look.'}</h3>
                <p>{model.id === 'core' ? 'A natural choice for drafting, exploring, summarizing, and everyday questions.' : 'A considered choice for comparisons, difficult decisions, and questions with several layers.'}</p>
                <dl><div><dt>Context</dt><dd>{model.contextTokens.toLocaleString('en-US')} tokens</dd></div><div><dt>Maximum output</dt><dd>{model.maxOutputTokens.toLocaleString('en-US')} tokens</dd></div></dl>
              </article>
            ))}
          </div>
        </section>
        <section className="docs-section docs-section--ruled" aria-labelledby="models-choice" data-reveal>
          <h2 id="models-choice">A practical rule</h2>
          <p>Start with Core when speed and iteration matter. Choose Reason when you want the model to spend more of the response working through structure, tradeoffs, or ambiguity.</p>
          <p>Previous messages count toward the available context, and longer conversations therefore use more input tokens.</p>
        </section>
      </>
    ),
  },
  {
    slug: 'credits',
    label: 'Credits & usage',
    summary: 'Understand token-based usage and cost.',
    keywords: 'credits price pricing cost tokens input output usd formula',
    content: () => (
      <>
        <TopicLead
          eyebrow="Pay for what you use"
          title="Credits, without guesswork."
          intro="VEIL prices model usage in US dollars per one million tokens. Input and output have separate rates."
        />
        <section className="docs-section" aria-labelledby="credits-counted" data-reveal>
          <h2 id="credits-counted">What is counted</h2>
          <p><strong>Input tokens</strong> include your current message and the previous conversation sent with it. <strong>Output tokens</strong> include the model’s response and any reasoning tokens used to produce it.</p>
          <div className="docs-formula" aria-label="Cost formula">
            <span>cost</span>
            <strong>=</strong>
            <code>(input tokens × input rate + output tokens × output rate) ÷ 1,000,000</code>
          </div>
          <p>Credits represent a USD balance for usage. There is no subscription tier in this pricing model.</p>
        </section>
        <section className="docs-section docs-section--ruled" aria-labelledby="credits-estimate" data-reveal>
          <h2 id="credits-estimate">Estimate before you begin</h2>
          <p>Use the calculator on the <a className="docs-inline-link" href="#/pricing">pricing page</a> to compare Core and Reason with your own input and output token counts.</p>
        </section>
      </>
    ),
  },
  {
    slug: 'privacy',
    label: 'Privacy & sessions',
    summary: 'Understand the boundaries of the current workspace.',
    keywords: 'privacy history session reset memory identity account',
    content: () => (
      <>
        <TopicLead
          eyebrow="Personal by design"
          title="Know what the interface keeps."
          intro="VEIL keeps your conversation history during the current Studio session. Leaving the Studio clears that session history."
        />
        <section className="docs-section" aria-labelledby="privacy-history" data-reveal>
          <h2 id="privacy-history">Conversation history</h2>
          <p>
            New conversations appear in your Studio history while the current session is open.
            Leaving the Studio clears them, so move anything important into your own notes before
            you go.
          </p>
        </section>
        <section className="docs-section docs-section--ruled" aria-labelledby="privacy-practice" data-reveal>
          <h2 id="privacy-practice">A useful working habit</h2>
          <p>Move final drafts, research notes, and decisions into the place where you normally keep important work before you leave the Studio.</p>
        </section>
      </>
    ),
  },
  {
    slug: 'wallet',
    label: 'Wallet',
    summary: 'How wallet selection appears in VEIL.',
    keywords: 'wallet select connect visual identity verification payment',
    content: () => (
      <>
        <TopicLead
          eyebrow="Your wallet preference"
          title="Choose the wallet you prefer."
          intro="Select MetaMask, Rabby, or WalletConnect and confirm the choice you want reflected in VEIL."
        />
        <section className="docs-section" aria-labelledby="wallet-meaning" data-reveal>
          <h2 id="wallet-meaning">A choice you can change</h2>
          <p>
            Your selected wallet preference is separate from your Studio session history. You can
            change the preference or clear it whenever you like.
          </p>
        </section>
        <section className="docs-section docs-section--ruled" aria-labelledby="wallet-steps" data-reveal>
          <h2 id="wallet-steps">Using the wallet view</h2>
          <Steps>
            <li><div><strong>Use this wallet.</strong><p>Choose MetaMask, Rabby, or WalletConnect and confirm your preference.</p></div></li>
            <li><div><strong>Change.</strong><p>Return to the wallet choices whenever you prefer another option.</p></div></li>
            <li><div><strong>Disconnect.</strong><p>Clear the selected wallet preference when you no longer want one shown.</p></div></li>
          </Steps>
        </section>
      </>
    ),
  },
];

export function DocsPage({ slug, onLaunch }: DocsPageProps) {
  const [query, setQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const topicIndex = Math.max(0, topics.findIndex((topic) => topic.slug === slug));
  const topic = topics[topicIndex];
  const filteredTopics = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return topics;
    return topics.filter((item) => `${item.label} ${item.summary} ${item.keywords}`.toLowerCase().includes(needle));
  }, [query]);

  useEffect(() => {
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  useEffect(() => {
    if (!drawerOpen) return;
    const drawer = drawerRef.current;
    const article = articleRef.current;
    const toggle = drawerButtonRef.current;
    const pageChrome = Array.from(document.querySelectorAll<HTMLElement>('.site-header, .site-footer'));
    const previousOverflow = document.body.style.overflow;
    article?.setAttribute('inert', '');
    toggle?.setAttribute('inert', '');
    pageChrome.forEach((element) => element.setAttribute('inert', ''));
    document.body.style.overflow = 'hidden';
    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableItems = () => Array.from(drawer?.querySelectorAll<HTMLElement>(focusableSelector) ?? []);
    requestAnimationFrame(() => focusableItems()[0]?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        article?.removeAttribute('inert');
        toggle?.removeAttribute('inert');
        pageChrome.forEach((element) => element.removeAttribute('inert'));
        setDrawerOpen(false);
        requestAnimationFrame(() => toggle?.focus());
        return;
      }
      if (event.key === 'Tab') {
        const items = focusableItems();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const desktopQuery = window.matchMedia('(min-width: 701px)');
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      article?.removeAttribute('inert');
      toggle?.removeAttribute('inert');
      pageChrome.forEach((element) => element.removeAttribute('inert'));
      setDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    desktopQuery.addEventListener('change', closeAtDesktop);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      desktopQuery.removeEventListener('change', closeAtDesktop);
      article?.removeAttribute('inert');
      toggle?.removeAttribute('inert');
      pageChrome.forEach((element) => element.removeAttribute('inert'));
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  const closeDrawer = () => {
    if (!drawerOpen) return;
    articleRef.current?.removeAttribute('inert');
    drawerButtonRef.current?.removeAttribute('inert');
    document.querySelectorAll<HTMLElement>('.site-header, .site-footer').forEach((element) => element.removeAttribute('inert'));
    setDrawerOpen(false);
    requestAnimationFrame(() => drawerButtonRef.current?.focus());
  };

  return (
    <main id="main" className="docs-page">
      <div className="docs-shell">
        <button
          ref={drawerButtonRef}
          className="docs-drawer-toggle"
          type="button"
          aria-expanded={drawerOpen}
          aria-controls="docs-navigation"
          onClick={() => setDrawerOpen((open) => !open)}
        >
          {drawerOpen ? <X size={17} /> : <Menu size={17} />}
          {drawerOpen ? 'Close contents' : 'Browse contents'}
        </button>
        <aside ref={drawerRef} id="docs-navigation" className={`docs-sidebar ${drawerOpen ? 'docs-sidebar--open' : ''}`} aria-label="Documentation" role={drawerOpen ? 'dialog' : undefined} aria-modal={drawerOpen ? 'true' : undefined}>
          <button className="docs-sidebar-dismiss" type="button" aria-label="Close documentation menu" onClick={closeDrawer}><X size={18} /></button>
          <div className="docs-sidebar-title"><BookOpen size={16} strokeWidth={1.5} /><span>VEIL notes</span></div>
          <label className="docs-search">
            <span className="sr-only">Search documentation topics</span>
            <Search size={15} aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search topics" />
          </label>
          <nav aria-label="Documentation topics">
            {filteredTopics.length > 0 ? filteredTopics.map((item) => (
              <a key={item.slug} href={`#/docs/${item.slug}`} aria-current={topic.slug === item.slug ? 'page' : undefined} onClick={closeDrawer}>
                <span>{item.label}</span><small>{item.summary}</small>
              </a>
            )) : <p className="docs-no-results" role="status">No topics found. Try a broader search.</p>}
          </nav>
          <a className="docs-pricing-link" href="#/pricing" onClick={closeDrawer}>Pricing <ArrowUpRight size={14} /></a>
        </aside>
        {drawerOpen && <button className="docs-scrim" type="button" aria-label="Close documentation menu" onClick={closeDrawer} />}
        <article ref={articleRef} className="docs-article">
          {topic.content()}
          <nav className="docs-pagination" aria-label="Adjacent documentation topics">
            <div>{topicIndex > 0 && <a href={`#/docs/${topics[topicIndex - 1].slug}`}><ArrowLeft size={15} /><span><small>Previous</small>{topics[topicIndex - 1].label}</span></a>}</div>
            <div>{topicIndex < topics.length - 1 && <a href={`#/docs/${topics[topicIndex + 1].slug}`}><span><small>Next</small>{topics[topicIndex + 1].label}</span><ArrowRight size={15} /></a>}</div>
          </nav>
          <section className="docs-launch" aria-labelledby="docs-launch-title">
            <span className="docs-eyebrow">Ready when you are</span>
            <h2 id="docs-launch-title">Take the thought into the studio.</h2>
            <button className="button button--primary" type="button" onClick={onLaunch}>Open studio <ArrowUpRight size={16} /></button>
          </section>
        </article>
      </div>
    </main>
  );
}

function parseTokenInput(value: string) {
  if (value.trim() === '') return 0;
  const number = Number(value);
  return Number.isSafeInteger(number) && number >= 0 ? number : null;
}

export function PricingPage({ onLaunch }: PricingPageProps) {
  const [modelId, setModelId] = useState<VeilModelId>('core');
  const [inputTokens, setInputTokens] = useState('10000');
  const [outputTokens, setOutputTokens] = useState('2000');
  const parsedInput = parseTokenInput(inputTokens);
  const parsedOutput = parseTokenInput(outputTokens);
  const valid = parsedInput !== null && parsedOutput !== null;
  const estimate = valid ? estimateUsageCost(modelId, parsedInput, parsedOutput) : null;
  const selectedModel = getModelPricing(modelId);

  return (
    <main id="main" className="pricing-page">
      <div className="pricing-wrap">
        <header className="pricing-lead" data-reveal>
          <div className="pricing-lead-copy">
            <span className="docs-eyebrow">Simple, usage-based pricing</span>
            <h1>Pay for the words<br /><em>you work through.</em></h1>
            <p>Choose a model and pay only for the tokens used. Rates are shown in US dollars per one million tokens.</p>
            <button className="button button--primary" type="button" onClick={onLaunch}>Open studio <ArrowUpRight size={16} /></button>
          </div>
          <figure className="pricing-lead-image">
            <img
              src="/assets/credits-still-life-v01.webp"
              width="1536"
              height="1024"
              loading="eager"
              fetchPriority="high"
              alt="A quiet arrangement of blank paper cards prepared for planning model usage"
            />
          </figure>
        </header>

        <section className="pricing-rates" aria-labelledby="pricing-rates-title" data-reveal>
          <div className="pricing-section-heading"><span className="docs-eyebrow">The models</span><h2 id="pricing-rates-title">Two paces. Clear rates.</h2></div>
          <div className="pricing-table" role="table" aria-label="VEIL model prices">
            <div className="pricing-table-head" role="row">
              <span role="columnheader">Model</span><span role="columnheader">Input</span><span role="columnheader">Output</span>
            </div>
            {VEIL_MODEL_PRICING.map((model) => (
              <div className="pricing-table-row" role="row" key={model.id}>
                <div role="cell"><strong>{model.name}</strong><small>{model.character}</small></div>
                <div role="cell"><span className="pricing-mobile-label" aria-hidden="true">Input</span><strong>${model.inputUsdPerMillion.toFixed(3)}</strong><small>USD / 1M tokens</small></div>
                <div role="cell"><span className="pricing-mobile-label" aria-hidden="true">Output</span><strong>${model.outputUsdPerMillion.toFixed(3)}</strong><small>USD / 1M tokens</small></div>
              </div>
            ))}
          </div>
          <p className="pricing-rate-note">Input includes the conversation context sent with your message. Output includes the response and reasoning tokens.</p>
        </section>

        <section className="pricing-estimator" aria-labelledby="estimator-title" data-reveal>
          <div className="pricing-section-heading"><span className="docs-eyebrow">Cost estimator</span><h2 id="estimator-title">Make the numbers tangible.</h2><p>Enter an expected token count to estimate one exchange.</p></div>
          <div className="estimator-sheet">
            <div className="estimator-fields">
              <div className="estimator-field"><label htmlFor="estimator-model">Model</label><select id="estimator-model" value={modelId} onChange={(event) => setModelId(event.target.value as VeilModelId)}>{VEIL_MODEL_PRICING.map((model) => <option value={model.id} key={model.id}>{model.name}</option>)}</select></div>
              <div className="estimator-field"><label htmlFor="estimator-input">Input tokens</label><input id="estimator-input" type="number" min="0" step="1" inputMode="numeric" value={inputTokens} aria-invalid={parsedInput === null} aria-describedby={parsedInput === null ? 'input-token-error' : undefined} onChange={(event) => setInputTokens(event.target.value)} />{parsedInput === null && <small className="field-error" id="input-token-error">Enter a non-negative whole number within the supported range.</small>}</div>
              <div className="estimator-field"><label htmlFor="estimator-output">Output tokens</label><input id="estimator-output" type="number" min="0" step="1" inputMode="numeric" value={outputTokens} aria-invalid={parsedOutput === null} aria-describedby={parsedOutput === null ? 'output-token-error' : undefined} onChange={(event) => setOutputTokens(event.target.value)} />{parsedOutput === null && <small className="field-error" id="output-token-error">Enter a non-negative whole number within the supported range.</small>}</div>
            </div>
            <div className="estimator-result" aria-live="polite">
              <span>Estimated cost</span>
              <strong>{estimate === null ? '—' : `$${estimate.toFixed(5)}`}</strong>
              <p>{valid ? `${selectedModel.name} · ${parsedInput.toLocaleString('en-US')} input · ${parsedOutput.toLocaleString('en-US')} output` : 'Correct the token values to see an estimate.'}</p>
              <code>(input × ${selectedModel.inputUsdPerMillion.toFixed(3)} + output × ${selectedModel.outputUsdPerMillion.toFixed(3)}) ÷ 1,000,000</code>
            </div>
          </div>
        </section>

        <section className="pricing-explainer" aria-labelledby="pricing-explainer-title" data-reveal>
          <div><span className="docs-eyebrow">How credits work</span><h2 id="pricing-explainer-title">A balance measured in USD.</h2></div>
          <div className="pricing-copy"><p>Usage draws from a USD credit balance according to the selected model’s input and output rates. A longer conversation can cost more because previous messages may be included as input context.</p><p>The estimator is arithmetic only. Actual usage depends on the token counts for the conversation and response.</p><a className="docs-inline-link" href="#/docs/credits">Read how credits work <ArrowRight size={14} /></a></div>
        </section>

        <section className="pricing-faq" aria-labelledby="pricing-faq-title" data-reveal>
          <div className="pricing-section-heading"><span className="docs-eyebrow">Useful details</span><h2 id="pricing-faq-title">Before you estimate.</h2></div>
          <div className="pricing-faq-grid">
            <article><h3>What counts as input?</h3><p>Your message and the earlier conversation context sent with it.</p></article>
            <article><h3>What counts as output?</h3><p>The generated response, including reasoning tokens used by the model.</p></article>
            <article><h3>Which model costs less?</h3><p>Core has the lower input and output rates. Reason is priced for more considered work.</p></article>
            <article><h3>Is this a subscription?</h3><p>No. The published structure is pay-as-you-go usage priced per one million tokens.</p></article>
          </div>
        </section>

        <section className="pricing-closing" aria-labelledby="pricing-closing-title" data-reveal>
          <span className="docs-eyebrow">Your next thought</span><h2 id="pricing-closing-title">Start with the model that fits.</h2><button className="button button--paper" type="button" onClick={onLaunch}>Open studio <ArrowUpRight size={16} /></button>
        </section>
        <p className="pricing-source">Pricing reference: <a href="https://docs.latens.si/docs/pricing" target="_blank" rel="noreferrer">Latens documentation</a>, verified October 12, 2026.</p>
      </div>
    </main>
  );
}

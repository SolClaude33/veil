import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  ArrowUp,
  Braces,
  ChevronDown,
  Code2,
  Menu,
  MessageSquareText,
  Plus,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import "./terminal.css";

type TerminalProps = {
  onExit: () => void;
  initialPrompt?: string;
  initialModel?: "core" | "reason";
};

type Message = {
  id: number;
  content: string;
};

type Conversation = {
  id: number;
  title: string;
  messages: Message[];
};

const suggestions = [
  {
    icon: Search,
    eyebrow: "Research",
    title: "Map an unfamiliar topic",
    prompt: "Build a clear research plan for a topic I am exploring.",
  },
  {
    icon: Code2,
    eyebrow: "Coding",
    title: "Untangle a hard problem",
    prompt: "Help me reason through a difficult software problem step by step.",
  },
  {
    icon: Braces,
    eyebrow: "Analysis",
    title: "Find the signal in the noise",
    prompt: "Create a rigorous framework for analyzing a complex decision.",
  },
] as const;

function createTitle(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > 42 ? `${normalized.slice(0, 39)}…` : normalized;
}

export default function Terminal({
  onExit,
  initialPrompt = "",
  initialModel = "core",
}: TerminalProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [sessionConversation, setSessionConversation] = useState<Conversation | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [draft, setDraft] = useState(initialPrompt);
  const [model, setModel] = useState<"core" | "reason">(initialModel);
  const [temperature, setTemperature] = useState(0.4);
  const [saveHistory, setSaveHistory] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 900px)").matches,
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const sidebarCloseRef = useRef<HTMLButtonElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const settingsPanelRef = useRef<HTMLDivElement>(null);
  const settingsTitleId = useId();
  const temperatureId = useId();
  const historyId = useId();
  const nextId = useRef(1);

  const activeConversation = activeConversationId === -1
    ? sessionConversation
    : conversations.find((conversation) => conversation.id === activeConversationId);

  useEffect(() => {
    if (!initialPrompt) return;
    setDraft(initialPrompt);
    window.setTimeout(() => {
      const input = textareaRef.current;
      input?.focus();
      input?.setSelectionRange(initialPrompt.length, initialPrompt.length);
    }, 0);
  }, [initialPrompt]);

  useEffect(() => {
    const input = textareaRef.current;
    if (!input) return;
    input.style.height = "auto";
    const nextHeight = Math.min(input.scrollHeight, 140);
    input.style.height = `${nextHeight}px`;
    input.style.overflowY = input.scrollHeight > 140 ? "auto" : "hidden";
  }, [draft]);

  useEffect(() => {
    setModel(initialModel);
  }, [initialModel]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const updateViewport = () => {
      setIsMobile(media.matches);
      if (!media.matches) setSidebarOpen(false);
    };
    updateViewport();
    media.addEventListener("change", updateViewport);
    return () => media.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (!settingsOpen) return;

    const panel = settingsPanelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'button, select, input, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSettingsOpen(false);
        return;
      }
      if (event.key !== "Tab" || !focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      settingsButtonRef.current?.focus();
    };
  }, [settingsOpen]);

  useEffect(() => {
    if (!sidebarOpen || !isMobile) return;

    const panel = sidebarRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'button, select, input, textarea, a[href], [tabindex]:not([tabindex="-1"])',
    );
    sidebarCloseRef.current?.focus();

    const handleSidebarKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
        return;
      }
      if (event.key !== "Tab" || !focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleSidebarKeyDown);
    return () => {
      document.removeEventListener("keydown", handleSidebarKeyDown);
      if (window.matchMedia("(max-width: 900px)").matches) {
        menuButtonRef.current?.focus();
      }
    };
  }, [isMobile, sidebarOpen]);

  const beginConversation = () => {
    setActiveConversationId(null);
    setSessionConversation(null);
    setDraft("");
    setSidebarOpen(false);
    window.setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const selectSuggestion = (prompt: string) => {
    setDraft(prompt);
    window.setTimeout(() => {
      const input = textareaRef.current;
      input?.focus();
      input?.setSelectionRange(prompt.length, prompt.length);
    }, 0);
  };

  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;

    const message: Message = { id: nextId.current++, content };
    if (activeConversationId === null) {
      const conversation: Conversation = {
        id: nextId.current++,
        title: createTitle(content),
        messages: [message],
      };
      if (saveHistory) {
        setConversations((current) => [conversation, ...current]);
        setActiveConversationId(conversation.id);
      } else {
        setSessionConversation({ ...conversation, id: -1 });
        setActiveConversationId(-1);
      }
    } else if (activeConversationId === -1) {
      setSessionConversation((current) => current
        ? { ...current, messages: [...current.messages, message] }
        : current,
      );
    } else {
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === activeConversationId
            ? { ...conversation, messages: [...conversation.messages, message] }
            : conversation,
        ),
      );
    }
    setDraft("");
  };

  return (
    <div className="terminal-shell">
      <a
        className="terminal-skip-link"
        href="#terminal-composer"
        onClick={(event) => {
          event.preventDefault();
          textareaRef.current?.focus();
        }}
      >
        Skip to composer
      </a>

      <button
        className={`terminal-backdrop ${sidebarOpen ? "is-visible" : ""}`}
        type="button"
        aria-label="Close conversation sidebar"
        aria-hidden={!sidebarOpen}
        inert={!sidebarOpen ? true : undefined}
        tabIndex={sidebarOpen ? 0 : -1}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        ref={sidebarRef}
        className={`terminal-sidebar ${sidebarOpen ? "is-open" : ""}`}
        aria-label="Conversation history"
        aria-hidden={isMobile && !sidebarOpen}
        aria-modal={isMobile && sidebarOpen ? true : undefined}
        role={isMobile ? "dialog" : undefined}
        inert={(isMobile && !sidebarOpen) || settingsOpen ? true : undefined}
      >
        <div className="terminal-sidebar-header">
          <button className="terminal-brand" type="button" onClick={onExit} aria-label="Return to VEIL home">
            <span className="terminal-brand-mark" aria-hidden="true">[v_]</span>
            <span>veil.</span>
          </button>
          <button
            ref={sidebarCloseRef}
            className="terminal-sidebar-close"
            type="button"
            aria-label="Close conversation sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <button className="terminal-new-button" type="button" onClick={beginConversation}>
          <Plus size={16} aria-hidden="true" />
          New conversation
        </button>

        <div className="terminal-history">
          <p className="terminal-section-label">Conversations</p>
          {conversations.length === 0 ? (
            <div className="terminal-history-empty">
              <MessageSquareText size={18} aria-hidden="true" />
              <p>Your conversations will appear here.</p>
            </div>
          ) : (
            <ul>
              {conversations.map((conversation) => (
                <li key={conversation.id}>
                  <button
                    className={conversation.id === activeConversationId ? "is-active" : ""}
                    type="button"
                    onClick={() => {
                      setActiveConversationId(conversation.id);
                      setSidebarOpen(false);
                    }}
                  >
                    <span>{conversation.title}</span>
                    <small>{conversation.messages.length} {conversation.messages.length === 1 ? "thought" : "thoughts"}</small>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="terminal-sidebar-footer">
          <span className="terminal-status-dot" aria-hidden="true" />
          Private workspace
        </div>
      </aside>

      <main
        className="workspace-main"
        inert={settingsOpen || (isMobile && sidebarOpen) ? true : undefined}
      >
        <header className="workspace-topbar">
          <div className="workspace-topbar-start">
            <button
              ref={menuButtonRef}
              className="workspace-icon-button terminal-mobile-menu"
              type="button"
              aria-label="Open conversation sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={19} aria-hidden="true" />
            </button>
            <button className="workspace-home-button" type="button" aria-label="Home" onClick={onExit}>
              <ArrowLeft size={15} aria-hidden="true" />
              <span>Home</span>
            </button>
          </div>

          <label className="workspace-model-select">
            <span className="sr-only">Model</span>
            <Sparkles size={14} aria-hidden="true" />
            <select
              value={model}
              onChange={(event) => setModel(event.target.value as "core" | "reason")}
            >
              <option value="core">VEIL Core</option>
              <option value="reason">VEIL Reason</option>
            </select>
            <ChevronDown size={14} aria-hidden="true" />
          </label>

          <button
            ref={settingsButtonRef}
            className="workspace-icon-button"
            type="button"
            aria-label="Open workspace settings"
            aria-haspopup="dialog"
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen(true)}
          >
            <Settings2 size={18} aria-hidden="true" />
          </button>
        </header>

        <section className={`workspace-content ${activeConversation ? "has-messages" : ""}`} aria-live="polite">
          {activeConversation ? (
            <div className="workspace-thread">
              <div className="workspace-thread-heading">
                <span>Current thread</span>
                <h1>{activeConversation.title}</h1>
              </div>
              <ol className="workspace-message-list">
                {activeConversation.messages.map((message) => (
                  <li key={message.id}>
                    <span className="workspace-message-label">You</span>
                    <p>{message.content}</p>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <div className="workspace-empty-state">
              <div className="workspace-kicker"><span aria-hidden="true" /> Private thinking space</div>
              <h1>A space for<br />your thoughts.</h1>
              <p>Begin with a question, a fragment, or something you want to understand.</p>
              <div className="workspace-suggestions" aria-label="Suggested prompts">
                {suggestions.map(({ icon: Icon, eyebrow, title, prompt }) => (
                  <button key={eyebrow} type="button" onClick={() => selectSuggestion(prompt)}>
                    <span className="workspace-suggestion-icon"><Icon size={17} aria-hidden="true" /></span>
                    <span className="workspace-suggestion-copy">
                      <small>{eyebrow}</small>
                      <strong>{title}</strong>
                    </span>
                    <ArrowUp size={15} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <div className="workspace-composer-wrap">
          <form className="workspace-composer" onSubmit={submitMessage}>
            <label className="sr-only" htmlFor="terminal-composer">Write a message</label>
            <textarea
              ref={textareaRef}
              id="terminal-composer"
              rows={1}
              value={draft}
              placeholder="Ask anything. Think freely."
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
            />
            <div className="workspace-composer-footer">
              <span>{model === "reason" ? "Reasoning" : "Core"}</span>
              <button type="submit" aria-label="Add message" disabled={!draft.trim()}>
                <ArrowUp size={17} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>
          </form>
          <p className="workspace-composer-hint">Enter to add · Shift + Enter for a new line</p>
        </div>
      </main>

      {settingsOpen && (
        <div className="workspace-settings-layer" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSettingsOpen(false);
        }}>
          <div
            ref={settingsPanelRef}
            className="workspace-settings-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={settingsTitleId}
          >
            <div className="workspace-settings-heading">
              <div>
                <span>Workspace</span>
                <h2 id={settingsTitleId}>Settings</h2>
              </div>
              <button type="button" aria-label="Close settings" onClick={() => setSettingsOpen(false)}>
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="workspace-setting-block">
              <div className="workspace-setting-copy">
                <label htmlFor={temperatureId}>Temperature</label>
                <output htmlFor={temperatureId}>{temperature.toFixed(1)}</output>
              </div>
              <p>Adjust how exploratory the workspace feels.</p>
              <input
                id={temperatureId}
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(event) => setTemperature(Number(event.target.value))}
                style={{
                  background: `linear-gradient(to right, var(--terminal-lime) 0 ${temperature * 100}%, #343c30 ${temperature * 100}% 100%)`,
                }}
              />
              <div className="workspace-range-labels"><span>Precise</span><span>Expansive</span></div>
            </div>

            <div className="workspace-setting-block workspace-setting-row">
              <div>
                <label htmlFor={historyId}>Save conversation history</label>
                <p>Keep new conversations in this session.</p>
              </div>
              <button
                id={historyId}
                className={`workspace-toggle ${saveHistory ? "is-on" : ""}`}
                type="button"
                role="switch"
                aria-checked={saveHistory}
                onClick={() => setSaveHistory((current) => !current)}
              >
                <span />
              </button>
            </div>

            <div className="workspace-settings-note">
              <SlidersHorizontal size={16} aria-hidden="true" />
              Preferences apply to this workspace session.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

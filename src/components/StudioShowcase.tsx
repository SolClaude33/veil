import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowUpRight,
  ChartNoAxesColumn,
  Feather,
  Plus,
  Search,
} from "lucide-react";
import { Brand } from "./Brand";
import "./studio-showcase.css";

type StudioShowcaseProps = {
  onLaunch: (prompt?: string, model?: "core" | "reason") => void;
};

const startingPoints = [
  {
    label: "Research",
    prompt: "Build a clear research plan for a topic I am exploring.",
    icon: Search,
  },
  {
    label: "Coding",
    prompt: "Help me reason through a difficult software problem step by step.",
    icon: Feather,
  },
  {
    label: "Analysis",
    prompt: "Create a rigorous framework for analyzing a complex decision.",
    icon: ChartNoAxesColumn,
  },
] as const;

const modelDescriptions = {
  core: "Everyday writing and exploration.",
  reason: "Careful, layered reasoning.",
} as const;

export default function StudioShowcase({ onLaunch }: StudioShowcaseProps) {
  const [draft, setDraft] = useState("");
  const [model, setModel] = useState<"core" | "reason">("core");

  const launchStudio = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = draft.trim();
    onLaunch(prompt || undefined, model);
  };

  return (
    <section id="studio-preview" className="studio-showcase wrap" data-reveal>
      <div className="showcase-copy">
        <span className="showcase-eyebrow">THE STUDIO</span>
        <h2>Less noise.<br /><em>More possibility.</em></h2>
        <p>
          A clear place to explore a question, shape a draft, or work through the
          problem that has been waiting for your attention.
        </p>
        <a className="showcase-text-link" href="#studio-preview-window">
          See the studio <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>

      <div id="studio-preview-window" className="showcase-window" aria-label="Interactive VEIL Studio preview">
        <aside className="showcase-sidebar" aria-label="Preview conversation history">
          <Brand variant="compact" className="showcase-brand" />
          <button
            className="showcase-new-conversation"
            type="button"
            onClick={() => setDraft("")}
          >
            <Plus size={15} aria-hidden="true" />
            New conversation
          </button>
          <div className="showcase-history">
            <span>Conversations</span>
            <p>No saved conversations</p>
          </div>
          <span className="showcase-sidebar-note">Your studio</span>
        </aside>

        <div className="showcase-workspace">
          <header className="showcase-toolbar">
            <span className="showcase-mobile-brand">veil</span>
            <div className="showcase-model-choice">
              <div className="showcase-model-picker" role="group" aria-label="Choose a VEIL model" aria-describedby="showcase-model-description">
                <button
                  className={model === "core" ? "is-active" : ""}
                  type="button"
                  aria-pressed={model === "core"}
                  onClick={() => setModel("core")}
                >
                  Core
                </button>
                <button
                  className={model === "reason" ? "is-active" : ""}
                  type="button"
                  aria-pressed={model === "reason"}
                  onClick={() => setModel("reason")}
                >
                  Reason
                </button>
              </div>
              <p id="showcase-model-description" className="showcase-model-description" aria-live="polite">
                {modelDescriptions[model]}
              </p>
            </div>
            <span className="showcase-toolbar-label">Private canvas</span>
          </header>

          <div className="showcase-workspace-body">
            <div className="showcase-empty-copy">
              <span>Your private studio</span>
              <h3>Every idea<br /><em>starts somewhere.</em></h3>
              <p>Begin with a question, a fragment, or a thought worth following.</p>
            </div>

            <div className="showcase-starting-points" aria-label="Starting points">
              {startingPoints.map(({ label, prompt, icon: Icon }) => (
                <button key={label} type="button" onClick={() => setDraft(prompt)}>
                  <Icon size={16} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <form className="showcase-composer" onSubmit={launchStudio}>
              <label htmlFor="showcase-prompt">Start with your own words</label>
              <textarea
                id="showcase-prompt"
                rows={2}
                value={draft}
                placeholder="Write what is on your mind…"
                onChange={(event) => setDraft(event.target.value)}
              />
              <div className="showcase-composer-footer">
                <span>VEIL {model === "core" ? "Core" : "Reason"}</span>
                <button type="submit">
                  Open in studio
                  <ArrowUpRight size={15} aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

import type { MouseEvent } from "react";
import "./brand.css";

type VeilSymbolProps = {
  className?: string;
};

type BrandProps = {
  variant?: "default" | "compact";
  className?: string;
  onClick?: () => void;
};

export function VeilSymbol({ className = "" }: VeilSymbolProps) {
  return (
    <svg
      className={`veil-symbol ${className}`.trim()}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7 10h15l13 34-7 12L7 10Z" fill="currentColor" opacity=".68" />
      <path d="M43 10h15L38 56H28l7-12 8-34Z" fill="currentColor" />
    </svg>
  );
}

function VeilWordmark() {
  return (
    <span
      className="veil-wordmark"
      aria-hidden="true"
    >
      veil
    </span>
  );
}

export function Brand({ variant = "default", className = "", onClick }: BrandProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!onClick) return;
    if (
      event.button !== 0
      || event.ctrlKey
      || event.metaKey
      || event.shiftKey
      || event.altKey
    ) return;
    event.preventDefault();
    onClick();
  };

  return (
    <a
      className={`veil-brand is-${variant} ${className}`.trim()}
      href="#/"
      aria-label="VEIL home"
      onClick={handleClick}
    >
      <VeilSymbol />
      <VeilWordmark />
    </a>
  );
}

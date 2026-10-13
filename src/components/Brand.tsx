import { useId } from "react";
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
  const maskId = `veil-symbol-${useId().replace(/:/g, "")}`;

  return (
    <svg
      className={`veil-symbol ${className}`.trim()}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect width="64" height="64" fill="white" />
          <path d="m27.2 30.8 9.9-8.5-3.5 20.8-6.4-12.3Z" fill="black" />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`} fill="currentColor">
        <path d="M5 7h16l13 35-8 15L5 7Z" />
        <path d="M43 7h16L38 57H26l8-15L43 7Z" />
      </g>
      <path d="m33.6 43.1 7.5-7.1-3.1 13.5-4.4-6.4Z" fill="currentColor" opacity=".56" />
    </svg>
  );
}

function VeilWordmark() {
  return (
    <svg
      className="veil-wordmark"
      viewBox="0 0 126 38"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 4h13v2h-3l9 25L30 6h-3V4h11v2h-3L24 35h-7L6 6H2V4Z" fill="currentColor" />
      <path d="M43 4h26l1 9h-2c-2-5-5-6-12-6h-4v11h3c5 0 7-1 8-5h2v13h-2c-1-4-3-5-8-5h-3v11h5c7 0 11-2 13-8h2l-2 11H43v-2h4V6h-4V4Z" fill="currentColor" />
      <path d="M76 4h17v2h-5v27h5v2H76v-2h5V6h-5V4Z" fill="currentColor" />
      <path d="M98 4h17v2h-5v26h3c7 0 10-3 12-10h2l-2 13H98v-2h5V6h-5V4Z" fill="currentColor" />
      <path d="m64.5 4 5.5 9h-2.2l-5.4-9h2.1Z" fill="var(--veil-cut, #f5f3ed)" />
    </svg>
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

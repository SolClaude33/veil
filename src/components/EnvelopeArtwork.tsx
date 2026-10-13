import { forwardRef } from "react";
import type { CSSProperties } from "react";
import { VeilSymbol } from "./Brand";
import "./envelope-assets.css";

type EnvelopeArtworkProps = {
  className?: string;
  style?: CSSProperties;
  withCaption?: boolean;
};

const EnvelopeArtwork = forwardRef<HTMLElement, EnvelopeArtworkProps>(
  function EnvelopeArtwork(
    { className = "", style, withCaption = true },
    ref,
  ) {
    return (
      <figure
        ref={ref}
        className={`mail-art envelope-artwork ${withCaption ? "with-caption" : "without-caption"} ${className}`.trim()}
        style={style}
        aria-label="A paper envelope opening to reveal a personal note"
      >
        {withCaption && (
          <>
            <div className="mail-orbit" aria-hidden="true" />
            <span className="mail-marginalia" aria-hidden="true">A thought,<br />still becoming.</span>
          </>
        )}

        <div className="envelope-assembly" aria-hidden="true">
          <div className="mail-ground-shadow" />
          <div className="mail-back" />

          <div className="mail-flap mail-flap--inside">
            <img
              className="envelope-flap-texture"
              src="/assets/envelope-flap-v01.webp"
              alt=""
              width="1536"
              height="1024"
              draggable="false"
            />
          </div>

          <div className="personal-letter">
            <img
              className="letter-paper-texture"
              src="/assets/letter-paper-v01.webp"
              alt=""
              width="1536"
              height="1024"
              draggable="false"
            />
            <span className="letter-salutation">Dear curious mind,</span>
            <span className="letter-thought">Your thoughts.<br /><em>Your own.</em></span>
            <div className="letter-rule" />
            <span className="letter-message">Leave a little space<br />for possibility.</span>
            <VeilSymbol className="letter-signature" />
          </div>

          <div className="mail-front mail-front--generated">
            <img
              className="envelope-front-texture"
              src="/assets/envelope-front-v01.webp"
              alt=""
              width="1536"
              height="1024"
              fetchPriority="high"
              draggable="false"
            />
            <span>PERSONALLY YOURS</span>
            <VeilSymbol />
          </div>

          <div className="mail-flap mail-flap--outer">
            <img
              className="envelope-flap-texture"
              src="/assets/envelope-flap-v01.webp"
              alt=""
              width="1536"
              height="1024"
              draggable="false"
            />
          </div>

          <div className="mail-seal">
            <span className="seal-ring" />
            <VeilSymbol />
          </div>
        </div>

        {withCaption && (
          <figcaption className="mail-caption" aria-hidden="true">
            <span className="mail-caption-sealed">Some things belong to you.</span>
            <span className="mail-caption-open">A little room for possibility.</span>
          </figcaption>
        )}
      </figure>
    );
  },
);

export default EnvelopeArtwork;

type SectionArtworkProps = {
  name: 'privacy' | 'possibilities' | 'models';
  src: string;
};

export default function SectionArtwork({ name, src }: SectionArtworkProps) {
  return (
    <figure className={`section-artwork section-artwork--${name}`} data-reveal aria-hidden="true">
      <img
        src={src}
        alt=""
        width="2048"
        height="1360"
        loading="lazy"
        decoding="async"
        draggable="false"
      />
    </figure>
  );
}

import { useRef } from 'react';
import EnvelopeArtwork from './EnvelopeArtwork';
import { useCorrespondenceJourney } from '../hooks/useCorrespondenceJourney';

export default function CorrespondenceJourney() {
  const artRef = useRef<HTMLElement>(null);
  useCorrespondenceJourney(artRef);
  return <div className="correspondence-layer" aria-hidden="true"><EnvelopeArtwork ref={artRef} className="correspondence-art" /></div>;
}

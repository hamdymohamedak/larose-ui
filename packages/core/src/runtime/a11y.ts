import type { A11yPreferences } from './types';

export function detectA11yPreferences(): A11yPreferences {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return { reducedMotion: false, highContrast: false };
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const highContrast = window.matchMedia('(prefers-contrast: more)').matches;

  return { reducedMotion, highContrast };
}

export function subscribeA11yPreferences(
  onChange: (preferences: A11yPreferences) => void,
): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {};
  }

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const contrastQuery = window.matchMedia('(prefers-contrast: more)');

  const notify = () => onChange(detectA11yPreferences());

  motionQuery.addEventListener('change', notify);
  contrastQuery.addEventListener('change', notify);

  return () => {
    motionQuery.removeEventListener('change', notify);
    contrastQuery.removeEventListener('change', notify);
  };
}

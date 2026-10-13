export type ColorMode = 'light' | 'dark' | 'system';

const QUERY = '(prefers-color-scheme: dark)';

function canMatchMedia(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function';
}

export function prefersColorSchemeDark(): boolean {
  return canMatchMedia() ? window.matchMedia(QUERY).matches : false;
}

export function resolveIsDark(colorMode: ColorMode, systemDark: boolean): boolean {
  return colorMode === 'dark' || (colorMode === 'system' && systemDark);
}

export function subscribeSystemDark(onChange: (dark: boolean) => void): () => void {
  if (!canMatchMedia()) return () => {};
  const media = window.matchMedia(QUERY);
  onChange(media.matches);
  const listener = (e: MediaQueryListEvent) => onChange(e.matches);
  media.addEventListener('change', listener);
  return () => media.removeEventListener('change', listener);
}

export function themedRootClassName(className: string | undefined, isDark: boolean): string {
  return ['oox-root', isDark ? 'dark' : null, className].filter(Boolean).join(' ');
}

/** Resolve a CSS color (including `var(--x)`) to an sRGB string for canvas. */
export function resolveCssColor(color: string, element?: Element | null): string {
  if (typeof document === 'undefined') return color;
  const probe = document.createElement('span');
  probe.style.color = color;
  const host = element ?? document.body;
  host.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved || color;
}

export function readCssVar(name: string, element: Element | null, fallback: string): string {
  if (!element || typeof getComputedStyle === 'undefined') return fallback;
  const value = getComputedStyle(element).getPropertyValue(name).trim();
  return value || fallback;
}

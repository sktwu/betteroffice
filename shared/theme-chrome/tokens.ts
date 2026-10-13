/** Shared chrome tokens with today's light hex as fallbacks. */
export const chrome = {
  text: 'var(--doc-text, #3c4043)',
  muted: 'var(--doc-text-muted, #5f6368)',
  disabled: 'var(--doc-text-subtle, #9aa0a6)',
  hover: 'var(--doc-bg-hover, #e2e7ef)',
  activeBg: 'var(--doc-toggle-active-bg, #d3e3fd)',
  activeFg: 'var(--doc-toggle-active-fg, #3c4043)',
  border: 'var(--doc-border, #c7cacf)',
  surface: 'var(--doc-surface, #ffffff)',
  rail: 'var(--doc-bg, #edf2fa)',
  page: 'var(--doc-bg, #f3f5f8)',
  primary: 'var(--doc-primary, #2563eb)',
  selection: 'var(--doc-selection, rgba(37, 99, 235, 0.12))',
  shadow: 'var(--doc-shadow, rgba(60, 64, 67, 0.24))',
} as const;

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { themedRootClassName } from '../../../shared/theme-chrome/colorMode';
import { portalChromeClassName } from '../../../shared/theme-chrome/ThemeChromeContext';
import { chrome } from '../../../shared/theme-chrome/tokens';

describe('pptx theme chrome', () => {
  it('builds a themed root class', () => {
    expect(themedRootClassName('host', false)).toBe('oox-root host');
    expect(themedRootClassName(undefined, true)).toBe('oox-root dark');
  });

  it('builds a portal chrome class', () => {
    expect(portalChromeClassName(false)).toBe('oox-root');
    expect(portalChromeClassName(true)).toBe('oox-root dark');
  });

  it('selection strokes use the primary token', () => {
    expect(chrome.primary).toContain('--doc-primary');
    const source = readFileSync(join(import.meta.dirname, 'PptxEditor.tsx'), 'utf8');
    expect(source).toContain('chrome.primary');
    expect(source).toContain('themedRootClassName');
  });
});

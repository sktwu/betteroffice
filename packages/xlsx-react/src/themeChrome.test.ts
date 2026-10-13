import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { themedRootClassName } from '../../../shared/theme-chrome/colorMode';
import { chrome } from '../../../shared/theme-chrome/tokens';

const chromeFiles = [
  'XlsxEditor.tsx',
  'worker/XlsxWorkerEditor.tsx',
  'viewer/XlsxSessionViewer.tsx',
] as const;

describe('xlsx theme chrome', () => {
  it('builds a themed root class', () => {
    expect(themedRootClassName('host', true)).toBe('oox-root dark host');
  });

  it('selection uses the primary and selection tokens', () => {
    expect(chrome.primary).toContain('--doc-primary');
    expect(chrome.selection).toContain('--doc-selection');
  });

  it('retires the Excel green from chrome modules', () => {
    for (const file of chromeFiles) {
      const source = readFileSync(join(import.meta.dirname, file), 'utf8');
      expect(source, file).not.toContain('#217346');
      expect(source, file).not.toContain('rgba(33, 115, 70');
      expect(source, file).toContain('themedRootClassName');
      expect(source, file).toContain('chrome.primary');
    }
  });
});

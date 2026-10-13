import { useEffect, useState } from 'react';
import {
  type ColorMode,
  prefersColorSchemeDark,
  resolveIsDark,
  subscribeSystemDark,
} from './colorMode';

export function useIsDark(colorMode: ColorMode): boolean {
  const [systemDark, setSystemDark] = useState(prefersColorSchemeDark);
  useEffect(() => {
    if (colorMode !== 'system') return;
    return subscribeSystemDark(setSystemDark);
  }, [colorMode]);
  return resolveIsDark(colorMode, systemDark);
}

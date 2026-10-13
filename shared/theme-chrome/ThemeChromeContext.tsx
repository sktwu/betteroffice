import { createContext, useContext, type ReactNode } from 'react';

const ThemeChromeContext = createContext(false);

export function ThemeChromeProvider({
  isDark,
  children,
}: {
  isDark: boolean;
  children: ReactNode;
}) {
  return <ThemeChromeContext.Provider value={isDark}>{children}</ThemeChromeContext.Provider>;
}

export function useThemeChromeDark(): boolean {
  return useContext(ThemeChromeContext);
}

export function portalChromeClassName(isDark: boolean): string {
  return themedPortalClass(isDark);
}

function themedPortalClass(isDark: boolean): string {
  return isDark ? 'oox-root dark' : 'oox-root';
}

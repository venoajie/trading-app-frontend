import { MantineProvider, MantineColorScheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useColorScheme } from '@mantine/hooks';
import { ReactNode, useEffect } from 'react';
import { theme } from '@/styles/theme';
import { useUiStore } from '@/store/uiStore';

interface ThemeBridgeProps {
  children: ReactNode;
}

/**
 * This component now handles the initial theme detection.
 * It syncs the OS preference to our store on the very first load,
 * then yields control to the user's explicit choices.
 */
export function ThemeBridge({ children }: ThemeBridgeProps) {
  const { colorScheme, setColorScheme } = useUiStore();
  // This Mantine hook safely detects the OS-level color scheme.
  const preferredColorScheme = useColorScheme('dark');

  // This effect runs on mount to initialize the theme state.
  useEffect(() => {
    // If colorScheme is null, it's the first load and we haven't hydrated from storage yet.
    // We set the theme based on the user's OS preference.
    if (colorScheme === null) {
      setColorScheme(preferredColorScheme);
    }
  }, [colorScheme, preferredColorScheme, setColorScheme]);

  // We must handle the `null` state before the store is hydrated.
  // We can default to the preferred scheme to avoid a flash of unstyled content.
  const effectiveColorScheme = colorScheme || preferredColorScheme;

  return (
    <MantineProvider
      theme={theme}
      withCssVariables
      withGlobalStyles
      colorScheme={effectiveColorScheme as MantineColorScheme}
    >
      <Notifications />
      {children}
    </MantineProvider>
  );
}

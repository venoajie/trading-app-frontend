import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ReactNode } from 'react';
import { theme } from '@/styles/theme';
import { useUiStore } from '@/store/uiStore';

interface ThemeBridgeProps {
  children: ReactNode;
}

/**
 * A bridge component that syncs the Zustand uiStore with the MantineProvider.
 * This ensures that the theme is reactive to state changes and is applied globally.
 * It also serves as the single entry point for all global Mantine providers.
 *
 * @param {ThemeBridgeProps} props
 * @returns {JSX.Element} The application wrapped in Mantine providers.
 */
export function ThemeBridge({ children }: ThemeBridgeProps) {
  const { colorScheme } = useUiStore();

  return (
    <MantineProvider
      theme={theme}
      withCssVariables
      withGlobalStyles
      colorScheme={colorScheme}
    >
      {/* The Notifications component is a requirement from Pillar 6.
          Placing it here makes it available globally. */}
      <Notifications />
      {children}
    </MantineProvider>
  );
}

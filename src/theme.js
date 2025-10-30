
// src/theme.js
import { createTheme, MantineProvider } from '@mantine/core';

/**
 * This is the central theme configuration for the application, embodying the
 * "Focused Clarity" design direction. It is a dual-mode theme, providing a
 * professional, high-contrast experience in both light and dark schemes.
 */
export const theme = createTheme({
  /**
   * 1. TYPOGRAPHY
   * 'Inter' is used for its excellent screen readability in both modes.
   */
  fontFamily: 'Inter, sans-serif',
  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '600',
  },

  /**
   * 2. COLOR PALETTE
   * The primary color is defined, and Mantine handles its shades.
   */
  primaryColor: 'blue',
  primaryShade: 7,

  /**
   * 3. DUAL-MODE COMPONENT STYLES
   * Default styles for core components are defined here. We use a function
   * to access the theme object and apply conditional styles based on the
   * active `colorScheme`.
   */
  components: {
    AppShell: {
      styles: (theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }),
    },
    Card: {
      defaultProps: {
        shadow: 'sm',
        radius: 'md',
        withBorder: true,
      },
      styles: (theme) => ({
        root: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
          borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],
        },
      }),
    },
    Button: {
      defaultProps: {
        radius: 'sm',
      },
      styles: (theme) => ({
        root: {
          fontWeight: 600,
        },
      }),
    },
  },
});
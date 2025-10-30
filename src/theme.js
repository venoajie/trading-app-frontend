
// src/theme.js
import { createTheme } from '@mantine/core';

export const theme = createTheme({
  /**
   * 1. TYPOGRAPHY
   * Upgraded to 'Roboto Flex' for its superior readability and performance in
   * high-density UIs. A full typographic scale is now defined.
   */
  fontFamily: "'Roboto Flex', sans-serif",
  lineHeight: 1.55,
  headings: {
    fontFamily: "'Roboto Flex', sans-serif",
    fontWeight: '600',
    // Professional typography tightens letter spacing on large headings
    styles: {
      h1: { letterSpacing: '-0.05rem' },
      h2: { letterSpacing: '-0.04rem' },
      h3: { letterSpacing: '-0.03rem' },
    },
  },
  // Set a global default font weight for all body text
  globalStyles: (theme) => ({
    body: {
      fontWeight: 400, // Use 'Regular' weight for body text to avoid the "fat" look
    },
  }),

  /**
   * 2. COLOR PALETTE
   */
  primaryColor: 'blue',
  primaryShade: 7,

  /**
   * 3. DUAL-MODE COMPONENT STYLES
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
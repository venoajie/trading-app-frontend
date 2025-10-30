
// src/theme.js
import { createTheme } from '@mantine/core';

/**
 * A professional, layered dark theme palette.
 * This creates a clear visual hierarchy from the deep background to the lighter content surfaces.
 * The colors are arranged from lightest (index 0) to darkest (index 9) as per Mantine's convention.
 */
const professionalDark = [
  '#E9ECEF', // [0] Primary text, headings
  '#C1C2C5', // [1] Body text
  '#909296', // [2] Dimmed, placeholder text
  '#5C5F66', // [3] Subtle hover states
  '#373A40', // [4] Borders, dividers, subtle UI elements
  '#2C2E33', // [5] Component hover backgrounds (e.g., button hover)
  '#25262B', // [6] Card, Header, Footer, and other elevated surfaces
  '#1A1B1E', // [7] Main application background
  '#141517', // [8] Darker background layer
  '#101113', // [9] Deepest body background
];

export const theme = createTheme({
  /**
   * 1. TYPOGRAPHY
   */
  fontFamily: "'Roboto Flex', sans-serif",
  lineHeight: 1.55,
  headings: {
    fontFamily: "'Roboto Flex', sans-serif",
    fontWeight: '600',
    styles: {
      h1: { letterSpacing: '-0.05rem' },
      h2: { letterSpacing: '-0.04rem' },
      h3: { letterSpacing: '-0.03rem' },
    },
  },
  globalStyles: (theme) => ({
    body: {
      fontWeight: 400,
    },
  }),

  /**
   * 2. COLOR PALETTE
   * This is the new, professionally tiered dark theme.
   */
  colors: {
    dark: professionalDark,
  },
  primaryColor: 'blue',
  primaryShade: { light: 6, dark: 7 }, // Adjusted for better contrast on new dark theme

  /**
   * 3. DUAL-MODE COMPONENT STYLES
   * This section maps the new color palette to the core components for dark mode.
   */
  components: {
    AppShell: {
      styles: (theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
        },
        header: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
          borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],
        },
        footer: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
          borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],
        }
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
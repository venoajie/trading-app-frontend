
// src/theme.js
import { createTheme, MantineColorsTuple } from '@mantine/core';

// Generated with a tool to create a professional slate palette
const slate: MantineColorsTuple = [
  "#f0f2f5",
  "#e1e6eb",
  "#c4ccd8",
  "#a6b3c6",
  "#8d9cb0",
  "#7c8ba0",
  "#728299",
  "#627086",
  "#536177",
  "#43526a"
];

const slateDark: MantineColorsTuple = [
  "#f8f9fa", // Lightest shade for hovers on dark backgrounds
  "#e9ecef",
  "#dee2e6",
  "#ced4da",
  "#adb5bd",
  "#868e96",
  "#495057", // Main Text Color
  "#343a40", // Card Backgrounds
  "#212529", // AppShell Main Background
  "#141517"  // Body background (darkest)
];


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
   * Refined to a more sophisticated slate/charcoal palette for better aesthetics
   * and reduced eye strain in dark mode.
   */
  colors: {
    dark: slateDark,
    gray: slate,
  },
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
        header: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.white,
          borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
        },
        footer: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.white,
          borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
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
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
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
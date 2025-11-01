
// src/theme.js
import { createTheme } from '@mantine/core';

const professionalDark = [
  '#E9ECEF', '#C1C2C5', '#909296', '#5C5F66', '#373A40',
  '#2C2E33', '#25262B', '#1A1B1E', '#141517', '#101113',
];

export const theme = createTheme({
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

  colors: {
    dark: professionalDark,
  },

  // --- THE FINAL FIX ---
  // We use globalStyles to explicitly set the body's background color.
  // This ensures it perfectly matches the AppShell.main background below.
  globalStyles: (theme) => ({
    body: {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
    },
  }),
  // --- END OF FIX ---

  primaryColor: 'blue',
  primaryShade: { light: 6, dark: 7 },
  components: {
    AppShell: {
      styles: (theme) => ({
        main: {
          // This color now matches the body's global style for a seamless look.
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
      defaultProps: { shadow: 'sm', radius: 'md', withBorder: true },
      styles: (theme) => ({
        root: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
          borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],
        },
      }),
    },
    Button: {
      defaultProps: { radius: 'sm' },
      styles: { root: { fontWeight: 600 } },
    },
  },
});
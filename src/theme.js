
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
  
  // NOTE: The body background color is handled imperatively by the 
  // `ThemeManager` component in `App.jsx`. This is a workaround for a
  // persistent CSS specificity issue that prevents this declarative
  // approach from working reliably on theme changes.
  globalStyles: (theme) => ({
    body: {
      // This color rule will be overridden by ThemeManager, but is kept
      // for completeness and as a fallback.
      color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.black,
    },
  }),

  colors: {
    dark: professionalDark,
  },
  primaryColor: 'blue',
  primaryShade: { light: 6, dark: 7 },
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
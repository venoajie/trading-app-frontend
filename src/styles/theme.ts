import {
  createTheme,
  MantineColorsTuple,
  MantineThemeOverride,
} from '@mantine/core';

// Define a custom color palette that will be your primary brand color.
const brandPrimary: MantineColorsTuple = [
  '#e7f5ff',
  '#d0ebff',
  '#a5d8ff',
  '#74c0fc',
  '#4dabf7',
  '#339af0',
  '#228be6',
  '#1c7ed6',
  '#1971c2',
  '#1864ab',
];

export const theme: MantineThemeOverride = createTheme({
  primaryColor: 'brandPrimary',
  colors: {
    brandPrimary,
  },
  // Ensure components like buttons have sufficient contrast against the background.
  autoContrast: true,
  luminanceThreshold: 0.3,

  // Define which color shade is the primary one for light and dark modes.
  primaryShade: {
    light: 6,
    dark: 7,
  },

  // Define global styles to ensure the body background transitions smoothly.
  globalStyles: (theme) => ({
    body: {
      ...theme.fn.fontStyles(),
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
      lineHeight: theme.lineHeight,
    },
  }),
});

// src/styles/theme.ts

import {
  createTheme,
  MantineColorsTuple,
  MantineThemeOverride,
} from '@mantine/core';

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

// V7 API CHANGE: The `theme` object passed to `createTheme` no longer supports
// a `globalStyles` key. Global styles are now typically handled via a
// separate component or within AppShell/Layout components.
export const theme: MantineThemeOverride = createTheme({
  primaryColor: 'brandPrimary',
  colors: {
    brandPrimary,
  },
  autoContrast: true,
  luminanceThreshold: 0.3,
  primaryShade: {
    light: 6,
    dark: 8, // Adjusted for better dark mode contrast
  },
});

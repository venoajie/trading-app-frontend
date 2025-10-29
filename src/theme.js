
// src/theme.js
import { createTheme } from '@mantine/core';

/**
 * This is the central theme configuration for the application, embodying the
 * "Focused Clarity" design direction. It is the single source of truth for all
 * visual styling, ensuring a cohesive and professional aesthetic.
 */
export const theme = createTheme({
  /**
   * 1. TYPOGRAPHY
   * We establish a clean, modern typographic scale using 'Inter' for its
   * excellent readability on screens.
   */
  fontFamily: 'Inter, sans-serif',
  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '600',
  },

  /**
   * 2. COLOR PALETTE
   * The color system is designed for clarity and purpose.
   * - Primary Color: 'blue.7' is used for all interactive elements to
   *   create a sense of trust and stability.
   * - Neutral Grays: A palette of grays provides depth and structure.
   * - Semantic Colors: Green and red are reserved exclusively for financial
   *   gain/loss indicators to avoid ambiguity.
   */
  primaryColor: 'blue',
  primaryShade: 7,

  /**
   * 3. SPACING
   * A consistent spacing scale ('md' as the default) creates a breathable,
   * uncluttered layout that helps users focus on the data.
   */
  spacing: {
    xs: '10px',
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
  },

  /**
   * 4. COMPONENT STYLES
   * Default styles for core components are defined here to enforce the design
   * system consistently across the entire application.
   */
  components: {
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
    Card: {
      defaultProps: {
        shadow: 'sm',
        radius: 'md',
        withBorder: true,
      },
      styles: (theme) => ({
        root: {
          borderColor: theme.colors.gray[2],
        },
      }),
    },
    // Add other component overrides here as the system grows
  },
});